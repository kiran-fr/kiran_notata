import React, { useState } from "react";
import { Tag } from "Components/elements";
import styles from "./Facts.module.css";
import { AnswerSection } from "../../../public/PublicPresentationPage/PublicPresentationPage";

function Summaries({ answers }) {
  let website;
  let w = answers.find(({ questionId }) => questionId === "q06_section_info");
  if (w) {
    w.val.substring(0, 3).toLowerCase() === "htt"
      ? (website = w.val)
      : (website = `http://${w.val}`);
  }

  const slideDeck = (
    answers.find(({ questionId }) => questionId === "q01_section_materials") ||
    {}
  ).val;

  const oneLiner = (
    answers.find(({ questionId }) => questionId === "q01_section_info") || {}
  ).val;

  const contactPerson = (
    answers.find(({ questionId }) => questionId === "q05_section_info") || {}
  ).val;

  return (
    <div className={styles.summaries_container}>
      {oneLiner && <div className={styles.summaries_oneLiner}>{oneLiner}</div>}

      {(website || slideDeck || contactPerson) && (
        <div className={styles.summaries_tags}>
          {website && (
            <Tag active={true} isButton={true}>
              <a href={website} target="_blank" rel="noopener noreferrer">
                Website <i className="fal fa-external-link-square" />
              </a>
            </Tag>
          )}

          {slideDeck && (
            <Tag active={true} isButton={true}>
              <a href={slideDeck} target="_blank" rel="noopener noreferrer">
                Slide deck <i className="fal fa-external-link-square" />
              </a>
            </Tag>
          )}

          {contactPerson && <Tag>{contactPerson}</Tag>}
        </div>
      )}
    </div>
  );
}

function getAnswersByQuestion(answers) {
  let answersByQuestion = {};
  answers.forEach(answer => {
    answersByQuestion[answer.questionId] = answersByQuestion[
      answer.questionId
    ] || {
      questionName: answer.question,
      index: answer.index,
      answers: [],
    };
    answersByQuestion[answer.questionId].answers.push(answer);
  });

  for (let questionId in answersByQuestion) {
    let sortedAnswers = answersByQuestion[questionId]?.answers?.sort(
      (a, b) => a.index - b.index
    );

    answersByQuestion[questionId] = {
      ...answersByQuestion[questionId],
      answers: sortedAnswers,
    };
  }

  return Object.keys(answersByQuestion)
    .map(questionId => ({ questionId, ...answersByQuestion[questionId] }))
    .sort((a, b) => a.index - b.index);
}

function Extended({ creative, collapsable }) {
  const [open, setOpen] = useState(false);

  let creativeAnswersBySection = {};
  (creative.answers || []).forEach((answer, index) => {
    if (answer.sectionId) {
      creativeAnswersBySection[answer.sectionId] = creativeAnswersBySection[
        answer.sectionId
      ] || {
        name: answer.sectionName,
        answers: [],
      };
      creativeAnswersBySection[answer.sectionId].answers.push(answer);
    }
  });

  let order = [
    "section_info",
    "section_business",
    "section_money",
    "section_materials",
  ];
  let sections = order.map(key => creativeAnswersBySection[key]);

  return (
    <div className={styles.facts_section_container}>
      {collapsable && (
        <div
          className={styles.expander_top}
          onClick={() => {
            setOpen(!open);
          }}
        >
          {open && (
            <div className={styles.divider_top}>
              <i className="fas fa-caret-up" />
              <span> hide info</span>
            </div>
          )}

          {!open && (
            <div className={styles.divider_top}>
              <i className="fas fa-caret-down" />
              <span> show more info</span>
            </div>
          )}
        </div>
      )}

      {((collapsable && open) || !collapsable) && (
        <div style={{ marginTop: "20px" }}>
          {sections
            .filter(x => x)
            .map((section, i) => (
              <div key={section.name}>
                <div>{section.name}</div>

                <AnswerSection answers={section.answers || []} />
              </div>
            ))}

          {/*{Object.keys(answersByQuestion).map(questionId => {*/}
          {/*  let item = answersByQuestion[questionId];*/}
          {/*  let { questionName, answers } = item;*/}

          {/*  return (*/}
          {/*    <div*/}
          {/*      style={{*/}
          {/*        paddingTop: collapsable ? "10px" : "0px",*/}
          {/*      }}*/}
          {/*      className={styles.facts_question_container}*/}
          {/*      key={questionId}*/}
          {/*    >*/}
          {/*      <div className={styles.question_header}>{questionName}</div>*/}

          {/*      {answers*/}
          {/*        .sort((a, b) => (a.inputType === "COMMENT" ? 1 : -1))*/}
          {/*        .map((answer, i) => {*/}
          {/*          return (*/}
          {/*            <div*/}
          {/*              key={i}*/}
          {/*              className={*/}
          {/*                answer.inputType === "COMMENT"*/}
          {/*                  ? styles.facts_comment*/}
          {/*                  : styles.facts_answer*/}
          {/*              }*/}
          {/*            >*/}
          {/*              {answer.val}*/}
          {/*            </div>*/}
          {/*          );*/}
          {/*        })}*/}
          {/*    </div>*/}
          {/*  );*/}
          {/*})}*/}
        </div>
      )}

      {collapsable && open && creative.answers.length >= 0 && (
        <div
          className={styles.expander_bottom}
          onClick={() => {
            setOpen(false);
          }}
        >
          <div className={styles.divider_bottom}>
            <i className="fas fa-caret-up" />
            <span> hide info</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StartupInfoSection({ creative, answers }) {
  return (
    <div>
      {(answers.length <= 0 && (
        <div>
          <Extended creative={creative} />
        </div>
      )) || (
        <div>
          <Summaries answers={answers} />
          <Extended creative={creative} collapsable />
        </div>
      )}
    </div>
  );
}
