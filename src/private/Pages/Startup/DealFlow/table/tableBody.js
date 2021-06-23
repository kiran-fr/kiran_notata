import React, { useState } from "react";

// COMPONENTS
import { Loader } from "Components/UI_Kits";
import { FunnelPopup, StartupPreview } from "./Popups";

// STYLES
import styles, { activePopup } from "./table.module.css";

//IMG
import More from "../../../../../assets/images/more.svg";
import InvisiblePlus from "../../../../../assets/images/InvisiblePlus.svg";

// OTHER
import moment from "moment";
import { subjectiveScore } from "../../../../oldPages/Dashboard/Connections/types";
import classnames from "classnames";
import { sortArr, DynamicIcons } from "../../../CommonFunctions";

export default function TableBody(props) {
  //props Value
  const {
    connections,
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
    checkAll,
    checked,
    setChecked,
    funnelLoad,
  } = props;

  //STATE
  const [funnel, setFunnel] = useState();
  const [funnelId, setFunnelId] = useState();
  const [showFunnel, setShowFunnel] = useState(false);

  return (
    <tbody>
      {connections &&
        connections
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
                      <input
                        type="checkbox"
                        checked={!!checkAll || !!checked[item.id]}
                        onChange={() =>
                          setChecked({
                            ...checked,
                            [item.id]: !checked[item.id],
                          })
                        }
                      />
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
                      />
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
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
                          styles = {styles}
                          companyName={item.creative.name}
                          oneLiner={oneLiner}
                          problem={problem}
                          no={index}
                        />
                      )}
                    </span>
                  </div>
                </td>

                {columnSettings.groups && (
                  <td>
                    <ul>
                      {(groupSharingInfo || []).slice(0, 2).map(({ group }) => (
                        <li>
                          {group.name} {groupSharingInfo.length > 1 ? "," : ""}
                        </li>
                      ))}{" "}
                      {groupSharingInfo.length > 2 ? (
                        <img
                          onClick={() => setShowTagGroupForId(item.id)}
                          src={More}
                          alt=""
                        />
                      ) : null}
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
                      {funnelLoad && funnelId === index ? (
                        <Loader />
                      ) : tagSet ? (
                        <>
                          <img alt="" src={DynamicIcons(tagSet.index)} />
                          {tagSet.name}
                          <span
                            className={classnames(
                              (funnel === index) & showFunnel ? activePopup : ""
                            )}
                            onClick={() => {
                              setFunnel(funnel ? null : index);
                              setFunnelId(index);
                              setShowFunnel(!showFunnel);
                            }}
                          >
                            {" "}
                            <i className={classnames("fas fa-chevron-down")} />
                          </span>
                          {funnel === index && showFunnel && (
                            <FunnelPopup
                              styles = {styles}
                              tags={funnelTags?.[0]?.group?.funnelTags || []}
                              id={id}
                              index={index}
                              setShowFunnel = {setShowFunnel}
                              setFunnel = {setFunnel} 
                              updateFunnelTag = {updateFunnelTag}
                              sortArr = {sortArr}
                              DynamicIcons = {DynamicIcons}
                            />
                          )}
                        </>
                      ) : (
                        <span
                          onClick={() => {
                            setShowFunnelScoreForId(item.id);
                            setFunnelId(index);
                          }}
                        >
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
