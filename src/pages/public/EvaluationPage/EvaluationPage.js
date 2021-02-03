import React, { useState, useEffect } from "react";
import { omit } from "lodash";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { publicCreativeGet, publicEvaluationTemplateGet } from "Apollo/Queries";
import { publicEvaluationPut } from "Apollo/Mutations";
import { public_presentation } from "pages/definitions";

import styles from "./EvaluationPage.module.css";
import {
  Content,
  ErrorBox,
  GhostLoader,
  Button,
  SuccessBox,
} from "Components/elements";
import Section from "./Section";

function getDefaultData({ creative }) {
  const creativeDetails = {};

  const location = creative.answers.find(
    ({ questionId }) => questionId === "q04_section_info"
  );
  const contactPerson = creative.answers.find(
    ({ questionId }) => questionId === "q05_section_info"
  );
  const name = creative.name;

  if (location) creativeDetails.location = location.val;

  if (contactPerson) creativeDetails.contactPerson = contactPerson.val;

  if (name) creativeDetails.name = name;

  return { creativeDetails };
}

export function EvaluationPage({ match }) {
  const [sectionId, setSectionId] = useState("");
  const [answers, setAnswers] = useState([]);
  let { connectionId, creativeId, templateId } = match.params;

  const [getEvaluationTemplateData, evaluationTemplateQuery] = useLazyQuery(
    publicEvaluationTemplateGet
  );
  const { data, loading, error } = useQuery(publicCreativeGet, {
    variables: { id: creativeId },
  });
  const [mutate, { loading: mutateLoading, data: mutateData }] = useMutation(
    publicEvaluationPut
  );

  useEffect(() => {
    getEvaluationTemplateData({
      variables: { id: templateId },
    });
  }, [getEvaluationTemplateData]);

  const submitEvaluation = async ({ firstname, lastname, email }) => {
    await mutate({
      variables: {
        connectionId: connectionId,
        input: {
          templateId,
          answers: answers.map(ans => omit(ans, ["id"])),
        },
        given_name: firstname,
        family_name: lastname,
        email,
      },
    });
  };

  if (mutateData?.publicEvaluationPut)
    return (
      <div className={styles.success}>
        <SuccessBox>
          <div>Thank You🎉</div>
        </SuccessBox>
      </div>
    );

  const sections =
    evaluationTemplateQuery.data?.publicEvaluationTemplateGet.sections || [];

  if (sections.length > 0 && !sectionId) setSectionId(sections[0].id);

  if (loading || mutateLoading) return <GhostLoader />;

  const presentation = getDefaultData({
    creative: data?.publicCreativeGet,
  });

  if (error || (!loading && !presentation)) {
    return (
      <Content maxWidth={600} center>
        <ErrorBox>
          This page cannot be found. This might happen if the person that shared
          it with you have revoked the sharing.
        </ErrorBox>
      </Content>
    );
  }
  const publicLink = `${window.location.protocol}//${window.location.host}${public_presentation}/${creativeId}`;

  return (
    <Content maxWidth={780} style={{ position: "relative", top: "-20px" }}>
      <h1 className={styles.header}>Evaluate</h1>

      <div className={styles.info_line}>
        You have been invited to evaluate startup!
      </div>

      <div className={styles.facts_section}>
        <div className={styles.facts_byline}>
          <div className={styles.facts_byline_label}>Company name:</div>
          <div>{presentation?.creativeDetails?.name}</div>
        </div>

        {presentation?.creativeDetails?.location && (
          <div className={styles.facts_byline}>
            <div className={styles.facts_byline_label}>Location:</div>
            <div>{presentation?.creativeDetails?.location}</div>
          </div>
        )}

        {presentation?.creativeDetails?.contactPerson && (
          <div className={styles.facts_byline}>
            <div className={styles.facts_byline_label}>Contact person:</div>
            <div>{presentation?.creativeDetails?.contactPerson}</div>
          </div>
        )}
      </div>

      <Button
        type="right_arrow"
        onClick={() => window.open(publicLink, "_blank")}
      >
        View Company Info
      </Button>

      <hr />

      <Section
        sectionId={sectionId}
        setSectionId={setSectionId}
        sections={sections}
        answers={answers}
        setAnswers={setAnswers}
        submitEvaluation={submitEvaluation}
      />
    </Content>
  );
}