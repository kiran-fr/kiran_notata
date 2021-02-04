import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { connectionSubjectiveScorePut } from "Apollo/Mutations";
import classnames from "classnames";
import { Modal } from "Components/elements";
import styles from "../../NewStartupPage/StartupPageComponents/SubjectiveScore.module.css";

export default function SetSubjectiveScore({ connection, close }) {
  const [mutate] = useMutation(connectionSubjectiveScorePut);
  const [currentScore, setCurrentScore] = useState();

  return (
    <Modal title="Set subjective score" close={close}>
      <div className={styles.set_score_container}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sc => (
          <div
            key={`sc-${sc}`}
            className={classnames(
              styles.set_score_each,
              currentScore === sc ? styles.active_score : ""
            )}
            onClick={() => {
              let variables = {
                id: connection.id,
                score: sc,
              };
              setCurrentScore(sc);
              mutate({ variables });
            }}
          >
            {sc}
          </div>
        ))}
      </div>
    </Modal>
  );
}
