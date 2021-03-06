import React from "react";

// Libraries
import moment from "moment";

// Styles
import styles from "../Kanban.module.css";

// Images
import handleIcon from "../../../../../assets/images/handle.svg";
import companyLogo from "../../../../../assets/images/company_logo.png";
import moreIcon from "../../../../../assets/images/more.svg";

// Others
import { startup_page } from "definitions";

export default function BoardItem(props) {
  const {
    connection: {
      creative,
      subjectiveScores,
      updatedAt,
      evaluationSummaries,
      tags,
      groupSharingInfo,
      id,
      starred,
    },
    history,
  } = props;

  // Functions
  const getTotalScore = arr => {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr?.reduce((acc, obj) => {
        return acc + (obj.score || 0);
      }, 0);
    }
    return 0;
  };

  let subjectiveAvgScore = (
    getTotalScore(subjectiveScores) / subjectiveScores?.length || 0
  ).toFixed(1);

  const handleCompany = id => {
    history.push(`${startup_page}/company/${id}`);
  };

  // JSX
  return (
    <div className={styles.b_item}>
      <div style={{ width: "100%", textAlign: "center", marginTop: 5 }}>
        <img src={handleIcon} alt="Handle"></img>
      </div>
      <div className={styles.b_item_contents}>
        <div
          className={styles.b_item_head}
          style={{ display: "flex", alignItems: "center" }}
        >
          <h3 onClick={() => handleCompany(id ? id : "")}>
            <img src={companyLogo} alt="Brand Logo" />
            <p>{creative?.name}</p>
          </h3>
          <i
            style={{
              color: starred ? "orange" : "lightgray",
              marginLeft: "auto",
            }}
            className="fa fa-star"
          ></i>
        </div>
        {creative.answers.map((items, i) => {
          return (
            <div key={`id-${i}`}>
              {items.questionId === "q01_section_info" ? (
                <>
                  <h5>{items.questionName}</h5>
                  <p className={styles.oneLinerTxt}>{items.val}</p>
                </>
              ) : (
                ""
              )}
            </div>
          );
        })}
        <div className={styles.b_item_column}>
          <div className={styles.b_item_tags}>
            {(tags || []).slice(0, 2).map(tag => (
              <div key={tag.id} className={styles.b_item_tag}>
                {tag.name}
              </div>
            ))}
          </div>
          {tags.length > 0 ? (
            <div style={{ marginLeft: 8 }}>
              <img src={moreIcon} alt="More" />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={styles.b_item_column}>
          {groupSharingInfo && (
            <div className={styles.b_item_groups}>
              <p>{groupSharingInfo.map(i => i.group?.name).join(", ")}</p>
            </div>
          )}
        </div>
        <div className={styles.b_item_hr}></div>
        <div className={styles.b_item_stats}>
          {evaluationSummaries.map(evalution => {
            return (
              <div key={evalution.templateId}>
                <p>{evalution.templateName}</p>
                <p>{`${evalution.averagePercentageScore || 0}%`}</p>
              </div>
            );
          })}
        </div>
        <div className={styles.b_item_column} style={{ marginTop: 5 }}>
          {subjectiveAvgScore && (
            <div
              style={{
                fontFamily: "Proxima Nova",
                fontWeight: 700,
                color: "var(--ui-color-primary-green-dark2)",
                fontSize: 14,
              }}
            >
              {subjectiveAvgScore}
            </div>
          )}
          <p
            style={{
              marginLeft: "auto",
              fontFamily: "Roboto",
              fontSize: 9,
              color: "#969BA3",
            }}
          >
            {updatedAt && moment(updatedAt).format("ll")}
          </p>
        </div>
      </div>
    </div>
  );
}
