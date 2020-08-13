import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import classnames from "classnames";
import moment from "moment";

import { tagGroupGet, connectionGet } from "../../../../Apollo/Queries";
import {
  connectionTagAdd,
  connectionTagRemove,
} from "../../../../Apollo/Mutations";
import { Button, Tag } from "../../../elements/";
import { startup_page } from "../../../../routes";

import {
  facts_list,
  list_item,
  list_item_text,
  list_item_check,
} from "./Facts.module.css";

export function Facts({ connection, user, match, history }) {
  console.log("connection", connection);

  const { creative } = connection;
  const { sharedWithEmail, submit: submitted } = creative;

  const answers = (creative && creative.answers) || [];

  const acceptedTerms = !!answers.find(
    ({ questionId }) => questionId === "q01_section_terms"
  );
  const answerCount = [...new Set(answers.map(({ questionId }) => questionId))]
    .length;

  if (acceptedTerms) {
    console.log("acceptedTerms", acceptedTerms);
  }

  console.log("answerCount", answerCount);

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
                You have invited{" "}
                <span style={{ color: "var(--color-primary)" }}>
                  {sharedWithEmail}
                </span>{" "}
                to fill out this information for you.
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
              {answerCount} questions has been answered
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: "right" }}>
        <Button
          type="just_text"
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
