import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { publicCreativePut } from "Apollo/Mutations";

import { publicCreativeGet, publicCreativeTemplateGet } from "Apollo/Queries";

import {
  Content,
  Card,
  Button,
  SuccessBox,
  ErrorBox,
  GhostLoader,
} from "Components/elements";

import { GeneralInput } from "./Inputs/GeneralInput";
import { CommentSection } from "./CommentSection";

import { sectionName } from "./PublicCreative.module.css";

function Question({ question, section, creative, setAnswers, answers }) {
  const { name, description } = question;
  return (
    <Card
      style={{ marginBottom: "10px", paddingBottom: "15px", marginTop: "0px" }}
    >
      <div className="form_h2">{name}</div>
      <div className="form_p2">{description}</div>
      <hr />
      <div style={{ padding: "10px" }}>
        <GeneralInput
          question={question}
          section={section}
          creative={creative}
          setAnswers={setAnswers}
          answers={answers}
        />
      </div>
      <CommentSection
        question={question}
        section={section}
        creative={creative}
      />
    </Card>
  );
}

function Submit({ creative, accountId, answers, name }) {
  const [success, setSuccess] = useState(false);
  const [mutate, { loading }] = useMutation(publicCreativePut);

  return (
    <div>
      {!success && (
        <div style={{ textAlign: "right" }}>
          <Button
            type="right_arrow"
            loading={loading}
            onClick={async () => {
              const answersArray = Object.values(answers)
                .flat()
                .map(answer => {
                  if (answer.inputType === "INPUT_MUTLIPLE_LINES")
                    delete answer.id;

                  return answer;
                });

              console.log(answersArray);
              // setSuccess(false);
              const variables = {
                id: creative.id || "",
                accountId: accountId,
                input: {
                  submit: true,
                  name: name,
                  answerNew: answersArray,
                },
              };
              try {
                await mutate({ variables });
                setSuccess(true);
              } catch (error) {
                console.log("error", error);
              }
            }}
          >
            Submit
          </Button>
        </div>
      )}
      {success && !loading && (
        <div style={{ marginTop: "20px" }}>
          <SuccessBox>
            Your information has been submitted, and the investor received your
            request.
          </SuccessBox>
        </div>
      )}
    </div>
  );
}

const CompanyName = ({ setName }) => (
  <div className="focus_form" style={{ marginBottom: "20px" }}>
    <textarea
      className="form_h1"
      rows={1}
      placeholder="Your company name"
      name="input.name"
      onBlur={e => {
        setName(e.target.value);
      }}
    />
  </div>
);

export function PublicCreative({ match }) {
  const { id, accountId } = match.params;

  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [getCreative, creativeQuery] = useLazyQuery(publicCreativeGet);

  let creative = (creativeQuery.data || {}).publicCreativeGet;

  const [getCreativeTemplate, creativeTemplateQuery] = useLazyQuery(
    publicCreativeTemplateGet
  );
  const template = (creativeTemplateQuery.data || {}).publicCreativeTemplateGet;

  useEffect(() => {
    if (id) getCreative({ variables: { id } });

    getCreativeTemplate();
  }, [id && getCreative, getCreativeTemplate, id]);

  const error = creativeQuery.error || creativeTemplateQuery.error;
  const loading = creativeQuery.loading || creativeTemplateQuery.loading;

  if (error) {
    console.log("creativeQuery.error", creativeQuery.error);
    console.log("creativeTemplateQuery.error", creativeTemplateQuery.error);

    return (
      <Content maxWidth={600} center>
        <ErrorBox>Form not found...</ErrorBox>
      </Content>
    );
  }

  if (!creative) {
    creative = {
      id: null,
      name: "",
      description: "External Form",
      templateId: "",
      sharedWithEmail: null,
      sharedByEmail: null,
      submit: false,
      answers: [],
    };
  }

  if (!loading && creative && template)
    return (
      <Content maxWidth={600}>
        <CompanyName setName={setName} />

        {creative.id && (
          <div>
            <span style={{ color: "var(--color-primary)" }}>
              {creative.sharedByEmail}{" "}
            </span>
            have invited you to share some information about your company with
            them. Fill out the relevant parts of this form, and hit "submit"
            when you are ready.
          </div>
        )}

        {(template.sections || []).map((section, i) => (
          <div key={`section-${i}`}>
            <div className={sectionName}>{section.name}</div>
            <div>{section.description}</div>
            {(section.questions || []).map((question, ii) => (
              <Question
                key={`q-${i}-${ii}`}
                question={question}
                section={section}
                creative={creative}
                setAnswers={setAnswers}
                answers={answers}
              />
            ))}
          </div>
        ))}

        <Submit
          creative={creative}
          accountId={accountId}
          answers={answers}
          name={name}
        />
      </Content>
    );

  return <GhostLoader />;
}
