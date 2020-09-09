import React, { useEffect } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import {
  groupGet,
  // connectionsGet,
  creativeTemplateGet,
  logGet,
  evaluationTemplateGet,
} from "../../../Apollo/Queries";

import { connectionPut } from "../../../Apollo/Mutations";

import { startup_page, group as group_route } from "../../definitions";

import moment from "moment";
import {
  BreadCrumbs,
  Content,
  Card,
  Tag,
  Button,
  GhostLoader,
} from "../../../Components/elements";

import {
  header_comp,
  sub_header,
  facts_container,
  facts_section_container,
  facts_section_header,
  facts_section_description,
  facts_question_container,
  facts_question_header,
  facts_answer,
  facts_answer_link,
  no_answer,
  subjectiveScore_container,
  subjectiveScore_name,
  subjectiveScore_value,
  comment_each,
  small_traffic_light,
  question_comments,
} from "./GroupConnection.module.css";

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

function CommentSection({ answers, question }) {
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

function Facts({ answers, creativeTemplate, with_comments }) {
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
                    {/*<div className={facts_question_description}>{question.description}</div>*/}
                    <GeneralAnswer answers={answers} question={question} />
                    {with_comments && (
                      <CommentSection question={question} answers={answers} />
                    )}
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

function Comments({ connection }) {
  const logQuery = useQuery(logGet, {
    variables: { connectionId: connection.id },
  });
  if (logQuery.loading) {
    return <span>loading...</span>;
  }
  let comments = logQuery.data.logGet.filter(l => l.logType === "COMMENT");
  if (!comments.length) {
    return <span>There are no comments for this startup</span>;
  }
  return (
    <>
      {comments.map((commentItem, i) => {
        let comment = commentItem.dataPairs[0].val;
        return (
          <div key={i} className={comment_each}>
            {comment}
          </div>
        );
      })}
    </>
  );
}

function Evaluation({ evaluation, with_comments }) {
  const evaluationTemplateQuery = useQuery(evaluationTemplateGet, {
    variables: { id: evaluation.templateId },
  });
  if (evaluationTemplateQuery.loading || !evaluationTemplateQuery.data) {
    return <span>... loading</span>;
  }
  const evaluationTemplate = evaluationTemplateQuery.data.evaluationTemplateGet;

  return (
    <div className={facts_container}>
      {evaluationTemplate.sections.map(({ name, questions, id }) => {
        return (
          <div key={id} className={facts_section_container}>
            <div className={facts_section_header}>{name}</div>

            <div>
              {questions.map((question, i) => {
                return (
                  <div key={`${id}-${i}`} className={facts_question_container}>
                    <div className={facts_question_header}>{question.name}</div>

                    <GeneralAnswer
                      answers={evaluation.answers}
                      question={question}
                    />
                    {with_comments && (
                      <CommentSection
                        question={question}
                        answers={evaluation.answers}
                      />
                    )}
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

function AddButton({ creative, history }) {
  const [mutate, { error, loading }] = useMutation(connectionPut);

  return (
    <div style={{ textAlign: "right" }}>
      <Button
        type="right_arrow"
        loading={loading}
        onClick={async () => {
          if (loading) return;
          try {
            let res = await mutate({ variables: { creativeId: creative.id } });
            const { id } = res.data.connectionPut;
            history.push(`${startup_page}/${id}`);
          } catch (error) {
            return console.log("error", error);
          }
          console.log("addCreative...", creative);
        }}
      >
        Add to my startups
      </Button>

      {error && (
        <div
          style={{
            fontSize: "12px",
            marginTop: "10px",
            color: "var(--color-red)",
          }}
        >
          Hmm... we got an error. Sure you don't already have this startup in
          your list?
        </div>
      )}
    </div>
  );
}

export default function GroupConnection({ match, history }) {
  const id = match.params.id;
  const connectionId = match.params.connectionId;

  const [getData, groupGetQuery] = useLazyQuery(groupGet);
  const creativeTemplateQuery = useQuery(creativeTemplateGet);

  useEffect(() => {
    getData({ variables: { id } });
  }, []);

  const loading = groupGetQuery.loading || creativeTemplateQuery.loading;
  const error = groupGetQuery.error || creativeTemplateQuery.error;
  const hasData = groupGetQuery.data && creativeTemplateQuery.data;

  if (loading || !hasData) {
    return <GhostLoader />;
  }

  if (error) {
    console.log("error", error);
    return <div>We're updating...</div>;
  }

  let group = groupGetQuery.data.groupGet;
  let startups = group.startups;
  let shared_startup = startups.find(c => c.connectionId === connectionId);
  let connection = shared_startup.connection;
  let creative = connection.creative;
  let creativeTemplate = creativeTemplateQuery.data.creativeTemplateGet;

  const {
    comments: with_comments,
    evaluations: with_evaluations,
    subjective_score: with_subjectiveScore,
    tags: with_tags,
  } = shared_startup;

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "all groups",
            link: `${group_route}`,
          },
          {
            val: `Group: ${group.name}`,
            link: `${group_route}/${id}`,
          },
          {
            val: `Startup: ${(connection.creative || {}).name}`,
            link: `${group_route}/${id}/${connection.id}`,
          },
        ]}
      />

      <Content maxWidth={600}>
        {/*HEADER*/}
        <Card style={{ paddingBottom: "20px" }}>
          <div className={header_comp}>{creative.name}</div>

          <div className={sub_header}>
            Shared by{" "}
            <b>
              {shared_startup.sharedBy} on{" "}
              {moment(shared_startup.createdAt).format("lll")}.
            </b>
          </div>

          <AddButton creative={creative} history={history} />
        </Card>

        {/*FACTS*/}
        <Card label="Facts">
          <Facts
            answers={connection.creative.answers}
            creativeTemplate={creativeTemplate}
            with_comments={with_comments}
          />
        </Card>

        {/*TAGS*/}
        {with_tags && (
          <Card label="Tags" style={{ paddingBottom: "20px" }}>
            {connection.tags.map(({ name }, i) => (
              <Tag key={i}>{name}</Tag>
            ))}
          </Card>
        )}

        {/*SUBJECTIVE SCORE*/}
        {with_subjectiveScore && (
          <Card label="Subjective score" style={{ paddingBottom: "20px" }}>
            {(connection.subjectiveScores || []).map((subjectiveScore, i) => {
              return (
                <div key={i} className={subjectiveScore_container}>
                  <div className={subjectiveScore_name}>
                    {subjectiveScore.createdByUser.given_name}{" "}
                    {subjectiveScore.createdByUser.family_name}
                  </div>
                  <div className={subjectiveScore_value}>
                    {subjectiveScore.score}
                  </div>
                </div>
              );
            })}
          </Card>
        )}

        {/*COMMENTS*/}
        {with_comments && (
          <Card label="Comments" style={{ paddingBottom: "20px" }}>
            <Comments connection={connection} />
          </Card>
        )}

        {/*EVALUATIONS*/}
        {with_evaluations &&
          (connection.evaluations || []).map((evaluation, i) => {
            return (
              <Card
                label={`Evaluation: ${evaluation.name}`}
                style={{ paddingBottom: "20px" }}
                key={i}
              >
                <Evaluation
                  key={i}
                  evaluation={evaluation}
                  with_comments={with_comments}
                />
              </Card>
            );
          })}

        <AddButton creative={creative} history={history} />
      </Content>
    </>
  );
}
