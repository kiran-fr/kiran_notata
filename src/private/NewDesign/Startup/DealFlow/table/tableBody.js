import React, { useState, useEffect, useRef } from "react";
import styles, { activePopup } from "./table.module.css";
import Red from "../../../../../assets/images/red.png";
import Green from "../../../../../assets/images/green.png";
import More from "../../../../../assets/images/more.svg";
import Violet from "../../../../../assets/images/violet.png";
import Yellow from "../../../../../assets/images/Bar_Icon_04.svg";
import moment from "moment";
//Helper
import InvisiblePlus from "../../../../../assets/images/InvisiblePlus.svg";
import { subjectiveScore } from "private/pages/Dashboard/Connections/types";
import classnames from "classnames";
import { sortArr } from "../../../CommonFunctions";

export default function TableBody(props) {
  const {
    data,
    evaluationTemplates,
    setShowTagGroupForId,
    setShowStartUpForId,
    setShowFunnelScoreForId,
    setShowSubjectiveScoreForId,
    hidePreview,
    showPreview,
    ButtonGreen,
    columnSettings,
    handleCompany,
    preview,
    setStarMutation,
    updateFunnelTag,
  } = props;

  const [funnel, setFunnel] = useState();
  const [showFunnel, setShowFunnel] = useState(false);

  const FunnelPopup = ({ tags, id, index }) => {
    const updateFunnelTagForConnection = funnelTagId => {
      updateFunnelTag(funnelTagId, id);
      setFunnel(false);
      setShowFunnel(false);
    };

    const popup = useRef();

    useEffect(() => {
      const handleGlobalEvent = e =>
        !e.path.includes(popup.current) ? setShowFunnel(false) : null;

      window.addEventListener("click", handleGlobalEvent);

      return () => {
        window.removeEventListener("click", handleGlobalEvent);
      };
    });

    const tagSort = sortArr(tags);

    return (
      <div
        ref={popup}
        className={styles.funnelPopup}
        style={{ top: index > 20 ? "-400%" : `50px` }}
      >
        <ul>
          {tagSort?.map(tag => (
            <li
              key={tag.id}
              onClick={() => updateFunnelTagForConnection(tag.id)}
            >
              <img
                src={
                  tag.name === "Invested"
                    ? Red
                    : tag.name === "Initial assessment"
                    ? Yellow
                    : tag.name === "Met team"
                    ? Violet
                    : Green
                }
                alt=""
              />{" "}
              {tag.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const StartupPreview = ({ no, companyName, oneLiner, problem }) => (
    <div className={styles.startupPreview} style={{ top: `${no + 56}px` }}>
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
                <td
                  className={styles.dealflowColumnHead}
                  style={{ paddingTop: "-10px" }}
                >
                  {/*Checkbox*/}
                  <div className={styles.columnHead}>
                    <label className={styles.customCheck}>
                      <input type="checkbox" />
                      <span className={styles.checkmark} />
                    </label>

                    {/*Star*/}
                    <div
                      style={{ marginTop: "-5px" }}
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
                      <i
                        style={{
                          color: starred ? "orange" : "lightgray",
                        }}
                        className="fas fa-star"
                      ></i>
                    </div>
                  </div>
                </td>

                <td>
                  <div
                    onMouseOver={() => showPreview(index)}
                    onMouseLeave={hidePreview}
                    className={classnames(
                      styles.user_profile_Img,
                      creative.logo && styles.with_logo
                    )}
                  >
                    {(!creative.logo && (
                      <span>{creative.name.charAt(0).toUpperCase()}</span>
                    )) || <img src={creative.logo} />}
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
                        <li>
                          {group.name} {groupSharingInfo.length > 1 ? "," : ""}
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => setShowTagGroupForId(item.id)}
                          className={styles.buttongreen}
                          style={{ marginLeft: 0 }}
                        >
                          <i className="fas fa-plus-circle" />
                        </button>
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
                            alt=""
                            src={
                              `${tagSet.name.toUpperCase()}` === "ANALYZED"
                                ? Red
                                : Green
                            }
                          />
                          {tagSet.name}
                          <span
                            className={classnames(
                              (funnel === index) & showFunnel ? activePopup : ""
                            )}
                            onClick={() => {
                              setFunnel(funnel ? null : index);
                              setShowFunnel(!showFunnel);
                            }}
                          >
                            {" "}
                            <i className={classnames("fas fa-chevron-down")} />
                          </span>
                          {funnel === index && showFunnel && (
                            <FunnelPopup
                              tags={funnelTags?.[0]?.group?.funnelTags || []}
                              id={id}
                              index={index}
                            />
                          )}
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
                          <>
                            <li key={id}>
                              <span>
                                {group.name}: {name}
                              </span>
                            </li>
                          </>
                        ))}
                      {item.tags.length > 2 ? (
                        <li
                          style={{ marginLeft: 8 }}
                          onClick={() => setShowStartUpForId(item.id)}
                        >
                          <img src={More} alt="" />
                        </li>
                      ) : (
                        <></>
                      )}
                      {
                        <li
                          style={{ marginLeft: item.tags ? "10px" : "" }}
                          onClick={() => setShowStartUpForId(item.id)}
                        >
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
                    {item.updatedAt ? moment(item.updatedAt).format("ll") : ""}
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
