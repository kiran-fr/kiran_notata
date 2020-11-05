import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { connectionsGet, groupGet } from "Apollo/Queries";

import { groupPut, connectionPut } from "Apollo/Mutations";
import ShareSetting from "./ShareSetting";

import { group as group_route, startup_page } from "pages/definitions";

import {
  shared_by_item,
  shared_by_list,
  button_class,
  action_link,
  add_all_container,
} from "./Group.module.css";

import { Table, Button, Modal } from "Components/elements";

function StartupList({ group, connections, settings, user, isAdmin, history }) {
  const [isLoadingAddAll, setIsLoadingAddAll] = useState(false);
  const [isLoadingDownload, setIsLoadingDownload] = useState({});
  const [showShareSettings, setShowShareSettings] = useState(null);

  const [mutate] = useMutation(groupPut, {
    refetchQueries: [
      {
        query: groupGet,
        variables: { id: group.id },
      },
    ],
  });

  const [connectionPutMutate] = useMutation(connectionPut);

  let ss = {};
  for (let startup of group.startups) {
    ss[startup.creativeId] = ss[startup.creativeId] || [];
    ss[startup.creativeId].push(startup);
  }

  let list = [];

  for (let creativeId in ss) {
    if (ss[creativeId] && ss[creativeId][0] && ss[creativeId][0].connection) {
      let item = {
        creative: ss[creativeId][0].connection.creative,
        startups: ss[creativeId],
      };
      list.push(item);
    }
  }

  function getAddAllStatus() {
    let saveAndShare = 0;
    let share = 0;

    for (let g of list) {
      let { creative, startups } = g;

      // let my_startups = haveShared({ startups });
      let match = startups.find(({ sharedBy }) => sharedBy === user.email);

      if (!match) share += 1;

      let match2 = connections.find(
        ({ creativeId }) => creativeId === creative.id
      );
      if (!match2) saveAndShare += 1;
    }
    return { share, saveAndShare };
  }

  const { saveAndShare, share } = getAddAllStatus();

  function haveSharedStartup({ startups }) {
    let my_startups = haveShared({ startups });
    let match = my_startups.find(({ sharedBy }) => sharedBy === user.email);
    return !!match;
  }

  async function addAllAndShareBack() {
    if (isLoadingAddAll) return;

    setIsLoadingAddAll(true);

    for (let g of list) {
      let { creative, startups } = g;

      let match = connections.find(
        ({ creativeId }) => creativeId === creative.id
      );

      setIsLoadingDownload({ [creative.id]: true });

      // SAVE STARTUP
      if (!match) {
        try {
          await connectionPutMutate({
            variables: {
              creativeId: creative.id,
            },
            update: (proxy, { data: { connectionPut } }) => {
              const data = proxy.readQuery({
                query: connectionsGet,
              });
              proxy.writeQuery({
                query: connectionsGet,
                data: {
                  connectionsGet: [...connections, connectionPut],
                },
              });
              match = connectionPut;
            },
          });
        } catch (error) {
          console.log("error", error);
        }
      }

      try {
        let variables = {
          id: group.id,
          input: {
            addStartup: {
              connectionId: match.id,
              creativeId: match.creativeId,
              comments: true,
              evaluations: true,
              subjective_score: true,
              tags: true,
            },
          },
        };

        await mutate({ variables });
      } catch (error) {
        console.log("error", error);
      }
      setIsLoadingDownload({ [creative.id]: false });
    }

    setIsLoadingAddAll(false);
  }

  function haveShared({ startups }) {
    let account_startups = startups.filter(({ connectionId }) =>
      connections.some(({ id }) => id === connectionId)
    );

    let my_startups = account_startups.filter(
      ({ sharedBy }) => sharedBy === user.email
    );

    return my_startups;
  }

  function CellActions({ g }) {
    let { creative, startups } = g;

    if (haveShared({ startups }).length) {
      return <span />;
    }

    let match = connections.find(
      ({ creativeId }) => creativeId === creative.id
    );

    if (isLoadingDownload[creative.id]) {
      return (
        <div className={action_link}>
          <i className="fa fa-spinner fa-spin" />
        </div>
      );
    }

    if (match && settings.addStartup) {
      return (
        <div
          className={action_link}
          onClick={() => {
            setShowShareSettings(match);
          }}
        >
          <i className="fal fa-share-alt" /> share back
        </div>
      );
    }

    if (!match) {
      return (
        <div
          className={action_link}
          onClick={async () => {
            try {
              setIsLoadingDownload({ [creative.id]: true });
              let res = await connectionPutMutate({
                variables: {
                  creativeId: creative.id,
                },
                update: (proxy, { data: { connectionPut } }) => {
                  const data = proxy.readQuery({
                    query: connectionsGet,
                  });
                  proxy.writeQuery({
                    query: connectionsGet,
                    data: {
                      connectionsGet: [...connections, connectionPut],
                    },
                  });
                },
              });
            } catch (error) {
              console.log(error);
            }
            setIsLoadingDownload({ [creative.id]: false });
          }}
        >
          <i className="fal fa-cloud-download" /> <span> save startup</span>
        </div>
      );
    }

    return <span />;
  }

  const columns = [
    {
      title: "Name",
      key: "name",
      render: g => {
        let { creative, startups } = g;

        return (
          <span>
            <div>{creative.name}</div>

            <div className={shared_by_list}>
              {startups.map((startup, i) => {
                const { sharedBy, createdAt, connection } = startup;

                let avg;
                if (
                  connection?.subjectiveScores &&
                  connection?.subjectiveScores.length
                ) {
                  let { score: ttl } = connection.subjectiveScores.reduce(
                    (a, b) => ({
                      score: a.score + b.score,
                    })
                  );
                  avg = (ttl / connection.subjectiveScores.length).toFixed(1);
                }

                return (
                  <div
                    className={shared_by_item}
                    onClick={() => {
                      history.push(
                        `${group_route}/${group.id}/${connection.id}`
                      );
                    }}
                    key={i}
                  >
                    <span> {sharedBy}</span>
                  </div>
                );
              })}
            </div>

            <CellActions g={g} />
          </span>
        );
      },
    },
    {
      title: "",
      key: "connection",
      width: 30,
      render: g => {
        let match = connections.find(
          ({ creativeId }) => creativeId === g.creative.id
        );
        return (
          <div className={button_class}>
            <Button
              type="right_arrow"
              size="small"
              onClick={() => {
                let path = match
                  ? `${startup_page}/${match.id}`
                  : `${group_route}/${group.id}/${g.startups[0].connection.id}`;
                history.push(path);
              }}
            >
              view
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {settings.addStartup && (saveAndShare !== 0 || share !== 0) && (
        <div className={add_all_container}>
          <Button
            size="medium"
            loading={isLoadingAddAll}
            iconClass="fas fa-cloud-download"
            onClick={async () => {
              await addAllAndShareBack();
            }}
          >
            add all and share back
          </Button>
        </div>
      )}

      <Table
        dataSource={list}
        columns={columns}
        disableHead={true}
        pagination={false}
      />

      {showShareSettings && (
        <Modal
          title="Share startup"
          close={() => {
            setShowShareSettings(null);
          }}
          disableFoot={true}
        >
          <ShareSetting
            group={group}
            connection={showShareSettings}
            mutate={mutate}
            done={() => {
              setShowShareSettings(null);
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "26px",
              bottom: "33px",
            }}
          >
            <Button
              buttonStyle="secondary"
              size="medium"
              onClick={() => setShowShareSettings(null)}
            >
              cancel
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default StartupList;
