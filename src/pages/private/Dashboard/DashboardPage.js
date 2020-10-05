import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import Connections from "./Connections";
import Sharings from "./Sharings";
import Invitations from "./Invitations";

import { creativePut, connectionPut } from "../../../Apollo/Mutations";

import { startup_page } from "../../definitions";

import { Button, Content } from "../../../Components/elements";

export default function DashboardPage({ history }) {
  return (
    <Content maxWidth={1200}>
      <Invitations history={history} />

      <Sharings history={history} />

      <Connections history={history} />
    </Content>
  );
}
