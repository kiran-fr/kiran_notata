import React from "react";
import queryString from "query-string";
import { Button } from "Components/elements";
import styles from "./SectionNavigation.module.css";

import { startup_page } from "definitions.js";

export function SectionNavigation({
  evaluationTemplate,
  connection,
  evaluation,
  history,
  location,
  save,
  loading,
}) {
  // Get section ID from search query
  const sectionId = queryString.parse(location.search).section;

  // Get sections from evaluation template
  const sections = evaluationTemplate?.sections || [];

  // Get index of current section
  const currentIndex = sections.map(s => s.id).indexOf(sectionId);

  // First section
  const isStart = currentIndex === 0;

  // Last section
  const isEnd = currentIndex === sections.length - 1;

  return (
    <div className="text-right">
      <div className={styles.button_container}>
        {isStart && (
          <Button
            type="left_arrow"
            size="large"
            onClick={() => {
              let path = `${location.pathname}?section=all`;
              history.push(path);
            }}
          >
            Overview
          </Button>
        )}

        {!isStart && (
          <Button
            type="left_arrow"
            size="large"
            onClick={() => {
              let path = `${location.pathname}?section=${
                sections[currentIndex - 1].id
              }`;
              history.push(path);
            }}
          >
            {sections[currentIndex - 1].name}
          </Button>
        )}

        {!isEnd && (
          <Button
            type="right_arrow"
            size="large"
            onClick={() => {
              let path = `${location.pathname}?section=${
                sections[currentIndex + 1].id
              }`;
              history.push(path);
            }}
          >
            {sections[currentIndex + 1].name}
          </Button>
        )}

        {isEnd && (
          <Button
            iconClass="fal fa-cloud-download"
            onClick={save}
            loading={loading}
          >
            SAVE
          </Button>
        )}
      </div>

      <div style={{ lineHeight: "2" }}>
        {!isEnd && (
          <div>
            <Button
              type="just_text"
              onClick={() => {
                let path = `${location.pathname}?section=${
                  sections[sections.length - 1].id
                }`;
                history.push(path);
              }}
            >
              Go to end
            </Button>
          </div>
        )}

        {isEnd && (
          <div>
            <Button
              type="just_text"
              onClick={() => {
                localStorage.removeItem(
                  `evaluation:${connection.id}/${evaluationTemplate.id}`
                );

                if (evaluation) {
                  let path = `${startup_page}/${connection.id}/evaluation_summary/${evaluation.id}`;
                  history.push(path);
                }

                if (!evaluation) {
                  let path = `${startup_page}/${connection.id}`;
                  history.push(path);
                }
              }}
            >
              Discard changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
