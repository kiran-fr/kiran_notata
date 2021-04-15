import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import { InputForm, Button } from "Components/UI_Kits";

import { Content, Card, SuccessBox, ErrorBox } from "Components/elements/";
import { userLoggedIn } from "actions/user";
import { getUserIsLoggedIn } from "reducers/selectors/user";

import { dashboard, awaiting, login } from "definitions.js";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/notata.svg";
import linkedIn from "../../../assets/images/linkedIn.svg";
import facebook from "../../../assets/images/facebook.svg";
import googlePlus from "../../../assets/images/googlePlus.svg";

import styles from "../style.module.css";

function SignupComp({ history, location, userLoggedIn, userIsLoggedIn }) {
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const listForm = ["email", "password", "confirmPassword"];
  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);

  const { register, handleSubmit, formState, errors } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
        passwordConfirmation: yup.string().oneOf([yup.ref("password"), null]),
      })
    ),
  });
  const { isSubmitting } = formState;

  if (userIsLoggedIn) {
    history.push(location.state || dashboard);
  }

  function onSubmit(data) {
    let { email, password } = data;

    email = email.toLowerCase().trim();

    setIsLoading(true);
    Auth.signUp({
      username: email,
      password,
      attributes: { email },
    })
      .then(res => {
        let path = `${awaiting}?=awaitingConfirm=true&email=${encodeURIComponent(
          email
        )}`;
        history.push(path);
        setIsLoading(false);
      })
      .catch(error => {
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }

  const setNextFlag = index => {
    console.log("index", index);
    setPosition(index === "email" ? 1 : index === "password" ? 2 : 3);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <div className={styles.mainContent}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.logoContainer}>
              <img
                style={{ width: "40px", height: "40px" }}
                src={notata}
                alt="logo"
                className={styles.logo}
              />
              <h1>Sign up</h1>
            </div>

            <InputForm
              label="Email"
              inputType="email"
              placeholder="Email"
              position={listForm[position]}
              setNextFlag={setNextFlag}
              validate={validate}
              required
              reference={register({ required: true })}
            />
            <InputForm
              label="Password"
              inputType="password"
              placeholder="Password"
              position={listForm[position]}
              setNextFlag={setNextFlag}
              validate={validate}
              reference={register({ required: true })}
            />
            <InputForm
              label="Confirm Password"
              inputType="password"
              placeholder="Password"
              position={listForm[position]}
              setNextFlag={setNextFlag}
              validate={validate}
              reference={register({ required: true })}
            />
            <Button
              buttonStyle="secondary"
              size="large"
              buttonStyle="gray"
              style={{ marginBottom: "15px" }}
              onClick={validate}
            >
              {" "}
              SIGN UP
            </Button>
          </form>
          <div className={styles.separator}>OR</div>
          <Button
            buttonStyle="secondary"
            size="large"
            style={{ marginBottom: "15px", marginTop: "10px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: 14,
              }}
            >
              <div style={{ flex: 1 }}>
                <img
                  className={styles.socialSignupimgSize}
                  src={googlePlus}
                  alt="logo"
                  className={styles.socialSignupTxt}
                />
              </div>
              <div style={{ flex: 4 }}> Sign up with Google</div>
              <div style={{ flex: 1 }}></div>
            </div>
          </Button>
          <Button
            buttonStyle="primary"
            size="large"
            style={{ marginBottom: "15px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: 14,
              }}
            >
              <div style={{ flex: 1 }}>
                <img
                  className={styles.socialSignupimgSize}
                  src={facebook}
                  alt="logo"
                  className={styles.socialSignupTxt}
                />
              </div>
              <div style={{ flex: 4 }}>Sign up with Facebook</div>
              <div style={{ flex: 1 }}></div>
            </div>
          </Button>
          <Button
            size="large"
            style={{ marginBottom: "15px" }}
            buttonStyle="primary"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: 14,
              }}
            >
              <div style={{ flex: 1 }}>
                <img
                  className={styles.socialSignupimgSize}
                  src={linkedIn}
                  alt="logo"
                  className={styles.socialSignupTxt}
                />
              </div>
              <div style={{ flex: 4 }}>Sign up with LinkedIn</div>
              <div style={{ flex: 1 }}></div>
            </div>
          </Button>
          <div
            style={{
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            <Link
              to={login}
              style={{ textDecoration: "none", color: "#969BA3" }}
            >
              Already on Notata? Sign in
            </Link>
          </div>
        </div>
      </Grid>
      <Grid item className="imgSize" sm={6}>
        <img
          className={styles.floatImg}
          src={man_standing}
          alt="signup-image"
        />
      </Grid>
    </Grid>
  );
}

export const Signup = connect(
  state => ({
    userIsLoggedIn: getUserIsLoggedIn(state),
  }),
  {
    userLoggedIn,
  }
)(SignupComp);
