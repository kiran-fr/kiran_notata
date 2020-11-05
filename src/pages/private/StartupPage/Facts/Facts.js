import React, { useEffect, useState } from "react";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import { creativeGet, creativeTemplateGet } from "Apollo/Queries";
import { creativePut } from "Apollo/Mutations";

import validateEmail from "utils/validateEmail";

import {
  Content,
  Card,
  BreadCrumbs,
  Modal,
  Button,
  SuccessBox,
  GhostLoader,
} from "Components/elements";

import { dashboard, startup_page } from "pages/definitions";

import {
  share_title,
  share_text,
  copy_link,
  facts_container,
  facts_section_container,
  facts_section_header,
  facts_section_description,
  facts_question_container,
  facts_question_header,
  facts_answer,
  facts_answer_link,
  no_answer,
  small_traffic_light,
  question_comments,
  edit_toggle,
} from "./Facts.module.css";

import { GeneralInput } from "./Inputs/GeneralInput";
import { CommentSection } from "./CommentSection";

export function Section({ section, creative }) {
  const { name, description } = section;
  return (
    <div>
      <div
        style={{
          marginTop: "30px",
          fontSize: "28px",
          position: "relative",
          bottom: "-8px",
          color: "var(--color-secondary)",
        }}
      >
        {name}
      </div>
      <div>{description}</div>
      {(section.questions || []).map((question, i) => (
        <Question
          key={`q-${i}`}
          question={question}
          section={section}
          creative={creative}
        />
      ))}
    </div>
  );
}

export function Question({ question, section, creative }) {
  return (
    <Card style={{ marginBottom: "10px", paddingBottom: "15px" }}>
      <div className="form_h2">{question.name}</div>
      <div className="form_p2">{question.description}</div>
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

function InviteStartup({ creative, connectionId, mutate, loading }) {
  const [showModal, setShowModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { register, handleSubmit, formState, setValue, errors } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
      })
    ),
  });
  const { isSubmitting } = formState;

  useEffect(() => {
    creative.sharedWithEmail && setValue("email", creative.sharedWithEmail);
  }, [creative.sharedWithEmail, setValue]);

  const shareUrl = `${window.location.protocol}//${window.location.host}/public/creative/${creative.id}&email=${creative.sharedWithEmail}`;

  const onSubmit = async (data, event) => {
    let email = data.email.toLowerCase().trim();
    if (!validateEmail(email)) return;

    try {
      let variables = {
        id: creative.id,
        input: { sharedWithEmail: data.email, connectionId },
      };
      await mutate({ variables });
    } catch (error) {
      console.log("error");
    }

    setShowModal(false);
  };

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
  }

  return (
    <>
      <Card style={{ paddingBottom: "20px" }}>
        {creative.sharedWithEmail && (
          <div>
            <div className={share_title}>This form can now be shared</div>

            <div className={share_text}>
              You can now share this form with{" "}
              <b style={{ color: "var(--color-primary)" }}>
                {creative.sharedWithEmail}
              </b>
              . No email has been sent from Notata, so you will have to copy the
              link and send it by email.
            </div>

            <SuccessBox
              style={{
                padding: "5px",
                fontSize: "12px",
                color: "var(--color-secondary)",
              }}
            >
              {shareUrl}
            </SuccessBox>

            <div className={copy_link} onClick={copyToClipboard}>
              {copySuccess ? "link copied to clipboard" : "copy link"}
            </div>

            <div
              style={{
                marginTop: "5px",
                textAlign: "right",
              }}
            >
              <Button
                type="right_arrow"
                loading={loading}
                onClick={async () => {
                  try {
                    let variables = {
                      id: creative.id,
                      input: { removeSharing: true, connectionId },
                    };
                    await mutate({ variables });
                    setCopySuccess(false);
                  } catch (error) {
                    console.log("error");
                  }
                }}
              >
                Revoke access
              </Button>
            </div>
          </div>
        )}

        {!creative.sharedWithEmail && (
          <div>
            <div className={share_title}>
              Invite startup to fill in this information.
            </div>
            <div className={share_text}>
              By inviting a startup to fill in this information you will
              generate a link that you can share with the startup. The startup
              will then have access to this form, and will be able to see all
              pre filled inforation you may have provided.
            </div>

            <div
              style={{
                marginTop: "5px",
                textAlign: "right",
              }}
            >
              <Button type="right_arrow" onClick={() => setShowModal(true)}>
                Invite startup
              </Button>
            </div>
          </div>
        )}
      </Card>
      {showModal && (
        <Modal
          title="Invite startup"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginTop: "30px" }}>
              <input
                type="text"
                placeholder={"name@email.com"}
                autoComplete="off"
                ref={register({ required: true })}
                name="email"
              />
              {errors && errors.email && (
                <p style={{ color: "red" }}>must be a valid email address</p>
              )}

              <div
                style={{
                  marginTop: "5px",
                  textAlign: "right",
                }}
              >
                <Button type="input" value="OK" loading={isSubmitting} />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function CompanyName({ creative, name }) {
  const [mutate] = useMutation(creativePut);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    name && setValue("input.name", name);
  }, [name, setValue]);

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
        placeholder="Company name"
        name="input.name"
        defaultValue={name}
        ref={register}
        onBlur={handleSubmit(onSubmit)}
      />
    </form>
  );
}

function MultipleChoiseAnswer({ question, answers }) {
  const _answers = answers.filter(({ inputType, questionId }) => {
    return inputType === "CHECK" && questionId === question.id;
  });

  if (!_answers.length) {
    return <div className={no_answer}>Not answered</div>;
  }

  return (
    <div className={facts_answer}>
      {_answers.map(({ val }) => val).join(", ")}
    </div>
  );
}

function RadioAnswer({ question, answers }) {
  const answer = answers.find(({ inputType, questionId }) => {
    return inputType === "RADIO" && questionId === question.id;
  });

  if (!answer) {
    return <div className={no_answer}>Not answered</div>;
  }

  return <div className={facts_answer}>{answer.val}</div>;
}

function InputTextAnswer({ question, answers }) {
  const answer = answers.find(
    ({ inputType, questionId }) =>
      inputType === "INPUT_TEXT" && questionId === question.id
  );

  if (!answer) {
    return <div className={no_answer}>Not answered</div>;
  }

  return <div className={facts_answer}>{answer.val}</div>;
}

function InputMutlipleLinesAnswer({ question, answers }) {
  const _answers = answers.filter(
    ({ inputType, questionId }) =>
      inputType === "INPUT_MUTLIPLE_LINES" && questionId === question.id
  );

  if (!_answers.length) {
    return <div className={no_answer}>Not answered</div>;
  }

  return (
    <>
      {_answers.map((answer, i) => {
        let firstThree = answer.val.substring(0, 3).toLowerCase();
        let isUrl = firstThree === "htt" || firstThree === "www";

        if (isUrl) {
          return (
            <div>
              <a
                className={facts_answer_link}
                key={i}
                href={answer.val}
                rel="noopener noreferrer"
                target="_blank"
              >
                {answer.val} <i className="fal fa-external-link-square" />
              </a>
            </div>
          );
        }

        return (
          <div key={i} className={facts_answer}>
            {answer.val}
          </div>
        );
      })}
    </>
  );
}

function InputTrafficLightsAnswer({ question, answers }) {
  const answer = answers.find(
    ({ inputType, questionId }) =>
      inputType === "TRAFFIC_LIGHTS" && questionId === question.id
  );

  if (!answer) {
    return <div className={no_answer}>Not answered</div>;
  }

  return (
    <div className={facts_answer}>
      <div
        className={small_traffic_light}
        style={{
          background: `var(--color-${answer.val})`,
        }}
      />{" "}
      {answer.val}
    </div>
  );
}

function GeneralAnswer(props) {
  switch (props.question.inputType) {
    case "CHECK":
      return <MultipleChoiseAnswer {...props} />;
    case "RADIO":
      return <RadioAnswer {...props} />;
    case "INPUT_TEXT":
      return <InputTextAnswer {...props} />;
    case "TRAFFIC_LIGHTS":
      return <InputTrafficLightsAnswer {...props} />;
    case "INPUT_MUTLIPLE_LINES":
      return <InputMutlipleLinesAnswer {...props} />;
    default:
      return <MultipleChoiseAnswer {...props} />;
  }
}

function AnswerCommentSection({ answers, question }) {
  const comments = answers.filter(
    ({ inputType, questionId }) =>
      inputType === "COMMENT" && questionId === question.id
  );

  if (!comments.length) {
    return <span />;
  }

  return (
    <div>
      {comments.map(({ val, id }) => (
        <div key={id} className={question_comments}>
          {val}
        </div>
      ))}
    </div>
  );
}

export function ViewSummary({ answers, creativeTemplate }) {
  return (
    <div className={facts_container}>
      {creativeTemplate.sections.map((section, i) => {
        const { name, description, questions } = section;
        return (
          <div key={`section-${i}`} className={facts_section_container}>
            <div className={facts_section_header}>{name}</div>
            <div className={facts_section_description}>{description}</div>
            <div>
              {questions.map((question, ii) => {
                return (
                  <div
                    key={`question-${i}-${ii}`}
                    className={facts_question_container}
                  >
                    <div className={facts_question_header}>{question.name}</div>
                    <GeneralAnswer answers={answers} question={question} />
                    <AnswerCommentSection
                      question={question}
                      answers={answers}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Facts({ history, match }) {
  const [editFacts, setEditFacts] = useState(false);

  const { id: connectionId, creativeId } = match.params;
  const [getData, { data, loading }] = useLazyQuery(creativeGet);
  const creative = (data || []).creativeGet || {};

  const creativeTemplateQuery = useQuery(creativeTemplateGet);
  const creativeTemplate =
    (creativeTemplateQuery.data || {}).creativeTemplateGet || {};

  const [mutate, { loading: mutationLoading }] = useMutation(creativePut);

  useEffect(() => {
    creativeId && getData({ variables: { id: creativeId } });
  }, [creativeId, getData]);

  if (loading || creativeTemplateQuery.loading) {
    return <GhostLoader />;
  }

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Dashboard",
            link: `${dashboard}`,
          },
          {
            val: `Startup: ${creative.name}`,
            link: `${startup_page}/${connectionId}`,
          },
          {
            val: `Facts`,
            link: `${startup_page}/${connectionId}/creative/${creative.id}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <CompanyName creative={creative} name={creative.name} />

        <InviteStartup
          connectionId={connectionId}
          creative={creative}
          mutate={mutate}
          loading={mutationLoading}
        />

        {!editFacts && (
          <div className={edit_toggle} onClick={() => setEditFacts(true)}>
            edit
          </div>
        )}

        {editFacts && (
          <div style={{ textAlign: "right" }}>
            <Button size="small" onClick={() => setEditFacts(false)}>
              back to summary
            </Button>
          </div>
        )}

        {editFacts &&
          (creativeTemplate.sections || []).map((section, i) => (
            <Section
              key={`section-${i}`}
              section={section}
              creative={creative}
            />
          ))}

        {!editFacts && (
          <Card>
            <ViewSummary
              creativeTemplate={creativeTemplate}
              answers={creative.answers}
            />
          </Card>
        )}
      </Content>
    </>
  );
}
