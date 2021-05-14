import React from "react";

import styles from "../Kanban.module.css";

import handleIcon from "../../../../assets/images/handle.svg";
import companyLogo from "../../../../assets/images/company_logo.png";
import star from "../../../../assets/images/star.svg";
import moreIcon from "../../../../assets/images/more.svg";
import addIcon from "../../../../assets/images/add.svg";
import editIcon from "../../../../assets/images/edit.svg";
import moment from "moment";

export default function BoardItem(props) {
  const {
    connection: {
      creative,
      subjectiveScores,
      updatedAt,
      evaluationSummaries,
      tags,
      groupSharingInfo,
    },
  } = props;
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
          <h3>
            <img src={companyLogo} alt="Brand Logo" />
            <p>{creative?.name}</p>
          </h3>

          <img
            style={{ marginLeft: "auto", pointer: "cursor" }}
            src={star}
            alt="Favourite"
          />
        </div>
        <div className={styles.b_item_column}>
          <div className={styles.b_item_tags}>
            {tags?.map(tag => (
              <div className={styles.b_item_tag}>{tag.name}</div>
            ))}
          </div>
          <div style={{ marginLeft: 8 }}>
            <img src={moreIcon} alt="More" />
          </div>
          <div style={{ marginLeft: "auto" }}>
            <button className={styles.add_btn}>
              <img src={addIcon} alt="Add" />
            </button>
          </div>
        </div>
        <div className={styles.b_item_column}>
          {groupSharingInfo && (
            <div className={styles.b_item_groups}>
              <p>{groupSharingInfo.map(i => i.group?.name).join(", ")}</p>
            </div>
          )}
          <div style={{ marginLeft: "auto" }}>
            <button className={styles.add_btn}>
              <img src={addIcon} alt="Add" />
            </button>
          </div>
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
          {subjectiveScores?.score && (
            <div
              style={{
                fontFamily: "Proxima Nova",
                fontWeight: 700,
                color: "#53CAB2",
                fontSize: 14,
              }}
            >
              {subjectiveScores?.score} <img src={editIcon} alt="Edit" />
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
