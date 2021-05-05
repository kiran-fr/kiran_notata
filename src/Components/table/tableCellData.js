import React, { useState } from "react";
import styles from "./table.module.css";
import { startup_page } from "definitions";
import Red from "../../assets/images/red.png";
import Green from "../../assets/images/green.png";
import moment from "moment";
//Helper
import InvisiblePlus from "../../assets/images/InvisiblePlus.svg";
import { subjectiveScore } from "private/pages/Dashboard/Connections/types";

export default function TableCellData(props) {
  const {
    data,
    evaluationTemplates,
    setShowTagGroupForId,
    setShowFunnelScoreForId,
    setShowSubjectiveScoreForId,
    hidePreview,
    showPreview,
    ButtonGreen,
    handleCompany,
    preview,
    StartupPreview,
  } = props;

  return (
    <tbody>
      {data &&
        data
          .filter(({ creative }) => creative)
          .map((item, index) => {
            let {
              funnelTags,
              creative,
              groupSharingInfo,
              evaluationSummaries,
            } = item;

            //  Company one-liner
            let oneLiner = "";
            // Problem
            let problem = "";

            let tagSet;
            if (funnelTags.length) {
              let highest = funnelTags.reduce(
                (max, tag) => (tag.index > max ? tag.index : max),
                funnelTags[0].index
              );
              tagSet = funnelTags.find(({ index }) => index === highest);
            }

            // subjective avg

            let subjectiveScoreValAvg = subjectiveScore(item);

            // company details in popover
            if (creative.answers) {
              oneLiner = creative.answers.find(
                question => question.questionId === "q01_section_info"
              );
              problem = creative.answers.find(
                question => question.questionId === "q02_section_info"
              );
            }

            return (
              <tr key={index}>
                <td>
                  <label className={styles.customCheck}>
                    <input type="checkbox" />
                    <span className={styles.checkmark}></span>
                  </label>
                  <div
                    className={styles.favStartup}
                    /* onClick={() => {
                  setStarMutation({
                    variables: { id },

                    optimisticResponse: {
                      __typename: "Mutation",
                      connectionSetStar: {
                        ...connection,
                        starred: !starred,
                      },
                    },
                  });
                }} */
                  >
                    <i className="fas fa-star"></i>
                  </div>
                </td>
                <td>
                  <div
                    onMouseOver={() => showPreview(index)}
                    onMouseLeave={hidePreview}
                    className={styles.user_profile_Img}
                  >
                    {item.creative.name.charAt(0).toUpperCase()}
                  </div>
                  <span
                    onMouseOver={() => showPreview(index)}
                    onMouseLeave={hidePreview}
                    className={styles.company_name}
                    onClick={() => handleCompany(item)}
                  >
                    {item.creative.name}
                    {preview === index && (
                      <StartupPreview
                        companyName={item.creative.name}
                        oneLiner={oneLiner}
                        problem={problem}
                        no={index}
                      />
                    )}
                  </span>
                </td>
                <td>
                  <ul>
                    {(groupSharingInfo || []).slice(0, 3).map(({ group }) => (
                      <li>{group.name}</li>
                    ))}
                    <li>
                      <img src={InvisiblePlus} />
                    </li>
                  </ul>
                </td>
                <td>
                  <div className={styles.startupStatus}>
                    {tagSet ? (
                      <>
                        <img
                          onClick={() => setShowFunnelScoreForId(item.id)}
                          src={
                            `${tagSet.name.toUpperCase()}` === "ANALYZED"
                              ? Red
                              : Green
                          }
                        />
                        {tagSet.name}
                        <span onClick={() => setShowFunnelScoreForId(item.id)}>
                          <i className="fas fa-chevron-down"></i>
                        </span>
                      </>
                    ) : (
                      <span onClick={() => setShowFunnelScoreForId(item.id)}>
                        <ButtonGreen />
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <ul>
                    {(item.tags || [])
                      .slice(0, 2)
                      .map(({ name, id, group }) => (
                        <li key={id}>
                          <span>
                            {group.name}: {name}
                          </span>
                        </li>
                      ))}
                    <li onClick={() => setShowTagGroupForId(item.id)}>
                      <ButtonGreen />
                    </li>
                  </ul>
                </td>
                <td>
                  {subjectiveScoreValAvg}
                  {!subjectiveScoreValAvg && (
                    <span onClick={() => setShowSubjectiveScoreForId(item.id)}>
                      <ButtonGreen />{" "}
                    </span>
                  )}
                  {subjectiveScoreValAvg && (
                    <span onClick={() => setShowSubjectiveScoreForId(item.id)}>
                      <i className="fas fa-pen" />
                    </span>
                  )}
                </td>
                <td>
                  <span className={styles.olderThan}>
                    {moment(item.updatedAt).format("ll")}
                  </span>
                </td>
                {/* Iterate over the headers */}
                {evaluationTemplates.map(evaluationTemplate => {
                  // Find evaluation summary matching header
                  let summary;
                  if (evaluationSummaries.length) {
                    summary = evaluationSummaries.find(
                      ({ templateId }) => templateId === evaluationTemplate.id
                    );
                  }

                  return (
                    <td key={evaluationTemplate.id}>
                      {summary ? (
                        // If summary exists, display it
                        <span>{summary.averagePercentageScore}%</span>
                      ) : (
                        // If not, display a plus button
                        <img src={InvisiblePlus} />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
    </tbody>
  );
}
