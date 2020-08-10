import React, { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import moment from "moment";

import { connectionGet, evaluationTemplateGet } from "../../../Apollo/Queries";

import { startup_page } from "../../../routes";
import { getPossibleScore, getScore } from "./util";

import { row } from "./Summary.module.css";

import {
  Card,
  BreadCrumbs,
  GhostLoader,
  Table,
  Button,
  Content,
} from "../../elements/";

export default function Summary({ match }) {
  const {
    data: connectionGetData,
    loading: connectionGetLoading,
    error: connectionGetError,
  } = useQuery(connectionGet, {
    variables: { id: match.params.connectionId },
  });

  const [
    getData,
    {
      data: evaluationTemplateGetData,
      loading: evaluationTemplateGetLoading,
      error: evaluationTemplateGetError,
      called,
    },
  ] = useLazyQuery(evaluationTemplateGet);

  useEffect(() => {
    if (connectionGetData) {
      const evaluation = connectionGetData.connectionGet.evaluations.find(
        ({ id }) => id === match.params.evaluationId
      );

      getData({
        variables: {
          id: evaluation.templateId,
        },
      });
    }
  }, [connectionGetData]);

  if (
    (!connectionGetData && connectionGetLoading) ||
    !called ||
    (!evaluationTemplateGetData && evaluationTemplateGetLoading)
  ) {
    return <GhostLoader />;
  }

  if (connectionGetError || evaluationTemplateGetError) {
    console.log(connectionGetError);
    console.log(evaluationTemplateGetError);

    return <p>We are updating</p>;
  }

  const evaluation = connectionGetData.connectionGet.evaluations.find(
    ({ id }) => id === match.params.evaluationId
  );

  return (
    <div>
      <BreadCrumbs
        list={[
          {
            val: `Startup: ${connectionGetData.connectionGet.creative.name}`,
            link: `${startup_page}/${match.params.connectionId}`,
          },
        ]}
      />
      <Content maxWidth={600}>
        <Card maxWidth={1200}>
          <div className={row}>
            <label>Summary</label>
            <span>
              <label>Last updated</label>
              <label>{moment(evaluation.updatedAt).format("lll")}</label>
            </span>
          </div>
          {evaluationTemplateGetData.evaluationTemplateGet.sections.map(
            ({ name, questions, id }) => (
              <div className={row} key={id}>
                <label>{name}</label>
                <label>
                  {getScore(questions, evaluation.answers)}/
                  {getPossibleScore(questions)}
                </label>
              </div>
            )
          )}
          <div className={row}>
            <label>Total</label>
            <label>
              {evaluationTemplateGetData.evaluationTemplateGet.sections.reduce(
                (acc, { questions }) =>
                  acc + getScore(questions, evaluation.answers),
                0
              )}
              /
              {evaluationTemplateGetData.evaluationTemplateGet.sections.reduce(
                (acc, { questions }) => acc + getPossibleScore(questions),
                0
              )}
            </label>
          </div>
        </Card>
        {evaluationTemplateGetData.evaluationTemplateGet.sections.map(
          ({ name, questions, id }) => {
            const sectionScore = getScore(questions, evaluation.answers);
            const sectionPossibleScore = getPossibleScore(questions);
            return (
              <Card maxWidth={1200} key={id}>
                <div className={row}>
                  <label>{name}</label>
                  <span>
                    <label> % completed</label>
                    <label>
                      {sectionScore} out of {sectionPossibleScore} points
                    </label>
                  </span>
                </div>
                {questions.map(({ name, id, inputType, options }) => {
                  const answer = evaluation.answers.find(
                    ({ questionId, inputType: ansInputType }) =>
                      questionId === id && inputType === ansInputType
                  );

                  return (
                    <div key={id}>
                      <p>{name}</p>
                      {answer && (
                        <>
                          {(inputType === "INPUT_TEXT" ||
                            inputType === "RADIO" ||
                            inputType === "TRAFFIC_LIGHTS") && (
                            <p>{answer.val}</p>
                          )}
                          {inputType === "CHECK" && (
                            <>
                              {evaluation.answers
                                .filter(
                                  ({ questionId, val, inputType }) =>
                                    questionId === id &&
                                    val &&
                                    inputType === "CHECK"
                                )
                                .map(({ val, id }) => (
                                  <p key={id}>{val}</p>
                                ))}
                            </>
                          )}
                        </>
                      )}
                      <p>comments</p>
                      {evaluation.answers
                        .filter(
                          ({ inputType, questionId }) =>
                            inputType === "COMMENT" && id === questionId
                        )
                        .map(({ val, id }) => (
                          <p key={id}>{val}</p>
                        ))}
                      <br />
                    </div>
                  );
                })}
              </Card>
            );
          }
        )}
      </Content>
    </div>
  );
}
