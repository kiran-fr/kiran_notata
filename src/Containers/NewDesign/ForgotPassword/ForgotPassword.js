// Date : 12/04/2020
// Created By : siva

/* eslint-disable */
import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Instructor } from "./Instructor";
import { useForm } from "react-hook-form";
import { InputForm, Button } from "Components/UI_Kits";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/auth_logo.png";
import styles from "../style.module.css";
import FloatingLoginButtons from "Components/floatingLoginButtons/floatingLoginButtons";

export function ForgotPassword({ history }) {
  const { register, handleSubmit, formState } = useForm();

  const { isSubmitting } = formState;
  const [emailSent, SetEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [loader, setLoader] = useState(false);

  const onSubmit = async data => {
    const { email } = data;
    setLoader(true);
    try {
      await Auth.forgotPassword(email);
      SetEmail(email);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      setErrorMessage(error.message);
    }
  };

  const handleInputChange = (val, name) => {
    if (name === "email") {
      setErrorMessage("");
    }
  };

  return (
    <>
      {emailSent ? (
        <Instructor
          loader={loader}
          handleResend={onSubmit}
          email={emailSent}
          history={history}
        />
      ) : (
        <div className={styles.auth_structure}>
          <div className={styles.auth_structure_left}>
            <div className={styles.mainContent}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.logoContainer}>
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                      marginBottom: "15px",
                    }}
                    src={notata}
                    alt="logo"
                    className={styles.logo}
                  />
                  <h1>Forgot your password?</h1>
                  <p
                    style={{
                      margin: "25px 0",
                      lineHeight: "18.05px",
                      fontSize: "15px",
                      color: "#969BA3",
                    }}
                  >
                    Please enter your email and we'll find your account and then
                    you will receive instructions on your email to rest your
                    password
                  </p>
                </div>
                <div style={{ marginTop: "20px", width: "100%" }}>
                  <InputForm
                    label="Email"
                    type="email"
                    errorMessage={errorMessage}
                    name="email"
                    placeholder="Email"
                    handleInputChange={(value, name) =>
                      handleInputChange(value, name)
                    }
                    required
                    reference={register({ required: true })}
                  />
                  <Button
                    buttonStyle="secondary"
                    size="large"
                    buttonStyle="green"
                    style={{ marginBottom: "15px" }}
                    loading={isSubmitting}
                  >
                    {!isSubmitting && "SEND INSTRUCTIONS"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <div className={styles.auth_structure_right}>
            <img src={man_standing} alt="man_standing" />
          </div>
          <FloatingLoginButtons />
        </div>
      )}
    </>
  );
}
