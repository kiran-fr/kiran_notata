import React from "react";

import { Button, Tag } from "Components/elements";
import { startup_page } from "pages/definitions";

import {
  facts_list,
  list_item,
  list_item_text,
  list_item_check,
  link_tag,
} from "./Facts.module.css";

function Summaries({ answers }) {
  let tagIds = [
    "q03_section_money",
    "q01_section_business",
    "q03_section_business",
    "q04_section_business",
    "q06_section_business",
    "q04_section_info",
  ];

  let website;
  let w = answers.find(({ questionId }) => questionId === "q06_section_info");
  if (w) {
    w.val.substring(0, 3).toLowerCase() === "htt"
      ? (website = w.val)
      : (website = `http://${w.val}`);
  }

  let d = {
    slideDeck: (
      answers.find(
        ({ questionId }) => questionId === "q01_section_materials"
      ) || {}
    ).val,
    oneLiner: (
      answers.find(({ questionId }) => questionId === "q01_section_info") || {}
    ).val,
    solution: (
      answers.find(({ questionId }) => questionId === "q03_section_info") || {}
    ).val,
    tags: answers.filter(
      ({ questionId, inputType }) =>
        inputType !== "COMMENT" && tagIds.some(id => id === questionId)
    ),
    website,
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {d.oneLiner && <div style={{ padding: "10px" }}>{d.oneLiner}</div>}

      {!d.oneLiner && d.solution && (
        <div style={{ padding: "10px" }}>{d.solution}</div>
      )}

      {(d.website || d.slideDeck) && (
        <div style={{ paddingBottom: "10px" }}>
          {d.website && (
            <Tag className={link_tag}>
              <a href={d.website} target="_blank" rel="noopener noreferrer">
                Website <i className="fal fa-external-link-square" />
              </a>
            </Tag>
          )}

          {d.slideDeck && (
            <Tag className={link_tag}>
              <a href={d.slideDeck} target="_blank" rel="noopener noreferrer">
                Slide deck <i className="fal fa-external-link-square" />
              </a>
            </Tag>
          )}
        </div>
      )}

      {!!d.tags.length && d.tags.map(({ val }, i) => <Tag key={i}>{val}</Tag>)}
    </div>
  );
}

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
      <Summaries answers={answers} />

      {isUntouched && (
        <div>
          <div style={{ fontSize: "18px" }}>Facts</div>
          <div
            style={{ padding: "20px 0px", color: "var(--color-gray-medium)" }}
          >
            Facts is the part that you share with the startups. You can invite a
            startup to fill out this part .
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
