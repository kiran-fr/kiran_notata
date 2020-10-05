import React, { useState } from "react";
import moment from "moment";

// API
import { useQuery, useMutation } from "@apollo/client";
import { userInvitationsGet } from "../../../Apollo/Queries";
import { accountInvite } from "../../../Apollo/Mutations";

// COMPONENTS
import Filters from "./Filters";

// import { group as group_route } from "../../definitions";

import { Card, Table } from "../../../Components/elements";

import { delete_bucket } from "./Invitations.module.css";

import { ExternalInvitations } from "../Team/Team";

export default function Invitations({ history }) {
  const { data, error, loading } = useQuery(userInvitationsGet);

  if (loading) {
    return <span />;
  }

  if (error) {
    console.log("error", error);
    return <span />;
  }

  let userInvitations = data.userInvitationsGet;

  if (!userInvitations.length) return <span />;

  return (
    <>
      <Card
        label="Invitations"
        maxWidth={1200}
        style={{ paddingBottom: "20px" }}
      >
        <ExternalInvitations userInvitations={userInvitations} />
      </Card>
    </>
  );
}
