// Date : 12/04/2020
// Created By : siva

import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";

import { login } from "definitions.js";
import { InputForm, Button } from "Components/UI_Kits";
import FloatingLoginButtons from "Components/floatingLoginButtons/floatingLoginButtons";
import { Message } from "../Message/Message";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/auth_logo.png";
import styles from "../style.module.css";

export function ResetPassword({ email, code, history, handleBack }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const listForm = ["password", "pwd"];
  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);
  const [password, setPassword] = useState("");

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const setNextFlag = index => {
    setPosition(index === "email" ? 1 : index === "password" ? 2 : 3);
  };

  const onSubmit = async (data, event) => {
    const { password } = data;

    try {
      await Auth.forgotPasswordSubmit(email, code, password);
      setSuccessMessage("New password has been reset. You can now log in!");
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    }
  };

  const handleInputChange = (val, name) => {
    if (name === "password" && val === "") {
      setErrorMessage("");
    }
    if (name === "password") {
      setPassword(val);
    }
  };

  const data = { code: "" };

  return (
    <>
      {successMessage ? (
        <Message
          heading={"Password Reset🚀"}
          subHead1={"Your password has been reset."}
          subHead2={"please, click next to login."}
          image={man_standing}
          history={history}
          path={login}
        />
      ) : (
        <div className={styles.auth_structure}>
          <div className={styles.auth_structure_left}>
            <div className={styles.mainContent}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.logoContainer}>
                  <img
                    style={{ width: "40px", height: "40px" }}
                    src={notata}
                    alt="logo"
                    className={styles.logo}
                  />
                  <h1>Reset Password</h1>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <InputForm
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="New Password"
                    position={listForm[position]}
                    setNextFlag={setNextFlag}
                    handleInputChange={(value, name) =>
                      handleInputChange(value, name)
                    }
                    validate={validate}
                    reference={register({ required: true })}
                  />
                  <InputForm
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Password"
                    position={listForm[position]}
                    setNextFlag={setNextFlag}
                    validate={validate}
                    passwordConfirm={true}
                    errorMessage={errorMessage}
                    primaryPwdVal={password}
                    reference={register({ required: true })}
                  />
                  <Button
                    buttonStyle="secondary"
                    size="large"
                    buttonStyle="green"
                    style={{ marginBottom: "15px" }}
                    onClick={errorMessage ? () => handleBack(data) : validate}
                    loading={isSubmitting}
                  >
                    {" "}
                    {!isSubmitting && (!errorMessage ? "SAVE" : "BACK")}
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
