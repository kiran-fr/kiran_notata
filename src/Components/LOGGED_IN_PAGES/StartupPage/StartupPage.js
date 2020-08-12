import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import moment from "moment";

import {
  Content,
  Card,
  BreadCrumbs,
  GhostLoader,
  Button,
  Tag,
} from "../../elements/";
import { SubjectiveScore } from "./StartupPageComponents/SubjectiveScore";
import { EvaluationBox } from "./StartupPageComponents/EvaluationBox";
import { Log } from "./StartupPageComponents/Log";
import { Share } from "./StartupPageComponents/Share";

import { userGet, connectionGet, tagGroupGet } from "../../../Apollo/Queries";
import { connectionTagAdd } from "../../../Apollo/Mutations";

import { dashboard, startup_page } from "../../../routes";

import { header_comp, sub_header } from "./StartupPage.module.css";

export default function StartupPage({ match, history }) {
  const [show, setShow] = useState(false);
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
    data: tagGroupGetData,
    loading: tagGroupGetLoading,
    error: tagGroupGetError,
  } = useQuery(tagGroupGet);

  const [mutate, { loading }] = useMutation(connectionTagAdd, {
    refetchQueries: [
      {
        query: connectionGet,
        variables: { id: match.params.id },
      },
    ],
    awaitRefetchQueries: true,
  });

  if (
    (!userGetData && userGetLoading) ||
    (!connectionGetData && connectionGetLoading)
  ) {
    return <GhostLoader />;
  }

  if (userGetError || connectionGetError || tagGroupGetError) {
    console.log(userGetError);
    console.log(connectionGetError);
    console.log(tagGroupGetError);

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
            on {moment(connection.createdAt).format("lll")}.
            <br />
            Last updated {moment(connection.updatedAt).format("lll")}.
          </div>
        </Card>

        {/*GROUPS*/}
        <Card label="SHARE">
          <Share connection={connection} user={user} history={history} />
        </Card>

        {/*TAGS*/}
        <Card label="TAGS">
          {connection.tags.map(({ name, id }) => (
            <Tag key={id}>{name}</Tag>
          ))}
          <button onClick={() => setShow(true)} disabled={loading}>
            add tags
          </button>
          {show && (
            <ul>
              {tagGroupGetLoading
                ? "...loading"
                : tagGroupGetData.accountGet.tagGroups.map(({ name, tags }) => (
                    <li>
                      <h4>{name}</h4>
                      <ul>
                        {tags.map(({ name, id }) => (
                          <li
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              mutate({
                                variables: {
                                  connectionId: connection.id,
                                  tagId: id,
                                },
                              });
                              setShow(false);
                            }}
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
            </ul>
          )}
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

        <Card label="LOG/COMMENTS">
          <Log connection={connection} user={user} />
        </Card>

        <Card label="...">
          <Button
            onClick={() => {
              const path = `${startup_page}/${match.params.id}/creative/${connection.creative.id}`;
              history.push(path);
            }}
          >
            Go to facts
          </Button>
        </Card>
      </Content>
    </>
  );
}
