import React from "react";
import { useMutation } from "@apollo/client";

import { connectionSubjectiveScorePut } from "Apollo/Mutations";
import { group as group_route } from "../../../definitions";

import {
  subjective_score_name,
  subjective_score_val,
  subjective_score_average,
  subjective_score_each_container,
  subjective_score_each,
  set_score_container,
  set_score_each,
  active_score,
  from_group,
} from "./SubjectiveScore.module.css";
import classnames from "classnames";

export function SubjectiveScore({ connection, user, history }) {
  // console.log('connection.subjectiveScores', connection.subjectiveScores)
  // console.log('user', user)

  const [mutate] = useMutation(connectionSubjectiveScorePut);

  let subjectiveScores = connection.subjectiveScores || [];

  // console.log('subjectiveScores', subjectiveScores)

  let otherScores = [];
  for (let shared of connection.sharedWithMe) {
    if (shared.connection) {
      let arr = shared.connection.subjectiveScores || [];
      arr = arr.map(it => ({
        ...it,
        ref: {
          name: shared.groupName,
          id: shared.groupId,
        },
      }));
      otherScores = otherScores.concat(arr);
    }
  }

  let allScores = subjectiveScores.concat(otherScores);

  allScores = allScores.filter(({ createdByUser }) => createdByUser);

  let dups = {};
  allScores = allScores.filter(s => {
    if (dups[s.createdByUser.email]) return false;
    dups[s.createdByUser.email] = true;
    return true;
  });

  let averageScore;
  if (allScores.length) {
    let { score: ttl } = allScores.reduce((a, b) => ({
      score: a.score + b.score,
    }));
    averageScore = (ttl / allScores.length).toFixed(1);
  }

  let yourScore = (
    subjectiveScores.find(ss => ss.createdBy === user.cognitoIdentityId) || {}
  ).score;

  return (
    <div>
      {allScores.length > 1 && (
        <>
          <div className={subjective_score_average}>
            <div className={subjective_score_name}>
              Average subjective score (of {allScores.length})
            </div>
            <div className={subjective_score_val}>{averageScore}</div>
          </div>

          <div className={subjective_score_each_container}>
            {allScores.map((ss, i) => (
              <div key={`ss-${i}`} className={subjective_score_each}>
                <div className={subjective_score_name}>
                  {ss.createdByUser.given_name} {ss.createdByUser.family_name}
                  {ss.createdBy === user.cognitoIdentityId && (
                    <span style={{ opacity: 0.4 }}> (you)</span>
                  )}
                  {ss.ref && (
                    <div
                      className={from_group}
                      onClick={() => {
                        let path = `${group_route}/${ss.ref.id}`;
                        history.push(path);
                      }}
                    >
                      From group: <span>{ss.ref.name}</span>
                    </div>
                  )}
                </div>
                <div className={subjective_score_val}>{ss.score}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className={set_score_container}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sc => (
          <div
            key={`sc-${sc}`}
            className={classnames(
              set_score_each,
              yourScore === sc ? active_score : ""
            )}
            onClick={() => {
              let variables = {
                id: connection.id,
                score: sc,
              };

              let sS = subjectiveScores || [];

              let action =
                yourScore === sc ? "delete" : yourScore ? "update" : "add";

              // Remove
              if (action === "delete") {
                sS = subjectiveScores.filter(
                  s => s.createdBy !== user.cognitoIdentityId
                );
              }

              // Add new
              if (action === "add") {
                let optimisticItem = {
                  createdAt: new Date().getTime(),
                  createdBy: user.cognitoIdentityId,
                  score: sc,
                  responseType: "update",
                  __typename: "SubjectiveScore",
                  createdByUser: {
                    email: user.email,
                    family_name: user.family_name,
                    given_name: user.given_name,
                    __typename: "SimpleUser",
                  },
                };
                sS = [...subjectiveScores, optimisticItem];
              }

              // Update exisiting
              if (action === "update") {
                sS = subjectiveScores.map(s =>
                  s.createdBy !== user.cognitoIdentityId
                    ? s
                    : { ...s, score: sc }
                );
              }

              mutate({
                variables,
                optimisticResponse: {
                  __typename: "Mutation",
                  connectionSubjectiveScorePut: {
                    ...connection,
                    subjectiveScores: sS,
                  },
                },
              });
            }}
          >
            {sc}
          </div>
        ))}
      </div>
    </div>
  );
}
