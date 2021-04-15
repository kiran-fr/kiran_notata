import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { login } from "definitions.js";
import Grid from "@material-ui/core/Grid";
import { Button } from "Components/UI_Kits";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/notata.svg";
import styles from "../style.module.css";

export function PasswordMsg({ email }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <div className={styles.mainContent}>
          <div className={styles.logoContainer}>
            <img
              style={{ width: "40px", height: "40px" }}
              src={notata}
              alt="logo"
              className={styles.logo}
            />
            <h1>Password Rest</h1>
            <p>Your password has been reset</p>
            <p>Please, click next to log in.</p>
          </div>
          <Button
            buttonStyle="secondary"
            size="large"
            buttonStyle="gray"
            style={{ marginTop: "15px" }}
          >
            {" "}
            NEXT
          </Button>
        </div>
      </Grid>
      <Grid item className="imgSize" sm={6}>
        <img
          className={styles.floatImg}
          src={man_standing}
          alt="man-standing-image"
        />
      </Grid>
    </Grid>
  );
}
