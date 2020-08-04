import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import classnames from "classnames";
import moment from "moment";

import { userGet, connectionGet } from "../../../Apollo/Queries";

import { dashboard, startup_page } from "../../../routes";

import { Content, Card, BreadCrumbs } from "../../elements/NotataComponents/";

import { header_comp, sub_header } from "./StartupPage.module.css";

import { SubjectiveScore } from "./SubjectiveScore";
import { Log } from "./Log";

export default function StartupPage({ match, history }) {
  const id = match.params.id;

  let user = {};
  const userQuery = useQuery(userGet);
  if (!userQuery.loading && userQuery.data) {
    user = userQuery.data.userGet;
  }

  const [getData, { data, loading, error }] = useLazyQuery(connectionGet);

  let connection = {
    creative: {},
    createdByUser: {}
  };
  if (data) {
    connection = data.connectionGet;
  }

  useEffect(() => {
    if (id && id !== "new") {
      getData({ variables: { id } });
    }
  }, []);

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Dashboard",
            link: `${dashboard}`
          },
          {
            val: `Startup: ${connection.creative.name}`,
            link: `${startup_page}/${id}`
          }
        ]}
      />
      <Content maxWidth={600}>
        {/*HEADER*/}
        <Card>
          <div className={header_comp}>{connection.creative.name}</div>
          <div className={sub_header}>
            Created by{" "}
            <b>
              {connection.createdByUser.given_name}{" "}
              {connection.createdByUser.family_name}
            </b>{" "}
            on {moment(connection.createdAt).format("lll")}.
            <br />
            Last updated {moment(connection.updatedAt).format("lll")}.
          </div>
        </Card>

        {/*TAGS*/}
        <Card label="TAGS"></Card>

        {/*SUBJECTIVE SCORE*/}
        <Card label="SUBJECTIVE SCORE">
          <SubjectiveScore connection={connection} user={user} />
        </Card>

        <Card label="EVALUATIONS"></Card>

        <Card label="LOG/COMMENTS">
          <Log connection={connection} user={user} />
        </Card>

        <Card label="..."></Card>

        <pre>{JSON.stringify(connection, null, 2)}</pre>
      </Content>
    </>
  );
}
