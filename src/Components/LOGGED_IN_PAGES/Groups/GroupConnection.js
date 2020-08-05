import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import { groupGet, connectionsGet } from "../../../Apollo/Queries";
import { groupPut } from "../../../Apollo/Mutations";
import { group as group_route } from "../../../routes";

import validateEmail from "../../../utils/validateEmail";

import {
  BreadCrumbs,
  Content,
  Card,
  Table,
  Button,
  Modal,
} from "../../elements/";

export default function GroupConnection({ match, history }) {
  const id = match.params.id;
  const connectionId = match.params.connectionId;

  const [getData, { data, loading, error }] = useLazyQuery(groupGet);
  const [mutate] = useMutation(groupPut);

  useEffect(() => {
    getData({ variables: { id } });
  }, []);

  let group = (data || {}).groupGet || {};
  let startups = (group || {}).startups || [];
  let shared_startup =
    startups.find(c => c.connectionId === connectionId) || {};
  let connection = (shared_startup || {}).connection || {};

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "all groups",
            link: `${group_route}`,
          },
          {
            val: `Group: ${group.name}`,
            link: `${group_route}/${id}`,
          },
          {
            val: `Startup: ${(connection.creative || {}).name}`,
            link: `${group_route}/${id}/${connection.id}`,
          },
        ]}
      />

      <Content maxWidth={600}>
        <pre>{JSON.stringify(shared_startup, null, 2)}</pre>
      </Content>
    </>
  );
}
