import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import queryString from "query-string";
import Grid from "@material-ui/core/Grid";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import { Content, Card, SuccessBox, ErrorBox } from "Components/elements/";

import { InputForm, Button } from "Components/UI_Kits";

import { userLoggedIn } from "actions/user";
import { getUserIsLoggedIn } from "reducers/selectors/user";

import { dashboard, forgotPassword } from "definitions.js";
import loginImg from "../../../assets/images/login.svg";
import notata from "../../../assets/images/notata.svg";
import linkedIn from "../../../assets/images/linkedIn.svg";
import facebook from "../../../assets/images/facebook.svg";
import googlePlus from "../../../assets/images/googlePlus.svg";

import styles from "../style.module.css";

const getErrorMessage = ({ error }) => {
  console.log(JSON.stringify(error, null, 2));
  return error.message;
};

function LoginComp({ history, location, userLoggedIn, userIsLoggedIn }) {
  const [SMS_MFA, setSMS_MFA] = useState(false);
  const [signinUser, setSigninUser] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const listForm = ["email", "password"];
  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);

  const { register, handleSubmit, formState, setValue, errors } = useForm({
    resolver: SMS_MFA
      ? undefined
      : yupResolver(
          yup.object().shape({
            email: yup.string().email().required(),
          })
        ),
  });

  const { isSubmitting, isSubmitted } = formState;
  const s = queryString.parse(location.search);

  useEffect(() => {
    const { email } = s;
    if (!isSubmitted && !isSubmitting && email) {
      setValue("email", email);
    }
  }, [s, setValue, isSubmitting, isSubmitted]);

  const setNextFlag = index => {
    console.log("index", index);
    setPosition(index === "email" ? 1 : index === "password" ? 2 : 3);
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();

    if (signinUser && SMS_MFA) {
      try {
        const loggedUser = await Auth.confirmSignIn(
          signinUser,
          data.code.trim(),
          "SMS_MFA"
        );
        userLoggedIn(loggedUser);
      } catch (error) {
        setErrorMessage("The code doesn't seem to match...");
      }
    }

    if (!signinUser && !SMS_MFA) {
      let email = data.email.trim().toLowerCase();
      try {
        let signinUser = await Auth.signIn(email, data.password);
        setSigninUser(signinUser);
        if (signinUser.challengeName === "SMS_MFA") {
          return setSMS_MFA(true);
        }
        userLoggedIn(signinUser);
      } catch (error) {
        setErrorMessage(getErrorMessage({ error }));
      }
    }
  };

  if (userIsLoggedIn) {
    history.push(location.state || dashboard);
  }

  return (
    // {s.verified && (
    //   <SuccessBox title="Whoop whoop 🎉" style={{ marginBottom: "35px" }}>
    //     Your email have been verified, so now you are ready to rock'n rumble!
    //   </SuccessBox>
    // )}

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
              <h1>Log in</h1>
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
            <Button
              buttonStyle="secondary"
              size="large"
              buttonStyle="gray"
              style={{ marginBottom: "15px" }}
              onClick={() => {
                setValidate(true);
              }}
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
            <img
              className={styles.socialSignupimgSize}
              src={googlePlus}
              alt="logo"
              className={styles.socialSignupTxt}
            />{" "}
            Sign up with Google
          </Button>
          <Button
            buttonStyle="primary"
            size="large"
            style={{ marginBottom: "15px" }}
          >
            <img
              className={styles.socialSignupimgSize}
              src={facebook}
              alt="logo"
              className={styles.socialSignupTxt}
            />{" "}
            Sign up with Facebook
          </Button>
          <Button
            size="large"
            style={{ marginBottom: "15px" }}
            buttonStyle="primary"
          >
            <img
              className={styles.socialSignupimgSize}
              src={linkedIn}
              alt="logo"
              className={styles.socialSignupTxt}
            />{" "}
            Sign up with LinkedIn
          </Button>
        </div>
      </Grid>
      <Grid item className="imgSize" sm={6}>
        <img
          style={{ float: "right" }}
          className="floatimg"
          src={loginImg}
          alt="signup-image"
        />
      </Grid>
    </Grid>

    /* <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <div className="text-center pt-3">
            <img
              style={{ width: "40px", height: "40px" }}
              src={notata}
              alt="logo"
              className={styles.logoImg}
            />
            <h1>Log in</h1>
          </div>
          <div className={styles.alignCent}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
              <Button
                buttonStyle="secondary"
                size="large"
                buttonStyle="gray"
                style={{ marginBottom: "15px" }}
                onClick={() => {
                  setValidate(true);
                }}
              >
                {" "}
                Log in
              </Button>
            </form>
            <div className={styles.separator}>OR</div>
            <Button
              buttonStyle="secondary"
              size="large"
              style={{ marginBottom: "15px", marginTop: "10px" }}
            >
              <img
                style={{ width: "20px" }}
                src={googlePlus}
                alt="logo"
                className="mr-1"
              />{" "}
              Log in with Google
            </Button>
            <Button
              buttonStyle="primary"
              size="large"
              style={{ marginBottom: "15px" }}
            >
              <img
                style={{ width: "20px" }}
                src={facebook}
                alt="logo"
                className="mr-1"
              />{" "}
              Log in with Facebook
            </Button>
            <Button
              size="large"
              style={{ marginBottom: "15px" }}
              buttonStyle="primary"
            >
              <img
                style={{ width: "20px" }}
                src={linkedIn}
                alt="logo"
                className="mr-1"
              />{" "}
              Log in with LinkedIn
            </Button>
          </div>
        </Grid>
        <Grid item className="d-none d-sm-block leftImg" sm={6}>
          <img className="float-left" src={loginImg} alt="login" />
        </Grid>
      </Grid> */
    // <Card style={{ paddingBottom: "20px" }}>
    //   <div
    //     style={{
    //       position: "absolute",
    //       fontSize: "12px",
    //       bottom: "-23px",
    //       left: "2px",
    //     }}
    //   >
    //     <Link to={forgotPassword}>I forgot my password</Link>
    //   </div>
    // </Card>

    // {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
  );
}

export const Login = connect(
  state => ({
    userIsLoggedIn: getUserIsLoggedIn(state),
  }),
  {
    userLoggedIn,
  }
)(LoginComp);
