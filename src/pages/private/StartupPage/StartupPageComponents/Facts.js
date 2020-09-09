import React from "react";

import { Button } from "../../../../Components/elements";
import { startup_page } from "../../../definitions";

import {
  facts_list,
  list_item,
  list_item_text,
  list_item_check,
} from "./Facts.module.css";

export function Facts({ connection, user, match, history }) {
  const { creative } = connection;
  const { sharedWithEmail, submit: submitted } = creative;

  const answers = (creative && creative.answers) || [];

  const acceptedTerms = !!answers.find(
    ({ questionId }) => questionId === "q01_section_terms"
  );
  const answerCount = [...new Set(answers.map(({ questionId }) => questionId))]
    .length;

  let isUntouched = !sharedWithEmail && !submitted && !answerCount;

  return (
    <div>
      {isUntouched && (
        <div>
          <div style={{ fontSize: "18px" }}>Facts</div>
          <div
            style={{ padding: "20px 0px", color: "var(--color-gray-medium)" }}
          >
            You can add tags to make it easier to filter through your startups.
            Tags are also used to see the bigger picture in reports. We
            recommend that you spend some time getting your tags right, as it
            will make it easier for you to navigate in your data.
          </div>
        </div>
      )}

      {!isUntouched && (
        <div className={facts_list}>
          {sharedWithEmail && (
            <div className={list_item}>
              <div className={list_item_check}>
                <i className="fal fa-check" />
              </div>
              <div className={list_item_text}>
                <span style={{ color: "var(--color-primary)" }}>
                  {sharedWithEmail}
                </span>{" "}
                has been invited to fill out this information.
              </div>
            </div>
          )}

          {!sharedWithEmail && !submitted && (
            <div className={list_item}>
              <div className={list_item_check}>
                <i className="fal fa-times" />
              </div>
              <div className={list_item_text}>
                Startup has NOT been invited to fill out this information
              </div>
            </div>
          )}

          {submitted && (
            <div className={list_item}>
              <div className={list_item_check}>
                <i className="fal fa-check" />
              </div>
              <div className={list_item_text}>
                The startup has completed the form.
              </div>
            </div>
          )}

          {submitted && acceptedTerms && (
            <div className={list_item}>
              <div className={list_item_check}>
                <i className="fal fa-check" />
              </div>
              <div className={list_item_text}>
                The startup has accepted the terms and conditions.
              </div>
            </div>
          )}

          {submitted && !acceptedTerms && (
            <div className={list_item}>
              <div className={list_item_check}>
                <i className="fal fa-times" />
              </div>
              <div className={list_item_text}>
                The startup has NOT accepted the terms and conditions.
              </div>
            </div>
          )}

          <div className={list_item}>
            <div className={list_item_check}>
              <i className="fal fa-check" />
            </div>
            <div className={list_item_text}>
              {answerCount} questions have been answered.
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: "right" }}>
        <Button
          // type="just_text"
          size="small"
          type="right_arrow"
          onClick={() => {
            const path = `${startup_page}/${match.params.id}/creative/${connection.creative.id}`;
            history.push(path);
          }}
        >
          Go to facts
        </Button>
      </div>
    </div>
  );
}
