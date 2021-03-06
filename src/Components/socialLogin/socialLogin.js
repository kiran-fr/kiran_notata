/* eslint-disable */
import React from "react";
import { Button } from "../UI_Kits";

import styles from "../../private/Pages/LoginPages/style.module.css";
import linkedIn from "../../assets/images/linkedIn.svg";
import facebook from "../../assets/images/facebook.svg";
import googlePlus from "../../assets/images/googlePlus.svg";

export default function SocialLogin({ type }) {
  return (
    <div className={styles.go_social}>
      <Button buttonStyle="gray" size="large" style={{ marginBottom: "10px" }}>
        <div className={styles.auth_button_image}>
          <img
            className={styles.socialSignupimgSize + styles.socialSignupTxt}
            src={googlePlus}
            alt="logo"
            style={{ paddingLeft: "7px" }}
          />
        </div>
        <p>{type} with Google</p>
      </Button>
      <Button buttonStyle="gray" size="large" style={{ marginBottom: "10px" }}>
        <div className={styles.auth_button_image}>
          <img
            className={styles.socialSignupimgSize + styles.socialSignupTxt}
            src={facebook}
            alt="logo"
          />
        </div>
        <p>{type} with Facebook</p>
      </Button>
      <Button size="large" style={{ marginBottom: "10px" }} buttonStyle="gray">
        <div className={styles.auth_button_image}>
          <img
            className={styles.socialSignupimgSize + styles.socialSignupTxt}
            src={linkedIn}
            alt="logo"
          />
        </div>
        <p>{type} with LinkedIn</p>
      </Button>
    </div>
  );
}
