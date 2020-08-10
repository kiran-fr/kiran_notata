import React, { useState, useEffect } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import { userGet, groupGet, connectionsGet } from "../../../Apollo/Queries";
import { groupPut } from "../../../Apollo/Mutations";
import { group as group_route } from "../../../routes";

import validateEmail from "../../../utils/validateEmail";

import { share_title, share_description, icon_item } from "./Group.module.css";
import classnames from "classnames";

import {
  BreadCrumbs,
  Content,
  Card,
  Table,
  Button,
  Modal,
} from "../../elements/";

function AddNewMember({ group, mutate }) {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const [changeGroupName, setChangeGroupName] = useState(
    group.members.some(m => m.email === group.name)
  );

  const onSubmitInvite = async (data, event) => {
    let email = data.email.toLowerCase().trim();
    if (!validateEmail(email)) return;

    let variables = {
      id: group.id,
      input: { addMember: email },
    };
    try {
      await mutate({
        variables,
        update: (proxy, { data: { groupPut } }) => {
          const data = proxy.readQuery({
            query: groupGet,
            variables: { id: group.id },
          });

          proxy.writeQuery({
            query: groupGet,
            variables: { id: group.id },
            data: {
              groupGet: {
                ...data.groupGet,
                members: [...data.groupGet.members, groupPut],
              },
            },
          });
        },
      });
      event.target.reset();
      setShowModal(false);
    } catch (error) {
      return console.log("error", error);
    }
  };

  const onSubmitGroupName = async (data, event) => {
    let variables = {
      id: group.id,
      input: { name: data.name },
    };

    try {
      await mutate({
        variables,
        update: (proxy, { data: { groupPut } }) => {
          const data = proxy.readQuery({
            query: groupGet,
            variables: { id: group.id },
          });

          proxy.writeQuery({
            query: groupGet,
            variables: { id: group.id },
            data: {
              groupGet: {
                ...data.groupGet,
                ...data.groupPut,
              },
            },
          });
        },
      });
      event.target.reset();
      setChangeGroupName(null);
    } catch (error) {
      return console.log("error", error);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        top: "-40px",
      }}
    >
      <Button
        onClick={() => setShowModal(true)}
        type="right_arrow"
        size="large"
      >
        Invite new member
      </Button>

      {showModal && (
        <Modal
          title="Invite new member"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          {changeGroupName && (
            <div>
              <div>
                Before adding a new member to this group we should change the
                group name, as all members will be able to see it.
              </div>
              <form
                className="notata_form"
                onSubmit={handleSubmit(onSubmitGroupName)}
              >
                <div style={{ marginTop: "30px" }}>
                  <input
                    type="text"
                    placeholder={"Group name"}
                    autoComplete="off"
                    ref={register({ required: true })}
                    name="name"
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
            </div>
          )}

          {!changeGroupName && (
            <form
              className="notata_form"
              onSubmit={handleSubmit(onSubmitInvite)}
            >
              <div style={{ marginTop: "30px" }}>
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
          )}
        </Modal>
      )}
    </div>
  );
}

function MemberList({ group, user, mutate, isOwner }) {
  let columns = [
    {
      title: "",
      dataIndex: "email",
      key: "delete",
      width: 20,
      className: "delete_bucket",
      render: email => {
        if (!isOwner) return <span />;
        if (email === user.email) return <span />;

        return (
          <i
            className="fal fa-trash-alt"
            onClick={() => {
              let variables = {
                id: group.id,
                input: { removeMember: email },
              };
              console.log("variables", variables);
              mutate({
                variables,
                update: (proxy, { data: { groupPut } }) => {
                  const data = proxy.readQuery({
                    query: groupGet,
                    variables: { id: group.id },
                  });

                  proxy.writeQuery({
                    query: groupGet,
                    variables: { id: group.id },
                    data: {
                      groupGet: {
                        ...data.groupGet,
                        members: data.groupGet.members.filter(
                          m => m.email !== email
                        ),
                      },
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: email => <span>{email}</span>,
    },
  ];

  if (isOwner) {
    columns.unshift();
  }

  return (
    <Table
      dataSource={group.members || []}
      columns={columns}
      diableHead={true}
      pagination={false}
    />
  );
}

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
            query: groupGet,
            variables: { id: group.id },
          });

          proxy.writeQuery({
            query: groupGet,
            variables: { id: group.id },
            data: {
              groupGet: {
                ...data.groupGet,
                startups: [...data.groupGet.startups, groupPut],
              },
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
      <div className={share_title}>{connection.creative.name}</div>

      <div className={share_description}>
        In addition to the facts part of the startup, what else would you like
        to share with this group?
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="notata_form">
        <div className="check_container">
          <input
            type="checkbox"
            ref={register}
            name="evaluations"
            id="evaluations"
          />
          <label>evaluations</label>
        </div>

        <div className="check_container">
          <input
            type="checkbox"
            ref={register}
            name="subjective_score"
            id="subjective_score"
          />
          <label>subjective score</label>
        </div>

        <div className="check_container">
          <input type="checkbox" ref={register} name="tags" id="tags" />
          <label>tags</label>
        </div>

        <div className="check_container">
          <input type="checkbox" ref={register} name="comments" id="comments" />
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

function AddNewStartup({ group, connections, mutate }) {
  const [showModal, setShowModal] = useState(false);
  const [showShareSettings, setShowShareSettings] = useState(null);

  let [filter, setFilter] = useState("");

  connections = connections.filter(
    c => !(group.startups || []).some(gs => gs.connectionId === c.id)
  );

  if (filter !== "") {
    connections = connections.filter(c =>
      c.creative.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (connections.length > 10) connections.length = 10;

  const columns = [
    {
      title: "Name",
      dataIndex: "creative",
      key: "name",
      render: creative => <span>{(creative || {}).name}</span>,
    },
    {
      title: "",
      key: "add",
      width: 30,
      render: connection => {
        return (
          <Button
            size="small"
            onClick={() => {
              setShowShareSettings(connection);
            }}
          >
            add
          </Button>
        );
      },
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        top: "-40px",
      }}
    >
      <Button
        onClick={() => setShowModal(true)}
        type="right_arrow"
        size="large"
      >
        Add new startup
      </Button>

      {showModal && (
        <Modal
          title="Add new startup"
          close={() => {
            setShowModal(false);
            setShowShareSettings(null);
          }}
          disableFoot={true}
        >
          {!showShareSettings && (
            <>
              <form className="notata_form" onSubmit={e => e.preventDefault()}>
                <div style={{ marginTop: "30px" }}>
                  <input
                    type="text"
                    placeholder="search..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                  />
                </div>
              </form>

              <div style={{ padding: "10px 0px 0px 8px" }}>
                <Table
                  dataSource={connections}
                  columns={columns}
                  diableHead={true}
                  pagination={false}
                />
              </div>
            </>
          )}

          {showShareSettings && (
            <>
              <ShareSetting
                group={group}
                connection={showShareSettings}
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

function StartupList({ group, user, mutate, history }) {
  const columns = [
    {
      title: "",
      key: "delete",
      width: 20,
      className: "delete_bucket",
      render: startup => {
        let connection = startup.connection || {};
        if (connection.createdBy !== user.cognitoIdentityId) return <span />;

        return (
          <i
            className="fal fa-trash-alt"
            onClick={() => {
              let variables = {
                id: group.id,
                input: { removeStartup: connection.id },
              };

              console.log("variables", variables);

              mutate({
                variables,
                update: (proxy, { data: { groupPut } }) => {
                  const data = proxy.readQuery({
                    query: groupGet,
                    variables: { id: group.id },
                  });

                  proxy.writeQuery({
                    query: groupGet,
                    variables: { id: group.id },
                    data: {
                      groupGet: {
                        ...data.groupGet,
                        startups: data.groupGet.startups.filter(
                          s => s.connectionId !== connection.id
                        ),
                      },
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
        let connection = group.connection || {};
        let creative = connection.creative || {};
        let { sharedBy, createdAt } = group;

        return (
          <span>
            <div>{creative.name}</div>
            <div style={{ opacity: 0.5, fontSize: "12px" }}>
              {sharedBy} - {moment(createdAt).format("ll")}
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
        if (group.comments) iconList.push("fas fa-comment");
        if (group.tags) iconList.push("fas fa-tags");
        if (group.subjective_score) iconList.push("fas fa-brain");
        if (group.evaluations) iconList.push("fas fa-clipboard-list-check");

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
      dataIndex: "connection",
      key: "connection",
      width: 30,
      render: connection => (
        <Button
          type="tiny_right"
          onClick={() => {
            let path = `${group_route}/${group.id}/${connection.id}`;
            history.push(path);
          }}
        />
      ),
    },
  ];

  return (
    <Table
      dataSource={group.startups || []}
      columns={columns}
      diableHead={true}
      pagination={false}
    />
  );
}

export default function Group({ match, history }) {
  const id = match.params.id;

  const [mutate] = useMutation(groupPut);

  const [getData, { data, loading, error }] = useLazyQuery(groupGet);
  useEffect(() => getData({ variables: { id } }), []);
  let group = (data || {}).groupGet || {};

  const connectionsQuery = useQuery(connectionsGet);
  let connections = (connectionsQuery.data || {}).connectionsGet || [];

  const userQuery = useQuery(userGet);
  let user = (userQuery.data || {}).userGet || {};

  const isOwner = group.createdBy === user.cognitoIdentityId;

  if (error) console.log("error", error);

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
        ]}
      />

      <Content maxWidth={600}>
        <div style={{ marginBottom: "50px" }}>
          <h1>{group.name}</h1>
        </div>

        <Card label="Members" style={{ paddingTop: "5px" }}>
          <MemberList
            group={group}
            mutate={mutate}
            isOwner={isOwner}
            user={user}
          />
        </Card>

        {isOwner && <AddNewMember group={group} mutate={mutate} />}

        <Card label="Startups" style={{ paddingTop: "5px" }}>
          <StartupList
            group={group}
            mutate={mutate}
            history={history}
            user={user}
          />
        </Card>

        <AddNewStartup
          connections={connections}
          group={group}
          mutate={mutate}
        />
      </Content>
    </>
  );
}
