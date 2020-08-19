import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { groupsGet } from "../../../../Apollo/Queries";
import { groupPut } from "../../../../Apollo/Mutations";
import validateEmail from "../../../../utils/validateEmail";
import { group as group_route } from "../../../../routes";

import { useForm } from "react-hook-form";
import { Modal, Table, Button } from "../../../elements";

import { share_title, share_description, icon_item } from "./Share.module.css";
import classnames from "classnames";
import moment from "moment";

function ShareSetting({ group, connection, mutate, done }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    let variables = {
      id: group.id,
      input: {
        addStartup: {
          connectionId: connection.id,
          ...data,
        },
      },
    };

    try {
      await mutate({
        variables,
        update: (proxy, { data: { groupPut } }) => {
          const data = proxy.readQuery({
            query: groupsGet,
          });
          proxy.writeQuery({
            query: groupsGet,
            data: {
              groupsGet: [
                ...data.groupsGet.map(g => {
                  if (g.id !== group.id) return g;
                  return {
                    ...g,
                    startups: [...g.startups, groupPut],
                  };
                }),
              ],
            },
          });
        },
      });
      done();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <div className={share_description}>
        In addition to the facts part of the startup, what else would you like
        to share with this group?
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
        <div className="check_container">
          <input
            type="checkbox"
            ref={register}
            defaultChecked={true}
            name="evaluations"
            id="evaluations"
          />
          <label>evaluations</label>
        </div>

        <div className="check_container">
          <input
            type="checkbox"
            ref={register}
            defaultChecked={true}
            name="subjective_score"
            id="subjective_score"
          />
          <label>subjective score</label>
        </div>

        <div className="check_container">
          <input
            type="checkbox"
            ref={register}
            defaultChecked={true}
            name="tags"
            id="tags"
          />
          <label>tags</label>
        </div>

        <div className="check_container">
          <input
            type="checkbox"
            ref={register}
            defaultChecked={true}
            name="comments"
            id="comments"
          />
          <label>comments</label>
        </div>

        <div
          style={{
            marginTop: "15px",
            textAlign: "right",
          }}
        >
          <Button type="input" value="OK" loading={isSubmitting} />
        </div>
      </form>
    </div>
  );
}

function SharedWithGroupList({ groups, connection, mutate, history }) {
  const columns = [
    {
      title: "",
      key: "delete",
      width: 20,
      className: "delete_bucket",
      render: group => {
        return (
          <i
            className="fal fa-trash-alt"
            onClick={() => {
              let variables = {
                id: group.id,
                input: { removeStartup: connection.id },
              };

              mutate({
                variables,
                update: (proxy, { data: { groupPut } }) => {
                  const data = proxy.readQuery({
                    query: groupsGet,
                  });
                  proxy.writeQuery({
                    query: groupsGet,
                    data: {
                      groupsGet: [
                        ...data.groupsGet.map(g => {
                          if (g.id !== group.id) return g;
                          return {
                            ...g,
                            startups: g.startups.filter(
                              s => s.connectionId !== connection.id
                            ),
                          };
                        }),
                      ],
                    },
                  });
                },
              });
            }}
          />
        );
      },
    },
    {
      title: "Name",
      key: "name",
      render: group => {
        return (
          <span>
            <div>{group.name}</div>
            <div style={{ opacity: 0.5, fontSize: "12px" }}>
              {group.members.length} members -{" "}
              {moment(group.createdAt).format("ll")}
            </div>
          </span>
        );
      },
    },
    {
      title: "Icons",
      key: "icons",
      className: "desktop_only",
      render: group => {
        let iconList = [];
        let startup = group.startups.find(
          s => s.connectionId === connection.id
        );
        if (startup.comments) iconList.push("fas fa-comment");
        if (startup.tags) iconList.push("fas fa-tags");
        if (startup.subjective_score) iconList.push("fas fa-brain");
        if (startup.evaluations) iconList.push("fas fa-clipboard-list-check");
        return (
          <>
            {iconList.map(iconClass => (
              <i
                key={`${iconClass}`}
                className={classnames(iconClass, icon_item)}
              />
            ))}
          </>
        );
      },
    },

    {
      title: "",
      key: "connectionId",
      width: 30,
      render: group => (
        <Button
          type="tiny_right"
          onClick={() => {
            let path = `${group_route}/${group.id}`;
            history.push(path);
          }}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        marginTop: "-10px",
        borderBottom: "1px solid var(--color-gray-pale",
      }}
    >
      <Table
        dataSource={groups}
        columns={columns}
        diableHead={true}
        pagination={false}
      />
    </div>
  );
}

function CreateNewGroup({ done, cancel, mutate }) {
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const onSubmit = async (data, event) => {
    let email = data.email.toLowerCase().trim();
    if (!validateEmail(email)) return;

    let variables = {
      input: {
        name: email,
        addMember: email,
      },
    };
    try {
      await mutate({
        variables,
        update: (proxy, { data: { groupPut } }) => {
          const data = proxy.readQuery({
            query: groupsGet,
          });

          proxy.writeQuery({
            query: groupsGet,
            data: {
              groupsGet: [...data.groupsGet, groupPut],
            },
          });
          done(groupPut);
        },
      });
      event.target.reset();
    } catch (error) {
      return console.log("error", error);
    }
  };

  return (
    <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder={"name@email.com"}
          autoComplete="off"
          ref={register({ required: true })}
          name="email"
        />
        <div
          style={{
            marginTop: "5px",
            textAlign: "right",
          }}
        >
          <Button type="input" value="OK" loading={isSubmitting} />
        </div>
      </div>
    </form>
  );
}

export function Share({ connection, user, history }) {
  const [showModal, setShowModal] = useState(false);
  const [showCreateNewGroup, setShowCreateNewGroup] = useState(false);
  const [showShareSettings, setShowShareSettings] = useState(null);

  const [mutate, { loading: loadingMutation }] = useMutation(groupPut);

  const { data, loading, error } = useQuery(groupsGet);
  let groups = (data || {}).groupsGet || [];

  let sharedWithGroups =
    groups.filter(g =>
      g.startups.some(s => s.connectionId === connection.id)
    ) || [];

  let notSharedWithGroups =
    groups.filter(
      g => !g.startups.some(s => s.connectionId === connection.id)
    ) || [];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: name => <span>{name}</span>,
    },
    {
      title: "",
      key: "add",
      width: 30,
      render: group => {
        return (
          <Button
            size="small"
            onClick={() => {
              setShowShareSettings(group);
            }}
          >
            add
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ paddingBottom: "15px" }}>
      {(!sharedWithGroups.length && (
        <div>
          <div style={{ fontSize: "18px" }}>Share this startup</div>
          <div
            style={{
              padding: "20px 0px",
              color: "var(--color-gray-medium)",
            }}
          >
            You can share this starup with your external network, regardless of
            them having a Notata account or not. You can choose what you would
            like to give access to. No emails will be sent automatically from
            Notata, so you can safely expermient and send the shared link when
            you are ready for it.
          </div>
        </div>
      )) || (
        <SharedWithGroupList
          connection={connection}
          groups={sharedWithGroups}
          mutate={mutate}
          history={history}
        />
      )}

      <div
        style={{
          marginTop: "15px",
          textAlign: "right",
        }}
      >
        <Button onClick={() => setShowModal(true)} type="just_text">
          Share
        </Button>
      </div>

      {showModal && (
        <Modal
          title="Share startup"
          close={() => {
            setShowModal(false);
            setShowShareSettings(null);
            setShowCreateNewGroup(false);
          }}
          disableFoot={true}
        >
          {!showShareSettings && (
            <div>
              {((!notSharedWithGroups.length || showCreateNewGroup) && (
                <>
                  <CreateNewGroup
                    mutate={mutate}
                    done={group => {
                      setShowShareSettings(group);
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
                      onClick={() => {
                        setShowCreateNewGroup(false);
                        setShowModal(false);
                      }}
                    >
                      cancel
                    </Button>
                  </div>
                </>
              )) || (
                <div style={{ padding: "10px 0px 0px 8px" }}>
                  <Table
                    dataSource={notSharedWithGroups}
                    columns={columns}
                    diableHead={true}
                    pagination={false}
                  />

                  <div
                    style={{
                      textAlign: "right",
                      paddingTop: "30px",
                      borderTop: "1px solid var(--color-gray-pale)",
                    }}
                  >
                    <Button
                      size="medium"
                      onClick={() => {
                        setShowCreateNewGroup(true);
                      }}
                    >
                      Share with new
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {showShareSettings && (
            <>
              <ShareSetting
                group={showShareSettings}
                connection={connection}
                mutate={mutate}
                done={() => {
                  setShowModal(false);
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
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
