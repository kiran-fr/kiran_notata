import React from "react";
import { Auth } from "aws-amplify";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import classnames from "classnames";
import { login } from "../../../routes";
import { useForm } from "react-hook-form";

import { Content, Card, Button, SuccessBox, ErrorBox } from "../../elements/";

export function EnterUsername({ done }) {
  const { register, handleSubmit, formState, getValues, setValue } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    const { username } = data;
    try {
      await Auth.forgotPassword(username);
      done(username);
    } catch (error) {
      /* Will not throw errors */
    }
  };

  return (
    <Content maxWidth={600} center>
      <h1>Forgot your password?</h1>
      <Card style={{ paddingBottom: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
          <label for="username">Your email</label>
          <input
            type="text"
            placeholder="name@mail.com"
            autoComplete="off"
            ref={register({ required: true })}
            name="username"
            id="username"
          />

          <div style={{ textAlign: "right" }}>
            <Button type="input" value="Log in" loading={isSubmitting} />
          </div>
        </form>

        <div
          style={{
            position: "absolute",
            fontSize: "12px",
            bottom: "-23px",
            left: "2px",
          }}
        >
          <Link to={login}>Send</Link>
        </div>
      </Card>
    </Content>
  );
}
