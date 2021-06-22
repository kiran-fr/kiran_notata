import React, { useState } from "react";
import "./submission-full-list.scss";

export default function SubmissionFullList({ evaluation }) {
  const [open, setOpen] = useState({});

  return (
    <div className="evaluation-modal">
      <div className="row evaluation-modal__summary">
        <div className="col-sm-10 col-xs-10 evaluation-modal__summary__title">
          Summary
        </div>
        <div className="col-sm-2 col-xs-2 evaluation-modal__summary__score">
          {evaluation?.summary?.scorePercent || 0}%
        </div>
      </div>

      {evaluation?.summary?.sections?.map(section => {
        return (
          <div key={section.sectionId} className="evaluation-modal__section">
            <div className="row evaluation-modal__section__title-row">
              <i
                className={`evaluation-modal__section__title-row__icon ${
                  open[section.sectionId]
                    ? "fa fa-chevron-up"
                    : "fa fa-chevron-down"
                }`}
                aria-hidden="true"
                onClick={() => {
                  setOpen({
                    ...open,
                    [section.sectionId]: !open[section.sectionId],
                  });
                }}
              />

              <div className="col-sm-10 col-xs-10 evaluation-modal__section__title-row__title">
                {section.sectionName}
              </div>

              <div className="col-sm-2 col-xs-2 evaluation-modal__section__title-row__score">
                {section.scorePercent || 0}%
              </div>
            </div>

            {open[section.sectionId] && (
              <div className={`evaluation-modal__section__list`}>
                {section?.scorePerAnswer?.map((score, index) => {
                  return (
                    <div
                      className="row evaluation-modal__section__list__row"
                      key={`${section.sectionId}_${index}`}
                    >
                      <div className="col-sm-10 col-xs-10 evaluation-modal__section__list__row__question">
                        <p>{score.questionName}</p>
                      </div>
                      <div className="col-sm-2 col-xs-2 evaluation-modal__section__list__row__score">
                        {score.score + " of " + score.possibleScore}{" "}
                        <div>points</div>
                      </div>

                      <div className="col-sm-12 evaluation-modal__section__list__row__answers">
                        <span>{score.answer || " "}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
