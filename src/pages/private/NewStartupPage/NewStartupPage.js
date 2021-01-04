import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import queryString from "query-string";

import {
  Content,
  Card,
  Button,
  BreadCrumbs,
  GhostLoader,
} from "Components/elements";

import { SubjectiveScore } from "./StartupPageComponents/SubjectiveScore";
import { EvaluationBox } from "./StartupPageComponents/EvaluationBox/EvaluationBox";
import { Log } from "./StartupPageComponents/Log";
import { Share } from "./StartupPageComponents/Share";
import { Facts } from "./StartupPageComponents/Facts";
import { Tags } from "./StartupPageComponents/Tags";
import { Funnel } from "./StartupPageComponents/Funnel";
import { PresentationPage } from "./StartupPageComponents/Presentation/PresentationPage";

import { userGet, connectionGet, groupsGet } from "Apollo/Queries";
import { connectionDelete } from "Apollo/Mutations";

import { dashboard, new_startup_page } from "pages/definitions";

import classnames from "classnames";
import styles, { delete_link } from "./StartupPage.module.css";
import { SimpleListOfSharings } from "./StartupPageComponents/Presentation/PresentationComponents/SimpleListOfSharings";
import { ExternalResources } from "./StartupPageComponents/ExternalResources";
import { Impact } from "./StartupPageComponents/Impact/Impact";

export default function StartupPage({ match, location, history }) {
  const tabList = [
    {
      key: "overview",
      content: "Overview",
    },
    {
      key: "evaluations",
      content: "Evaluations",
    },
    {
      key: "groups",
      content: "Groups",
    },
    {
      key: "presentations",
      content: <i className={"far fa-share-alt"} />,
      hidden: true,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabList[0]);

  useEffect(() => {
    const { tab } = queryString.parse(location.search);
    if (tab) {
      let tabItem = tabList.find(({ key }) => key === tab);
      if (tabItem) setActiveTab(tabItem);
    }
  }, [location]);

  const [connectionDeleteMutation, connectionDeleteRes] = useMutation(
    connectionDelete
  );

  let idString = match.params.id;
  let [id] = idString.split("?");

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
  } = useQuery(connectionGet, { variables: { id } });

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
      <Content className={styles.container}>
        <div className={styles.header}>{connection.creative.name}</div>

        <div className={styles.inner_container}>
          <div className={styles.tabs_container}>
            {tabList
              .filter(({ hidden }) => !hidden)
              .map(tabItem => (
                <div
                  key={tabItem.key}
                  className={classnames(
                    styles.tab,
                    activeTab.key === tabItem.key && styles.active_tab
                  )}
                  onClick={() => {
                    let parsed = queryString.parse(location.search);
                    let stringified = queryString.stringify({
                      ...parsed,
                      tab: tabItem.key,
                    });
                    let pathName = `${new_startup_page}/${connection.id}?${stringified}`;
                    history.push(pathName);
                  }}
                >
                  {tabItem.content}
                </div>
              ))}
          </div>

          <div className={styles.inner_content}>
            {activeTab.key === "overview" && (
              <div>
                {/*FACTS*/}
                <Facts
                  connection={connection}
                  user={user}
                  match={match}
                  history={history}
                  label={"COMPANY INFO"}
                />

                <Card label="YOUR SUBJECTIVE SCORE">
                  <SubjectiveScore
                    connection={connection}
                    user={user}
                    history={history}
                    onlyMe={true}
                  />
                </Card>

                <Impact
                  connectionId={connection.id}
                  user={user}
                  match={match}
                />

                {/*FUNNEL*/}
                <Funnel connection={connection} user={user} match={match} />

                {/*TAGS*/}
                <Tags connection={connection} user={user} match={match} />

                <ExternalResources
                  history={history}
                  location={location}
                  connectionId={connection.id}
                />

                {/*SHARING*/}
                <SimpleListOfSharings
                  history={history}
                  location={location}
                  connectionId={connection.id}
                />

                <div
                  className={delete_link}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete this startup permanently?`
                      )
                    ) {
                      /* Do nothing */
                    } else {
                      return;
                    }
                    connectionDeleteMutation({
                      variables: { id: connection.id },
                    });
                  }}
                >
                  {(connectionDeleteRes.loading && (
                    <span>... deleting</span>
                  )) || <span>delete permanently</span>}
                </div>
              </div>
            )}

            {activeTab.key === "info" && (
              <Facts
                connection={connection}
                user={user}
                match={match}
                history={history}
              />
            )}

            {activeTab.key === "resources" && (
              <div>Here you will be able to upload your own resources</div>
            )}

            {activeTab.key === "evaluations" && (
              <div>
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
              </div>
            )}

            {activeTab.key === "groups" && (
              <Card label="GROUPS">
                <Share
                  connection={connection}
                  groups={groups}
                  user={user}
                  history={history}
                />
              </Card>
            )}

            {activeTab.key === "presentations" && (
              <PresentationPage
                connectionId={connection?.id}
                creativeId={connection?.creative?.id}
                creative={connection?.creative}
                history={history}
              />
            )}

            {/*LOG/COMMENTS*/}
            {/*<Card label="LOG/COMMENTS">*/}
            {/*  <Log connection={connection} user={user} />*/}
            {/*</Card>*/}
          </div>
        </div>
      </Content>
    </>
  );
}