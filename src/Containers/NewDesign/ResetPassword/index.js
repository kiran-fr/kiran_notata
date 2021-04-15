import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "definitions.js";
import Grid from "@material-ui/core/Grid";

import { InputForm, Button } from "Components/UI_Kits";
import { Content, Card, SuccessBox, ErrorBox } from "Components/elements/";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/notata.svg";
import styles from "../style.module.css";

const makeid = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export function ResetPassword({ email }) {
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const listForm = ["password", "pwd"];
  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const setNextFlag = index => {
    console.log("index", index);
    setPosition(index === "email" ? 1 : index === "password" ? 2 : 3);
  };

  const ids = {
    form: makeid(8),
    code: makeid(8),
    password: makeid(8),
  };

  const onSubmit = async (data, event) => {
    // const { code, password } = data;
    // const code = data[ids.code];
    const code = "12345";
    const password = "sa12121994@jsl";

    try {
      await Auth.forgotPasswordSubmit(
        "sivakumarjegadesan@gmail.com",
        code,
        password
      );
      setSuccessMessage("New password has been reset. You can now log in!");
      setErrorMessage(null);
    } catch (error) {
      console.log("failed with error", error);
      setErrorMessage("Something went wrong...");
      setSuccessMessage(null);
    }
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
                buttonStyle="gray"
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
