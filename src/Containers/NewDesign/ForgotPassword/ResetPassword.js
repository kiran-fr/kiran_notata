import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";

import { InputForm, Button } from "Components/UI_Kits";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/auth_logo.png";
import styles from "../style.module.css";
import FloatingLoginButtons from "Components/floatingLoginButtons/floatingLoginButtons";
import Message from "./Message";

export function ResetPassword({ email, code, history }) {
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState(false);
  const listForm = ["password", "pwd"];
  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const setNextFlag = index => {
    console.log("index", index);
    setPosition(index === "email" ? 1 : index === "password" ? 2 : 3);
  };

  const onSubmit = async (data, event) => {
    const { password } = data;

    try {
      await Auth.forgotPasswordSubmit(email, code, password);
      setSuccessMessage("New password has been reset. You can now log in!");
      setErrorMessage(null);
    } catch (error) {
      console.log("failed with error", error);
      setErrorMessage("Something went wrong...");
      setSuccessMessage(null);
    }
  };
  return (
    <>
      {successMessage ? (
        <Message history={history} />
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
                    inputType="password"
                    placeholder="New Password"
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
                    buttonStyle="green"
                    style={{ marginBottom: "15px" }}
                    onClick={validate}
                    loading={isSubmitting}
                  >
                    {" "}
                    SAVE
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
