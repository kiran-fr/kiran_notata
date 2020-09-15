import React from "react";
import { useQuery } from "@apollo/client";
import moment from "moment";

import {
  Content,
  Card,
  BreadCrumbs,
  GhostLoader,
} from "../../../Components/elements";
import { SubjectiveScore } from "./StartupPageComponents/SubjectiveScore";
import { EvaluationBox } from "./StartupPageComponents/EvaluationBox";
import { Log } from "./StartupPageComponents/Log";
import { Share } from "./StartupPageComponents/Share";
import { Facts } from "./StartupPageComponents/Facts";
import { Tags } from "./StartupPageComponents/Tags";

// import { Funnel } from "./StartupPageComponents/Funnel";
import { userGet, connectionGet } from "../../../Apollo/Queries";
import { dashboard, startup_page } from "../../definitions";

import { header_comp, sub_header } from "./StartupPage.module.css";

export default function StartupPage({ match, history }) {
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

  if (
    (!userGetData && userGetLoading) ||
    (!connectionGetData && connectionGetLoading)
  ) {
    return <GhostLoader />;
  }

  if (userGetError || connectionGetError) {
    console.log(userGetError);
    console.log(connectionGetError);
    return <div>We are updating</div>;
  }

  const user = userGetData.userGet;
  const connection = connectionGetData.connectionGet;

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
            on {moment(connection.createdAt).format("lll")}. Last updated{" "}
            {moment(connection.updatedAt).format("lll")}.
          </div>
        </Card>

        {/*FACTS*/}
        <Card label="FACTS" style={{ paddingBottom: "20px" }}>
          <Facts
            connection={connection}
            user={user}
            match={match}
            history={history}
          />
        </Card>

        {/*FUNNEL*/}
        {/*
          <Card label="FUNNEL" style={{ paddingBottom: "20px" }}>
            <Funnel connection={connection} user={user} match={match} />
          </Card>
        */}

        {/*TAGS*/}
        <Card label="TAGS" style={{ paddingBottom: "20px" }}>
          <Tags connection={connection} user={user} match={match} />
        </Card>

        {/*SUBJECTIVE SCORE*/}
        <Card label="SUBJECTIVE SCORE">
          <SubjectiveScore connection={connection} user={user} />
        </Card>

        <Card label="EVALUATIONS">
          <EvaluationBox
            connection={connection}
            user={user}
            history={history}
          />
        </Card>

        {/*GROUPS*/}
        <Card label="SHARE">
          <Share connection={connection} user={user} history={history} />
        </Card>

        {/*LOG/COMMENTS*/}
        <Card label="LOG/COMMENTS">
          <Log connection={connection} user={user} />
        </Card>
      </Content>
    </>
  );
}
