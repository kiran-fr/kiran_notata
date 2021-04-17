/* eslint-disable */
import React from "react";
import { Button } from "Components/UI_Kits";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/auth_logo.png";
import { login } from "../../../definitions";
import styles from "../style.module.css";
import FloatingLoginButtons from "Components/floatingLoginButtons/floatingLoginButtons";

export default function Message({ history }) {
  const redirectlogin = () => {
    history.push(login);
  };

  return (
    <>
      <div className={styles.auth_structure}>
        <div className={styles.auth_structure_left}>
          <div className={styles.mainContent}>
            <div className={styles.logoContainer}>
              <img
                style={{ width: "40px", height: "40px", marginBottom: "15px" }}
                src={notata}
                alt="logo"
                className={styles.logo}
              />
              <h1>Password Reset</h1>
              <p
                style={{
                  margin: "25px 0",
                  lineHeight: "18.05px",
                  fontSize: "15px",
                  color: "#969BA3",
                }}
              >
                Your password has been reset.
              </p>
              <p
                style={{
                  margin: "25px 0",
                  lineHeight: "18.05px",
                  fontSize: "15px",
                  color: "#969BA3",
                }}
              >
                please, click next to login.
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
          <img src={man_standing} alt="man_standing" />
        </div>
        <FloatingLoginButtons />
      </div>
    </>
  );
}
