// Date : 15/04/2020
// Created By : siva

/* eslint-disable */
import React from "react";
import { Button } from "Components/UI_Kits";
import notata from "../../../../assets/images/auth_logo.png";
import styles from "../style.module.css";

export function Message({ history, heading, subHead1, subHead2, path, image }) {
  const redirectlogin = () => {
    if (path === "/login") {
      window.location.href = path;
    } else {
      history.push(path);
    }
  };

  return (
    <>
      <div className={styles.auth_structure}>
        <div className={styles.auth_structure_left}>
          <div className={styles.mainContent}>
            <div className={styles.logoContainer}>
              <img
                src={notata}
                style={{ width: "40px", height: "40px", marginBottom: "15px" }}
                alt="logo"
                className={styles.logo}
              />
              <h1>{heading}</h1>
              <p
                style={{
                  margin: "25px 0",
                  lineHeight: "18.05px",
                  fontSize: "15px",
                  color: "#969BA3",
                }}
              >
                {subHead1}
              </p>
              <p
                style={{
                  margin: "25px 0",
                  lineHeight: "18.05px",
                  fontSize: "15px",
                  color: "#969BA3",
                }}
              >
                {subHead2}
              </p>
            </div>
            <div style={{ marginTop: "20px" }}>
              <Button
                buttonStyle="secondary"
                size="large"
                buttonStyle="green"
                style={{ marginBottom: "15px" }}
                onClick={redirectlogin}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.auth_structure_right}>
          <img src={image} alt="man_standing" />
        </div>
      </div>
    </>
  );
}
