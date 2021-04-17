/* eslint-disable */
import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { ResetPassword } from "./ResetPassword";
import { useForm } from "react-hook-form";
import { InputForm, Button } from "Components/UI_Kits";
import man_standing from "../../../assets/images/man_standing.svg";
import notata from "../../../assets/images/auth_logo.png";
import styles from "../style.module.css";
import FloatingLoginButtons from "Components/floatingLoginButtons/floatingLoginButtons";

export function Instructor({ email, history }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const listForm = ["code"];

  const [position, setPosition] = useState(4);
  const [validate, setValidate] = useState(false);
  const [code, setCode] = useState("");

  const setNextFlag = index => {
    setPosition(index === "text" ? 1 : 0);
  };

  const onSubmit = async (data, event) => {
    setCode(data.code);
  };

  return (
    <>
      {code ? (
        <ResetPassword history={history} email={email} code={code} />
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
                  <h1>Email sent</h1>
                  <p
                    style={{
                      margin: "25px 0",
                      lineHeight: "18.05px",
                      fontSize: "15px",
                      color: "#969BA3",
                    }}
                  >
                    please check your email ({email}) and follow the
                    instructions to vertify it. if you did not receive an email
                    or if it expired , you can resend one.
                  </p>
                  <p
                    style={{
                      margin: "25px 0",
                      lineHeight: "18.05px",
                      fontSize: "15px",
                      color: "#969BA3",
                    }}
                  >
                    Make sure to check your junk or spam folder.
                  </p>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <InputForm
                    label="CODE"
                    inputType="code"
                    placeholder="Code"
                    position={listForm[position]}
                    setNextFlag={setNextFlag}
                    validate={validate}
                    required
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
                    NEXT
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
