import React from "react";

import styles from "../Kanban.module.css";

import handleIcon from "../Assets/handle.svg";
import companyLogo from "../Assets/company_logo.png";
import star from "../Assets/star.svg";
import moreIcon from "../Assets/more.svg";
import addIcon from "../Assets/add.svg";
import editIcon from "../Assets/edit.svg";

export default function BoardItem({ children }) {
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
            <p>{children}</p>
          </h3>

          <img
            style={{ marginLeft: "auto", pointer: "cursor" }}
            src={star}
            alt="Favourite"
          />
        </div>
        <div className={styles.b_item_column}>
          <div className={styles.b_item_tags}>
            <div className={styles.b_item_tag}>Tech</div>
            <div className={styles.b_item_tag}>Education</div>
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
          <div className={styles.b_item_groups}>
            <p>Group A, Group B</p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <button className={styles.add_btn}>
              <img src={addIcon} alt="Add" />
            </button>
          </div>
        </div>
        <div className={styles.b_item_hr}></div>
        <div className={styles.b_item_stats}>
          <div>
            <p>
              BEFORE<br></br>PITCHING
            </p>
            <p>60%</p>
          </div>
          <div>
            <p>
              FIRST<br></br>IMPRESSION
            </p>
            <p>72%</p>
          </div>
          <div>
            <p>
              AFTER<br></br>PITCHING
            </p>
            <p>85%</p>
          </div>
        </div>
        <div className={styles.b_item_column} style={{ marginTop: 5 }}>
          <div
            style={{
              fontFamily: "Proxima Nova",
              fontWeight: 700,
              color: "#53CAB2",
              fontSize: 14,
            }}
          >
            8, 5 <img src={editIcon} alt="Edit" />
          </div>
          <p
            style={{
              marginLeft: "auto",
              fontFamily: "Roboto",
              fontSize: 9,
              color: "#969BA3",
            }}
          >
            May 1, 2021
          </p>
        </div>
      </div>
    </div>
  );
}
