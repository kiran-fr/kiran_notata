import React from "react";
import Grid from "@material-ui/core/Grid";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/notata.svg";
import styles from "../style.module.css";

export function Instructor({ email }) {
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
            <h1>Email sent</h1>
            <p>
              please check your email ({email}) and follow the instructions to
              vertify it. if you did not receive an email or if it expired , you
              can resend one.
            </p>
            <p>Make sure to check your junk or spam folder.</p>
          </div>
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
