import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { publicCreativePut } from "../../../Apollo/Mutations";

import {
  publicCreativeGet,
  publicCreativeTemplateGet,
} from "../../../Apollo/Queries";

import {
  Content,
  Card,
  Button,
  SuccessBox,
  ErrorBox,
  GhostLoader,
} from "../../../Components/elements";

import { GeneralInput } from "./Inputs/GeneralInput";
import { CommentSection } from "./CommentSection";

import { sectionName } from "./PublicCreative.module.css";

function Question({ question, section, creative }) {
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

function Submit({ creative }) {
  const [setSuccess] = useState(false);
  const [mutate, { loading }] = useMutation(publicCreativePut);

  return (
    <div>
      <div style={{ textAlign: "right" }}>
        <Button
          type="right_arrow"
          loading={loading}
          onClick={async () => {
            setSuccess(false);
            const variables = {
              id: creative.id,
              input: { submit: true },
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

      {creative.submit && !loading && (
        <div style={{ marginTop: "20px" }}>
          <SuccessBox>
            Your information has been submitted, and the investor that requested
            this information have been notified on {creative.sharedByEmail}. You
            may still change the information in this form. By clicking "submit"
            again, the investor will get notified again.
          </SuccessBox>
        </div>
      )}
    </div>
  );
}

function CompanyName({ creative }) {
  const [mutate] = useMutation(publicCreativePut);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data, event) => {
    let variables = { id: creative.id, ...data };
    try {
      await mutate({ variables });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="focus_form"
      onSubmit={handleSubmit(onSubmit)}
      style={{ marginBottom: "20px" }}
    >
      <textarea
        className="form_h1"
        rows={1}
        placeholder="Your company name"
        name="input.name"
        defaultValue={creative.name}
        ref={register}
        onBlur={handleSubmit(onSubmit)}
      />
    </form>
  );
}

export function PublicCreative({ match }) {
  console.log("PublicCreative");

  const { id } = match.params;

  const [getCreative, creativeQuery] = useLazyQuery(publicCreativeGet);
  const creative = (creativeQuery.data || {}).publicCreativeGet;

  const [getCreativeTemplate, creativeTemplateQuery] = useLazyQuery(
    publicCreativeTemplateGet
  );
  const template = (creativeTemplateQuery.data || {}).publicCreativeTemplateGet;

  useEffect(() => {
    if (id) {
      getCreative({ variables: { id } });
      getCreativeTemplate();
    }
  }, []);

  const error = creativeQuery.error || creativeTemplateQuery.error;
  const loading = creativeQuery.loading || creativeTemplateQuery.loading;

  console.log("template", template);

  if (error) {
    console.log("creativeQuery.error", creativeQuery.error);
    console.log("creativeTemplateQuery.error", creativeTemplateQuery.error);

    return (
      <Content maxWidth={600} center>
        <ErrorBox>Form not found...</ErrorBox>
      </Content>
    );
  }

  if (!loading && creative && template) {
    return (
      <>
        <Content maxWidth={600}>
          <CompanyName creative={creative} />

          <div>
            <span style={{ color: "var(--color-primary)" }}>
              {creative.sharedByEmail}
            </span>{" "}
            have invited you to share some information about your company with
            them. Fill out the relevant parts of this form, and hit "submit"
            when you are ready.
          </div>

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
                />
              ))}
            </div>
          ))}

          <Submit creative={creative} />
        </Content>
      </>
    );
  }

  return <GhostLoader />;
}
