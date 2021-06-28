import React, { useEffect, useState } from "react";
// API Stuff
import { useMutation } from "@apollo/client";
import { connectionSubjectiveScorePut } from "private/Apollo/Mutations";
// STYLES 
import styles from "./styles.module.css";

// OTHERS 
import classnames from "classnames";

function getMyScore({ connection }) {
  return connection?.subjectiveScores?.find(({ isMe }) => isMe)?.score;
}

export function AddScore({ connection }) {
  // States
  const [subjectiveScore, setSubjectiveScore] = useState("");

  // mutations
  const [mutate] = useMutation(connectionSubjectiveScorePut);

  // store the value in state
  const handleUpdateScore = newScore => {
    setSubjectiveScore(newScore);
    let variables = {
      id: connection.id,
      score: newScore,
    };
    mutate({ variables });
  };

  // score given by this user or not
  useEffect(() => {
    let yourScore = getMyScore({ connection });
    setSubjectiveScore(yourScore || "");
  }, [connection && !subjectiveScore]);

  return (
    <div className={styles.score}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sc => (
        <div
          key={`sc-${sc}`}
          className={classnames(
            styles.child,
            subjectiveScore === sc ? styles.activeChild : ""
          )}
          onClick={() => handleUpdateScore(sc)}
        >
          <p>{sc}</p>
        </div>
      ))}
    </div>
  );
}
