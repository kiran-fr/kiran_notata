import React from "react";

import { Button, Card } from "Components/elements";
import { startup_page } from "pages/definitions";

import StartupInfoSection from "./StartupInfoSection";

export function Facts({ connection, user, match, history }) {
  const { creative } = connection;
  const { sharedWithEmail, submit: submitted } = creative;
  const answers = (creative && creative.answers) || [];

  const answerCount = [...new Set(answers.map(({ questionId }) => questionId))]
    .length;
  const isUntouched = !sharedWithEmail && !submitted && !answerCount;

  const isMine = creative.accountId === user.accountId;

  // if (!isMine && isUntouched) {
  //   return <span/>
  // }

  return (
    <Card
      // label="STARTUP INFO"
      style={{ paddingBottom: "20px" }}
    >
      <div style={{ padding: "10px" }}>
        <h1 style={{ marginBottom: "10px" }}>{connection.creative.name}</h1>

        {!isUntouched && (
          <StartupInfoSection creative={creative} answers={answers} />
        )}
      </div>

      {/*{isUntouched && (*/}
      {/*  <div>*/}
      {/*    <div style={{ fontSize: "18px" }}>Facts</div>*/}
      {/*    <div*/}
      {/*      style={{ padding: "20px 0px", color: "var(--color-gray-medium)" }}*/}
      {/*    >*/}
      {/*      Facts is the part that you share with the startups. You can invite a*/}
      {/*      startup to fill out this part .*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      {isMine && (
        <div
          style={{
            textAlign: "right",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <Button
            size="small"
            type="right_arrow"
            onClick={() => {
              const path = `${startup_page}/${match.params.id}/creative/${connection.creative.id}`;
              history.push(path);
            }}
          >
            {isUntouched ? "Add info about this startup" : "Edit startup info"}
          </Button>
        </div>
      )}
    </Card>
  );
}
