import React from "react";
import { Mutation } from "@apollo/client/react/components";
import classnames from "classnames";

import { connectionSubjectiveScorePut } from "../../../Apollo/Mutations";

import {
  section,
  section_title,
  scores_table,
  scores_row,
  scores_cell,
  scores_sum
} from "./ConnectionCard.module.css";

import {
  subjective_each_container,
  subjective_each,
  subjective_each_active
} from "./SubjectivityBox.module.css";

const getSubjectiveScores = ({
  subjectiveScores,
  responseType,
  user,
  newScore
}) => {
  subjectiveScores = subjectiveScores || [];

  if (responseType === "delete") {
    subjectiveScores = subjectiveScores.filter(
      s => s.createdBy !== user.cognitoIdentityId
    );
  }

  if (responseType === "update") {
    subjectiveScores = subjectiveScores.map(s =>
      s.createdBy === user.cognitoIdentityId ? { ...s, ...newScore } : s
    );
  }

  if (responseType === "new") {
    subjectiveScores.push({
      ...newScore,
      createdByUser: {
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name
      }
    });
  }

  return subjectiveScores;
};

const SubjectivityBox = ({ connection, user }) => {
  let subjectiveScores = connection ? connection.subjectiveScores : [];
  let connectionId = connection ? connection.id : null;

  let sum;
  if (subjectiveScores.length) {
    sum = subjectiveScores.reduce((ttl, obj) => (ttl || 0) + obj.score, 0);
  }

  let average = (sum / subjectiveScores.length).toFixed(1);

  return (
    <div className={section}>
      <div className={section_title}>Subjective score</div>

      <Mutation mutation={connectionSubjectiveScorePut}>
        {(mutate, { data, loading, error }) => {
          let yourScore = (
            subjectiveScores.find(
              ss => ss.createdBy === user.cognitoIdentityId
            ) || {}
          ).score;
          return (
            <div className={subjective_each_container}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(subjectiveScore => (
                <div
                  key={`sc-${subjectiveScore}`}
                  className={classnames(
                    subjective_each,
                    yourScore === subjectiveScore ? subjective_each_active : ""
                  )}
                  onClick={() => {
                    let variables = {
                      id: connectionId,
                      score: subjectiveScore
                    };

                    let sS = subjectiveScores || [];

                    let action =
                      yourScore === subjectiveScore
                        ? "delete"
                        : yourScore
                        ? "update"
                        : "add";

                    // Remove
                    if (action === "delete") {
                      sS = subjectiveScores.filter(
                        s => s.createdBy !== user.cognitoIdentityId
                      );
                    }

                    // Add new
                    if (action === "add") {
                      sS.push({
                        createdAt: new Date().getTime(),
                        createdBy: user.cognitoIdentityId,
                        score: subjectiveScore,
                        responseType: "update",
                        __typename: "SubjectiveScore",
                        createdByUser: {
                          email: user.email,
                          family_name: user.family_name,
                          given_name: user.given_name,
                          __typename: "SimpleUser"
                        }
                      });
                    }

                    // Update exisiting
                    if (action === "update") {
                      sS = subjectiveScores.map(s =>
                        s.createdBy !== user.cognitoIdentityId
                          ? s
                          : { ...s, score: subjectiveScore }
                      );
                    }

                    mutate({
                      variables,
                      optimisticResponse: {
                        __typename: "Mutation",
                        connectionSubjectiveScorePut: {
                          ...connection,
                          subjectiveScores: sS
                        }
                      }
                    });
                  }}
                >
                  {subjectiveScore}
                </div>
              ))}
            </div>
          );
        }}
      </Mutation>

      {(subjectiveScores.length >= 2 ||
        (subjectiveScores[0] || {}).createdBy !== user.cognitoIdentityId) && (
        <div className={scores_table}>
          {subjectiveScores.map((sc, i) => (
            <div key={`subjectiveScores-${i}`} className={scores_row}>
              <div className={scores_cell}>
                <div>
                  {sc.createdByUser.given_name} {sc.createdByUser.family_name}
                </div>
                <div>{sc.score}</div>
              </div>
            </div>
          ))}

          {subjectiveScores.length >= 2 && (
            <div className={classnames(scores_row, scores_sum)}>
              <div className={scores_cell}>
                <div>Average</div>
                <div>{average}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectivityBox;
