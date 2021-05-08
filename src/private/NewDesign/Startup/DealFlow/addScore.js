import React, { useState, useEffect } from "react";

// API Stuff
import { useMutation } from "@apollo/client";
import { connectionSubjectiveScorePut } from "private/Apollo/Mutations";

import classnames from "classnames";
import styles from "./modal.module.css";

// Main function

export function AddScore({ connection, user }) {
  // Define data
  const subjectiveScores = connection?.subjectiveScores || [];

  const [subScore, setSubScore] = useState("");
  // Get your score
  let { score: yourScore } =
    subjectiveScores.find(ss => ss.createdBy === user.cognitoIdentityId) || {};

  // Mutation
  const [mutate] = useMutation(connectionSubjectiveScorePut);

  useEffect(() => {
    let { score: yourScore } =
      subjectiveScores.find(ss => ss.createdBy === user.cognitoIdentityId) ||
      {};
    setSubScore(yourScore ? yourScore : "");
  }, [connection]);

  const handleScoreVal = sc => {
    let variables = {
      id: connection.id,
      score: sc,
    };

    let sS = subjectiveScores || [];

    let action = yourScore === sc ? "delete" : yourScore ? "update" : "add";

    // Remove
    if (action === "delete") {
      sS = subjectiveScores.filter(s => s.createdBy !== user.cognitoIdentityId);
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

    // Update existing
    if (action === "update") {
      sS = subjectiveScores.map(s =>
        s.createdBy !== user.cognitoIdentityId ? s : { ...s, score: sc }
      );
    }

    let optimisticResponse = {
      __typename: "Mutation",
      connectionSubjectiveScorePut: {
        ...connection,
        subjectiveScores: sS,
      },
    };

    mutate({
      variables,
      optimisticResponse,
    });
    setSubScore(sc);
  };

  return (
    <div className={styles.score}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sc => (
        <div
          key={`sc-${sc}`}
          className={classnames(
            styles.child,
            subScore === sc ? styles.activeChild : ""
          )}
          onClick={() => handleScoreVal(sc)}
        >
          <p>{sc}</p>
        </div>
      ))}
    </div>
  );
}
