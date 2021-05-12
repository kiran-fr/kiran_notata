import React from "react";
import styles from "./table.module.css";
import Red from "../../../../../assets/images/red.png";
import Green from "../../../../../assets/images/green.png";
import moment from "moment";
//Helper
import InvisiblePlus from "../../../../../assets/images/InvisiblePlus.svg";
import { subjectiveScore } from "private/pages/Dashboard/Connections/types";

export default function TableBody(props) {
  const {
    data,
    evaluationTemplates,
    setShowTagGroupForId,
    setShowFunnelScoreForId,
    setShowSubjectiveScoreForId,
    hidePreview,
    showPreview,
    ButtonGreen,
    columnSettings,
    handleCompany,
    preview,
    setStarMutation,
  } = props;

  const StartupPreview = ({ no, companyName, oneLiner, problem }) => (
    <div
      className={styles.startupPreview}
      style={{ top: `${100 + 56 * no}px` }}
    >
      <h1>{companyName}</h1>
      {oneLiner && (
        <>
          <h3>{oneLiner.questionName}</h3>
          <p>{oneLiner.val}</p>
        </>
      )}
      {problem && (
        <>
          <h3>{problem.questionName}</h3>
          <p>{problem.val}</p>
        </>
      )}
    </div>
  );

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
              starred,
              id,
            } = item;

            let tagSet;
            if (funnelTags.length) {
              let highest = funnelTags.reduce(
                (max, tag) => (tag.index > max ? tag.index : max),
                funnelTags[0].index
              );
              tagSet = funnelTags.find(({ index }) => index === highest);
            }

            let subjectiveScoreValAvg = subjectiveScore(item);
            let oneLiner = "";
            let problem = "";

            if (creative.answers) {
              oneLiner = creative.answers.find(
                ({ questionId }) => questionId === "q01_section_info"
              );
              problem = creative.answers.find(
                ({ questionId }) => questionId === "q02_section_info"
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
                    onClick={() => {
                      setStarMutation({
                        variables: { id },

                        optimisticResponse: {
                          __typename: "Mutation",
                          connectionSetStar: {
                            ...item,
                            starred: !starred,
                          },
                        },
                      });
                    }}
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
                {columnSettings.groups && (
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
                )}
                {columnSettings.funnels && (
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
                          <span
                            onClick={() => setShowFunnelScoreForId(item.id)}
                          >
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
                )}
                {columnSettings.tags && (
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
                      {
                        <li onClick={() => setShowTagGroupForId(item.id)}>
                          <ButtonGreen />
                        </li>
                      }
                    </ul>
                  </td>
                )}
                {columnSettings.subjectiveScore && (
                  <td>
                    {subjectiveScoreValAvg}
                    {!subjectiveScoreValAvg && (
                      <span
                        onClick={() => setShowSubjectiveScoreForId(item.id)}
                      >
                        <ButtonGreen />
                      </span>
                    )}
                    {subjectiveScoreValAvg && (
                      <span
                        onClick={() => setShowSubjectiveScoreForId(item.id)}
                      >
                        <i className="fas fa-pen" />
                      </span>
                    )}
                  </td>
                )}
                <td>
                  <span className={styles.olderThan}>
                    {moment(item.updatedAt).format("ll")}
                  </span>
                </td>
                {/* Iterate over the headers */}
                {evaluationTemplates
                  .filter(({ id }) =>
                    (columnSettings.evaluationTemplates || []).some(
                      etID => etID === id
                    )
                  )
                  .map(evaluationTemplate => {
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
