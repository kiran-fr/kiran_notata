import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

import {
  userGet,
  groupGet,
  connectionsGet,
  evaluationTemplateNamesGet,
} from "Apollo/Queries";

import { groupPut } from "Apollo/Mutations";
import AddNewMember from "./AddMember";
import AddNewStartup from "./AddStartup";
import StartupList from "./StartupList";

import {
  group as group_route,
  evaluation_template_summary,
} from "pages/definitions";

import {
  BreadCrumbs,
  Content,
  Card,
  Table,
  Button,
  Modal,
  GhostLoader,
} from "Components/elements";

function SharedBy({ group }) {
  let admin = group.members.find(m => m.role === "admin");

  let columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: email => <span>{email}</span>,
    },
  ];

  return (
    <Table
      dataSource={[admin] || []}
      columns={columns}
      diableHead={true}
      pagination={false}
    />
  );
}

function MemberList({ group, user, isAdmin }) {
  const [isLoading, setIsLoading] = useState({});
  const [mutate] = useMutation(groupPut);

  let columns = [
    {
      title: "",
      dataIndex: "email",
      key: "delete",
      width: 20,
      className: "delete_bucket",
      render: email => {
        if (!isAdmin) return <span />;
        if (email === user.email) return <span />;

        if (isLoading[email]) {
          return <i className="fa fa-spinner fa-spin" />;
        }

        return (
          <i
            className="fal fa-trash-alt"
            onClick={() => {
              setIsLoading({ [email]: true });

              let variables = {
                id: group.id,
                input: { removeMember: email },
              };

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

                  setIsLoading({ [email]: false });
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

  if (!isAdmin) {
    columns.shift();
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

function AddNewTemplate({ group, isAdmin, mutate }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const { data } = useQuery(evaluationTemplateNamesGet);

  let templates = [];
  if (data) {
    templates = data.accountGet.evaluationTemplates;
  }

  templates = templates.filter(
    ({ id }) => !group.evaluationTemplates.some(t => t.id === id)
  );

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
      render: template => {
        return (
          <Button
            size="small"
            loading={isLoading === template.id}
            onClick={async () => {
              if (isLoading === template.id) return;
              setIsLoading(template.id);

              let variables = {
                id: group.id,
                input: { addTemplate: template.id },
              };
              try {
                await mutate({
                  variables,
                  refetchQueries: [
                    {
                      query: groupGet,
                      variables: { id: group.id },
                    },
                  ],
                });
                setShowModal(false);
              } catch (error) {
                console.log("error", error);
              }

              setIsLoading(null);
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
        type="just_text"
        //size="large"
      >
        Share evaluation template
      </Button>

      {showModal && (
        <Modal
          title="Share evaluation template"
          close={() => {
            setShowModal(false);
          }}
          disableFoot={true}
        >
          <div style={{ padding: "10px 0px 0px 8px" }}>
            <Table
              dataSource={templates}
              columns={columns}
              diableHead={true}
              pagination={false}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

const Templates = ({ templates, isAdmin, mutate, group, history }) => {
  const [isLoading, setIsLoading] = useState(null);

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
      render: template => {
        return (
          <Button
            size="small"
            type="right_arrow"
            onClick={() => {
              let path = `${evaluation_template_summary}/${template.id}`;
              history.push(path);
            }}
          >
            view
          </Button>
        );
      },
    },
  ];

  if (isAdmin) {
    let delCel = {
      title: "",
      dataIndex: "id",
      key: "delete",
      width: 20,
      className: "delete_bucket",
      render: id => {
        if (isLoading === id) {
          return <i className="fa fa-spinner fa-spin" />;
        }

        return (
          <i
            className="fal fa-trash-alt"
            onClick={async () => {
              setIsLoading(id);

              try {
                let variables = {
                  id: group.id,
                  input: { removeTemplate: id },
                };

                await mutate({
                  variables,
                  refetchQueries: [
                    {
                      query: groupGet,
                      variables: { id: group.id },
                    },
                  ],
                });
              } catch (error) {
                console.log("error", error);
              }

              setIsLoading(null);
            }}
          />
        );
      },
    };

    columns.unshift(delCel);
  }

  return (
    <Table
      dataSource={templates}
      columns={columns}
      diableHead={true}
      pagination={false}
    />
  );
};

export default function Group({ match, history }) {
  const id = match.params.id;

  const [mutate] = useMutation(groupPut);

  const [getData, groupQuery] = useLazyQuery(groupGet);
  const connectionsQuery = useQuery(connectionsGet);
  const userQuery = useQuery(userGet);

  useEffect(() => getData({ variables: { id } }), [getData, id]);

  const hasAllData = groupQuery.data && connectionsQuery.data && userQuery.data;

  const error = groupQuery.error || connectionsQuery.error || userQuery.error;

  const loading =
    groupQuery.loading || connectionsQuery.loading || userQuery.loading;

  if (error) {
    console.log("error", error);
    return <div>We're updaing...</div>;
  }

  if (!hasAllData && loading) {
    return <GhostLoader />;
  }

  const group = groupQuery.data.groupGet;
  const connections = connectionsQuery.data.connectionsGet;
  const user = userQuery.data.userGet;
  const settings = group.settings || {};

  // const isAdmin = group.createdBy === user.cognitoIdentityId;
  let isAdmin = group.members.some(
    ({ email, role }) => email === user.email && role === "admin"
  );

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "All Groups",
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

        {
          /* List ALL users to everyone */

          ((isAdmin || (!isAdmin && settings.showUsers)) && (
            <Card label="Members" style={{ paddingTop: "5px" }}>
              <MemberList
                group={group}
                mutate={mutate}
                isAdmin={isAdmin}
                user={user}
              />
            </Card>
            /* Show only who shared */
          )) || (
            <Card label="Shared by" style={{ paddingTop: "5px" }}>
              <SharedBy
                group={group}
                mutate={mutate}
                isAdmin={isAdmin}
                user={user}
              />
            </Card>
          )
        }

        {
          /* Invite member */
          (isAdmin || (!isAdmin && settings.showUsers && settings.addUser)) && (
            <AddNewMember group={group} mutate={mutate} />
          )
        }

        <Card label="Startups" style={{ paddingTop: "5px" }}>
          <StartupList
            connections={connections}
            group={group}
            mutate={mutate}
            history={history}
            user={user}
            isAdmin={isAdmin}
            settings={settings}
          />
        </Card>

        {
          /* Add new startup */
          (isAdmin || (!isAdmin && settings.addStartup)) && (
            <AddNewStartup
              connections={connections}
              group={group}
              mutate={mutate}
            />
          )
        }

        {group.evaluationTemplates && !!group.evaluationTemplates.length && (
          <Card label="Evaluation templates" style={{ paddingTop: "5px" }}>
            <Templates
              templates={group.evaluationTemplates}
              isAdmin={isAdmin}
              history={history}
              mutate={mutate}
              group={group}
            />
          </Card>
        )}

        {
          /* Add new startup */
          (isAdmin || (!isAdmin && settings.addStartup)) && (
            <AddNewTemplate
              isAdmin={isAdmin}
              // connections={connections}
              group={group}
              mutate={mutate}
            />
          )
        }

        {isAdmin && (
          <div
            style={{
              float: "right",
              fontWeight: "var(--font-weight-light)",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={() => {
              let path = `${group_route}/${group.id}/settings`;
              history.push(path);
            }}
          >
            <i className="fal fa-gear" /> settings
          </div>
        )}
      </Content>
    </>
  );
}
