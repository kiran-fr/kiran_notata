import React, { useState } from "react";
import { login } from "definitions.js";
import { Message } from "../Message/index";
import man_standing from "../../../assets/images/man_standing.svg";

export function SignOut({ history }) {
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
