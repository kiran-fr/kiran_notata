import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import { Content, Card, Button, ErrorBox } from "../../elements/";

import { userLoggedIn } from "Modules/user";
import { getUserIsLoggedIn } from "Modules";

import { dashboard, awaiting, login } from "pages/definitions";

function SignupComp({ history, location, userLoggedIn, userIsLoggedIn }) {
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
        console.log("res", res);
        let path = `${awaiting}?=awaitingConfirm=true&email=${encodeURIComponent(
          email
        )}`;
        history.push(path);
        setIsLoading(false);
      })
      .catch(error => {
        console.log("error", error);
        setErrorMessage(error.message);
        setIsLoading(false);
      });
  }

  return (
    <Content maxWidth={600} center>
      <h1>Sign up</h1>
      <Card style={{ paddingBottom: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
          <div>
            <label for="email">Email</label>
            <input
              type="text"
              placeholder="email"
              ref={register({ required: true })}
              name="email"
              id="email"
            />
            {errors && errors.email && (
              <p
                style={{
                  color: "var(--color-primary)",
                  fontSize: "12px",
                  textAlign: "right",
                  position: "relative",
                  top: "-6px",
                  right: "4px",
                }}
              >
                that email does not look valid
              </p>
            )}

            <label for="password">Password</label>
            <input
              type="password"
              placeholder="password"
              ref={register({ required: true })}
              name="password"
              id="password"
            />

            <input
              type="password"
              name="passwordConfirmation"
              ref={register({
                required: true,
              })}
              placeholder="confirm password"
            />
            {errors && errors.passwordConfirmation && (
              <p
                style={{
                  color: "var(--color-primary)",
                  fontSize: "12px",
                  textAlign: "right",
                  position: "relative",
                  top: "-6px",
                  right: "4px",
                }}
              >
                passwords don't match
              </p>
            )}
          </div>

          <div style={{ textAlign: "right" }}>
            <Button
              type="input"
              value="Sign up"
              loading={isSubmitting || isLoading}
            />
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
          <Link to={login}>Already have an account?</Link>
        </div>
      </Card>

      {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
    </Content>
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
