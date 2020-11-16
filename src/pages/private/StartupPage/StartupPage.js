import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Redirect } from "react-router-dom";
import moment from "moment";
import gql from "graphql-tag";

import { Content, Card, BreadCrumbs, GhostLoader } from "Components/elements";

import { SubjectiveScore } from "./StartupPageComponents/SubjectiveScore";
import { EvaluationBox } from "./StartupPageComponents/EvaluationBox/EvaluationBox";
import { Log } from "./StartupPageComponents/Log";
import { Share } from "./StartupPageComponents/Share";
import { Facts } from "./StartupPageComponents/Facts";
import { Tags } from "./StartupPageComponents/Tags";

import { Funnel } from "./StartupPageComponents/Funnel";

import { userGet, connectionGet, groupsGet } from "Apollo/Queries";
import { connectionDelete } from "Apollo/Mutations";

import { dashboard, startup_page } from "pages/definitions";

import { header_comp, sub_header, delete_link } from "./StartupPage.module.css";

export default function StartupPage({ match, history }) {
  const [connectionDeleteMutation, connectionDeleteRes] = useMutation(
    connectionDelete
  );

  if (
    connectionDeleteRes.called &&
    connectionDeleteRes.data &&
    !connectionDeleteRes.loading
  ) {
    history.push(dashboard);
  }

  const {
    data: userGetData,
    loading: userGetLoading,
    error: userGetError,
  } = useQuery(userGet);

  const {
    data: connectionGetData,
    loading: connectionGetLoading,
    error: connectionGetError,
  } = useQuery(connectionGet, { variables: { id: match.params.id } });

  const {
    data: groupsGetData,
    loading: groupsGetLoading,
    error: groupsGetError,
  } = useQuery(groupsGet);

  if (
    (!userGetData && userGetLoading) ||
    (!connectionGetData && connectionGetLoading) ||
    (!groupsGetData && groupsGetLoading)
  ) {
    return <GhostLoader />;
  }

  if (userGetError || connectionGetError || groupsGetError) {
    console.log("userGetError", userGetError);
    console.log("connectionGetError", connectionGetError);
    console.log("groupsGetError", groupsGetError);
    return <div>We are updating</div>;
  }

  const user = userGetData.userGet;
  const connection = connectionGetData.connectionGet;
  const groups = groupsGetData.groupsGet;

  let evaluationsCount = connection.evaluations.length;
  for (let shared of connection.sharedWithMe) {
    if (shared.connection) {
      evaluationsCount += (shared.connection.evaluations || []).length;
    }
  }

  let sharedWithGroups =
    groups.filter(g =>
      g.startups.some(s => s.connectionId === connection.id)
    ) || [];

  let groupMembers = {};
  for (let s of sharedWithGroups) {
    for (let m of s.members) {
      groupMembers[m.email] = true;
    }
  }

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Dashboard",
            link: `${dashboard}`,
          },
          {
            val: `Startup: ${connection.creative.name}`,
            link: `${startup_page}/${match.params.id}`,
          },
        ]}
      />

      <Content maxWidth={780}>
        {/*FACTS*/}
        <Facts
          connection={connection}
          user={user}
          match={match}
          history={history}
        />

        {/*FUNNEL*/}
        {/*<Card label="FUNNEL" style={{ paddingBottom: "20px" }}>*/}
        <Funnel connection={connection} user={user} match={match} />
        {/*</Card>*/}

        {/*TAGS*/}
        <Card label="TAGS" style={{ paddingBottom: "20px" }}>
          <Tags connection={connection} user={user} match={match} />
        </Card>

        {/*SUBJECTIVE SCORE*/}
        <Card label="SUBJECTIVE SCORE">
          <SubjectiveScore
            connection={connection}
            user={user}
            history={history}
          />
        </Card>

        <Card label="EVALUATIONS" style={{ paddingTop: "0px" }}>
          <EvaluationBox
            connection={connection}
            groups={groups}
            user={user}
            history={history}
          />
        </Card>

        {/*GROUPS*/}
        <Card label="GROUPS">
          <Share
            connection={connection}
            groups={groups}
            user={user}
            history={history}
          />
        </Card>

        {/*LOG/COMMENTS*/}
        <Card label="LOG/COMMENTS">
          <Log connection={connection} user={user} />
        </Card>

        <div
          className={delete_link}
          onClick={() => {
            if (
              window.confirm(
                `Are you sure you want to this startup permanently?`
              )
            ) {
              /* Do nothing */
            } else {
              return;
            }
            connectionDeleteMutation({ variables: { id: connection.id } });
          }}
        >
          {(connectionDeleteRes.loading && <span>... deleting</span>) || (
            <span>delete permanently</span>
          )}
        </div>
      </Content>
    </>
  );
}
