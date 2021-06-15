import React from "react";
import styles from "./EvaluationBox.module.css";
import SummaryLine from "./SummaryLine";
import classnames from "classnames";
import moment from "moment";
import { startup_page } from "definitions.js";

export default function EvaluationsByTemplate({
  data,
  connection,
  user,
  hide,
  toggleHide,
  showUsers,
  showScores,
  isAdmin,
  history,
}) {
  let list = Object.keys(data.averagePerTemplateSection).map(sectionName => {
    let item = data.averagePerTemplateSection[sectionName];

    // Averages for each answer
    let scorePerAnswer = Object.keys(item.scorePerAnswer).map(questionName => {
      let it = item.scorePerAnswer[questionName];

      let res = {
        question: questionName,
        score: it.scoreTotal,
        scorePossible: it.scorePossible,
        percentageScore: it.scorePercentage,
      };
      return res;
    });

    // Averages for each section

    let res = {
      name: sectionName,
      scorePossible: item.scorePossible,
      percentageScore: item.scorePercentage,
      score: item.scoreTotal,
      scorePerAnswer,
    };
    return res;
  });

  return (
    <div className={styles.each_template_style}>
      <div className={styles.header_style}>
        <SummaryLine
          hide={hide}
          name={data.templateName}
          percentageScore={data.averagePercentageScore}
          score={data.averageScore}
          scorePossible={data.scorePossible}
          className={classnames(styles.template_summary_line)}
          timeStamp={`${data?.evaluations?.length || 0} submissions`}
          list={!!list.length && list}
          numberScore={false}
          history={history}
        />
      </div>

      {(showUsers || isAdmin) &&
        data.evaluations.map((evaluation, i) => {
          let { given_name, family_name, email } =
            evaluation.createdByUser || {};
          let percentageScore = Math.round(
            (evaluation.summary.scoreTotal / evaluation.summary.scorePossible) *
              100
          );

          let list = (evaluation.summary?.sections || []).map(item => {
            let sa = {
              name: item.name,
              percentageScore: Math.round(
                (item.score / item.scorePossible) * 100
              ),
              scorePerAnswer: item.scorePerAnswer,
              score: item.score,
              scorePossible: item.scorePossible,
              numberScore: true,
            };
            return sa;
          });

          let editLink =
            connection &&
            `${startup_page}/${connection.id}/evaluation/${evaluation.id}`;
          if (connection && evaluation.summary?.sections[0]?.sectionId) {
            editLink += `/section/${evaluation.summary?.sections[0]?.sectionId}`;
          }

          return (
            <SummaryLine
              key={i}
              hide={hide}
              toggleHide={toggleHide}
              evaluationId={evaluation.id}
              timeStamp={moment(evaluation.updatedAt).format("ll")}
              name={`${given_name} ${family_name}`}
              isYou={user.email === email}
              editLink={editLink}
              percentageScore={percentageScore}
              score={evaluation.summary.scoreTotal}
              scorePossible={evaluation.summary.scorePossible}
              className={classnames(styles.each_evaluation_line)}
              list={list}
              history={history}
              numberScore={false}
            />
          );
        })}
    </div>
  );
}
