import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import {
  userGet,
  groupGet,
  connectionsGet,
  evaluationTemplateNamesGet,
} from "../../../Apollo/Queries";

import { groupPut, connectionPut } from "../../../Apollo/Mutations";
import {
  group as group_route,
  startup_page,
  evaluation_template_summary,
} from "../../definitions";

import validateEmail from "../../../utils/validateEmail";

import {
  share_title,
  share_description,
  icon_item,
  shared_by_item,
  shared_by_list,
  button_class,
  action_link,
  add_all_container,
  add_all_description,
} from "./Group.module.css";

import classnames from "classnames";

import {
  BreadCrumbs,
  Content,
  Card,
  Table,
  Button,
  Modal,
  GhostLoader,
} from "../../../Components/elements";

function AddNewMember({ group, mutate }) {
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  const emailForm = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
      })
    ),
  });

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
      await mutate({ variables });
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
              onSubmit={emailForm.handleSubmit(onSubmitInvite)}
            >
              <div style={{ marginTop: "30px" }}>
                <input
                  type="text"
                  placeholder={"name@email.com"}
                  autoComplete="off"
                  ref={emailForm.register()}
                  name="email"
                />
                {emailForm.errors && emailForm.errors.email && (
                  <p style={{ color: "red" }}>must be a valid email address</p>
                )}
                <div
                  style={{
                    marginTop: "5px",
                    textAlign: "right",
                  }}
                >
                  <Button
                    type="input"
                    value="OK"
                    loading={emailForm.formState.isSubmitting}
                  />
                </div>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}

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
      disableHead={true}
      pagination={false}
    />
  );
}

function MemberList({ group, user, isAdmin }) {
  const [isLoading, setIsLoading] = useState({});
  const [mutate, { loading }] = useMutation(groupPut);

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
      disableHead={true}
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
          creativeId: connection.creativeId,
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
          <label>
            <input
              type="checkbox"
              ref={register}
              defaultChecked={true}
              name="evaluations"
              id="evaluations"
            />
            evaluations
          </label>
        </div>

        <div className="check_container">
          <label>
            <input
              type="checkbox"
              ref={register}
              defaultChecked={true}
              name="subjective_score"
              id="subjective_score"
            />
            subjective score
          </label>
        </div>

        <div className="check_container">
          <label>
            <input
              type="checkbox"
              ref={register}
              defaultChecked={true}
              name="tags"
              id="tags"
            />
            tags
          </label>
        </div>

        <div className="check_container">
          <label>
            <input
              type="checkbox"
              ref={register}
              defaultChecked={true}
              name="comments"
              id="comments"
            />
            comments
          </label>
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
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
    >
      <Button
        onClick={() => setShowModal(true)}
        type="right_arrow"
        size="large"
      >
        Add startup
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
                  disableHead={true}
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

function AddNewTemplate({ group, isAdmin, mutate }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const { data, error, loading } = useQuery(evaluationTemplateNamesGet);

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
              disableHead={true}
              pagination={false}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

function StartupList({ group, connections, settings, user, isAdmin, history }) {
  const [isLoadingAddAll, setIsLoadingAddAll] = useState(false);
  const [isLoadingDownload, setIsLoadingDownload] = useState({});
  const [showShareSettings, setShowShareSettings] = useState(null);
  const [mutate, { loading }] = useMutation(groupPut);

  const [
    connectionPutMutate,
    { error: connectionPutError, loading: connectionPutLoading },
  ] = useMutation(connectionPut);

  let allCreatives = [];
  let uniqueCreatives = {};

  let ss = {};
  for (let startup of group.startups) {
    ss[startup.creativeId] = ss[startup.creativeId] || [];
    ss[startup.creativeId].push(startup);
  }

  let list = [];
  for (let creativeId in ss) {
    if (ss[creativeId] && ss[creativeId][0] && ss[creativeId][0].connection) {
      list.push({
        creative: ss[creativeId][0].connection.creative,
        startups: ss[creativeId],
      });
    }
  }

  function getAddAllStatus() {
    let saveAndShare = 0;
    let share = 0;

    for (let g of list) {
      let { creative, startups } = g;

      let my_startups = haveShared({ startups });

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

                //let subjectiveScores = connection.subjectiveScores || [];

                //let otherScores = [];
                //for (let shared of (connection.sharedWithMe || [])) {
                //  let arr = shared.connection.subjectiveScores || []
                //  arr = arr.map(it => (
                //    {
                //      ...it,
                //      ref: {
                //        name: shared.groupName,
                //        id: shared.groupId
                //      }
                //    }
                //  ))
                //  otherScores = otherScores.concat(arr);
                //}

                //let allScores = subjectiveScores.concat(otherScores);

                //  let hit = (connection.subjectiveScores || [])
                //    .find(({createdByUser: { email }}) => {
                //      return email === sharedBy
                //     })

                // console.log('hit', hit)

                // let score = hit ? hit.score : undefined;

                //  if (
                //    connection.subjectiveScores &&
                //    connection.subjectiveScores.length
                //    ) {
                //    score = connection.subjectiveScores[0].score
                //  }

                let avg;
                if (
                  connection.subjectiveScores &&
                  connection.subjectiveScores.length
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
                    {
                      // score && (
                      //   <span>
                      //     {" "}
                      //     ({score})
                      //   </span>
                      // )
                    }
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
      disableHead={true}
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
