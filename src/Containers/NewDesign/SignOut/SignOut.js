// Date : 17/04/2020
// Created By : siva

import React, { useEffect } from "react";
import { login } from "definitions.js";
import { Auth } from "aws-amplify";
import { Message } from "../Message/Message";
import man_standing from "../../../assets/images/man_standing.svg";

export function SignOut({ history }) {
  useEffect(() => {
    Auth.signOut()
      .then(() => {
        console.log("yes");
        // setSignOut(true);
        localStorage.clear();
      })
      .catch(() => {
        localStorage.clear();
        console.log("error");

        // setSignOutError(true);
      });
  }, []);

  return (
    <Message
      heading={"Bye bye 😭"}
      subHead1={"You have been logged out!."}
      image={man_standing}
      history={history}
      path={login}
    />
  );
}
