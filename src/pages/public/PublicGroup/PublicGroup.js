import React, { useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { Content, ErrorBox, GhostLoader } from "../../elements/";
import { publicGroupGet } from "../../../Apollo/Queries";

export function PublicCreative({ match }) {
  let { id } = match.params;
  if (error) {
    return (
      <Content maxWidth={600} center>
        <ErrorBox>Form not found...</ErrorBox>
      </Content>
    );
  }
  return <GhostLoader />;
}
