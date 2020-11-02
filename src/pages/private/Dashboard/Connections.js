import React, { useState, useEffect } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";

// API
import { useQuery, useMutation } from "@apollo/client";
import {
  connectionsGet,
  connectionGet,
  tagGroupGet,
  funnelGroupGet,
  evaluationTemplateNamesGet,
} from "../../../Apollo/Queries";

import {
  connectionSetStar,
  connectionTagAdd,
  connectionTagRemove,
  connectionPut,
  creativePut,
  evaluationPut,
} from "../../../Apollo/Mutations";

// COMPONENTS
import Filters from "./Filters";

import { startup_page } from "../../definitions";

import {
  Modal,
  Button,
  Table,
  Card,
  Tag,
  GhostLoader,
} from "Components/elements";

import TagSelector from "../../../Components/TagSelector/TagSelector";

import {
  list_star,
  average_score,
  date_style,
  void_list,
  void_list_label,
  void_list_icon,
  pre_space,
  max_width_200,
  funnel_tag,
  counter,
  small_text_flex,
  clear_filters,
  shortcuts_list,
  shortcuts_list_footer,
  spinner_class,
} from "./Connections.module.css";

function applyFilters({ connections, filters }) {
  // Check if we have all the vals:
  filters = filters || {};
  filters.tags = filters.tags || [];
  filters.funnelTags = filters.funnelTags || [];

  if (!filters) {
    return connections;
  }

  if (filters.starred) {
    connections = connections.filter(connection => {
      if (!connection) return;
      return connection.starred;
    });
  }

  if (filters.search && filters.search.length !== 0) {
    let firstTwo = filters.search.slice(0, 2);

    if (firstTwo === ":f") {
      let [, funnelName] = filters.search.split(" ");

      if (!funnelName) {
        connections = connections.filter(({ funnelTags }) => funnelTags.length);
      }

      if (funnelName) {
        connections = connections.filter(({ funnelTags }) => {
          let containsTag = funnelTags.find(({ name }) =>
            name.toLowerCase().includes((funnelName || "").toLowerCase())
          );

          if (!containsTag) return false;

          if (containsTag) {
            let highest = funnelTags.reduce(
              (max, tag) => (tag.index > max ? tag.index : max),
              funnelTags[0].index
            );
            return containsTag.index >= highest;
          }
          return false;
        });
      }
    }

    if (firstTwo === ":t") {
      let [, tagName] = filters.search.split(" ");
      connections = connections.filter(({ tags }) =>
        tags.some(({ name }) =>
          name.toLowerCase().includes((tagName || "").toLowerCase())
        )
      );
    }

    if (firstTwo !== ":f" && firstTwo !== ":t") {
      let search = filters.search.toLowerCase();
      connections = connections.filter(({ creative }) =>
        creative.name.toLowerCase().includes(search)
      );
    }
    let search = filters.search.toLowerCase();
    connections = connections.filter(({ creative }) =>
      creative.name.toLowerCase().includes(search)
    );
  }

  if (filters.tags.length) {
    connections = connections.filter(({ tags }) =>
      filters.tags.every(ft => tags.map(({ id }) => id).includes(ft.id))
    );
  }

  if (filters.funnelTags.length) {
    connections = connections.filter(({ funnelTags }) => {
      if (!funnelTags.length) return false;

      let highest = funnelTags.reduce(
        (max, tag) => (tag.index > max ? tag.index : max),
        funnelTags[0].index
      );
      let tag = funnelTags.find(({ index }) => index === highest);

      return filters.funnelTags.some(({ id }) => id === tag.id);
    });
  }

  return connections;
}

const EvaluateSelector = ({ connection, close, history }) => {
  const [currentLoading, setCurrentLoading] = useState("");
  // const [showModal, setShowModal] = useState(false);

  let { data, error, loading } = useQuery(evaluationTemplateNamesGet);
  const [mutate, { loading: mutateLoading }] = useMutation(evaluationPut);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: name => <span>{name}</span>,
    },
    {
      title: "",
      key: "use",
      width: 30,
      render: ({ id: templateId, name, description }) => {
        return (
          <Button
            size="small"
            onClick={async () => {
              setCurrentLoading(templateId);
              try {
                let res = await mutate({
                  variables: {
                    connectionId: connection.id,
                    input: { templateId, name, description },
                  },
                });
                let evaluation = res.data.evaluationPut;
                let template = data.accountGet.evaluationTemplates.find(
                  ({ id }) => id === evaluation.templateId
                );
                let path = `${startup_page}/${connection.id}/evaluation/${evaluation.id}/section/${template.sections[0].id}`;
                history.push(path);
              } catch (error) {
                console.log("error", error);
              }
              setCurrentLoading("");
            }}
            loading={mutateLoading && currentLoading === templateId}
          >
            use
          </Button>
        );
      },
    },
  ];

  return (
    <Modal title="Evaluate startup" close={close}>
      {(!data && (
        <div className={spinner_class}>
          <i className="fa fa-spinner fa-spin" />
        </div>
      )) || (
        <div style={{ padding: "10px 0px 0px 8px" }}>
          <Table
            dataSource={data.accountGet.evaluationTemplates}
            columns={columns}
            diableHead={true}
            pagination={false}
          />
        </div>
      )}
    </Modal>
  );
};

const CreateNewStartup = ({
  setDone,
  history,
  setShowTagGroup,
  setShowEvaluate,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showConnection, setShowConnection] = useState();

  const [mutateCreative] = useMutation(creativePut);
  const [mutateConnection] = useMutation(connectionPut, {
    refetchQueries: [{ query: connectionsGet }],
  });

  const { register, handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  let id;

  const onSubmit = async (data, event) => {
    try {
      const {
        data: {
          creativePut: { id: creativeId },
        },
      } = await mutateCreative(data);
      const res = await mutateConnection({ variables: { creativeId } });
      const {
        data: { connectionPut: connection },
      } = res;
      setShowConnection(connection.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          marginBottom: "10px",
          top: "-20px",
        }}
      >
        <Button
          onClick={() => setShowModal(true)}
          type="right_arrow"
          size="large"
        >
          ADD NEW STARTUP
        </Button>
      </div>

      {showModal && (
        <Modal
          title="Add startup"
          close={() => setShowModal(false)}
          disableFoot={true}
        >
          {!showConnection && (
            <form className="notata_form" onSubmit={handleSubmit(onSubmit)}>
              <div style={{ marginTop: "30px" }}>
                <input
                  type="text"
                  placeholder={`I.e. "Money Press Inc."`}
                  autoComplete="off"
                  ref={register({ required: true })}
                  name="variables.input.name"
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

          {showConnection && (
            <div>
              <ul className={shortcuts_list}>
                <li
                  onClick={() => {
                    setShowTagGroup(showConnection);
                    setShowConnection();
                    setShowModal(false);
                  }}
                >
                  Add tags
                </li>

                <li
                  onClick={() => {
                    setShowEvaluate(showConnection);
                    setShowConnection();
                    setShowModal(false);
                  }}
                >
                  Evaluate
                </li>
              </ul>

              <div className={shortcuts_list_footer}>
                <span />

                <Button
                  type="right_arrow"
                  size="medium"
                  onClick={() => {
                    history.push(`${startup_page}/${showConnection}`);
                  }}
                >
                  View startup
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default function Connections({ history }) {
  const [mutate] = useMutation(connectionTagAdd);
  const [mutateDelete] = useMutation(connectionTagRemove);
  const [showTagGroup, setShowTagGroup] = useState(undefined);
  const [showEvaluate, setShowEvaluate] = useState(undefined);

  const [filters, setFilterState] = useState();

  useEffect(() => {
    let f;
    try {
      f = JSON.parse(localStorage.getItem("filters"));
      setFilterState(f);
    } catch (error) {}
  }, filters);

  function setFilters(filterData) {
    localStorage.setItem("filters", JSON.stringify(filterData));
    setFilterState(filterData);
  }

  const [setStar] = useMutation(connectionSetStar);

  const connectionsQuery = useQuery(connectionsGet);
  const { data, loading, error } = connectionsQuery;

  const tagGroupsQuery = useQuery(tagGroupGet);
  const tagGroups =
    (tagGroupsQuery.data && tagGroupsQuery.data.accountGet.tagGroups) || [];

  if (error) console.log("error", error);
  if (error || tagGroupsQuery.error) return <div>We are updating </div>;
  if (!data && loading) return <GhostLoader />;
  if (!tagGroupsQuery.data && tagGroupsQuery.loading) return <GhostLoader />;

  let connections = data.connectionsGet;

  if (connections.length >= 10) {
    connections = applyFilters({ connections, filters });
  }

  let showTagsForConnection;
  if (showTagGroup) {
    showTagsForConnection = (connections || []).find(
      ({ id }) => id === showTagGroup
    );
  }

  let showEvaluateForConnection;
  if (showEvaluate) {
    showEvaluateForConnection = (connections || []).find(
      ({ id }) => id === showEvaluate
    );
  }

  const columns = [
    {
      title: "",
      key: "starred",
      width: 20,
      className: list_star,
      render: connection => {
        const { starred, id } = connection;
        return (
          <div
            onClick={() => {
              setStar({
                variables: { id },
                optimisticResponse: {
                  __typename: "Mutation",
                  connectionSetStar: {
                    ...connection,
                    starred: !starred,
                  },
                },
              });
            }}
          >
            {(!starred && <i className="fal fa-star" />) || (
              <i
                className="fas fa-star"
                style={{ color: "var(--color-orange)" }}
              />
            )}
          </div>
        );
      },
    },

    {
      title: "Company name",
      key: "creative",
      className: max_width_200,
      render: connection => {
        let _style = {
          cursor: "pointer",
        };

        if (connection.starred) {
          _style.fontWeight = "var(--font-weight-bold)";
        }

        return (
          <span
            style={_style}
            onClick={() => {
              history.push(`${startup_page}/${connection.id}`);
            }}
          >
            {connection.creative.name}
          </span>
        );
      },
    },

    {
      title: "Funnels",
      dataIndex: "funnelTags",
      key: "tags",
      responsive: "sm",
      render: funnelTags => {
        if (!funnelTags.length) {
          return <span style={{ color: "#DADEE2" }}>n/a</span>;
        }
        let highest = funnelTags.reduce(
          (max, tag) => (tag.index > max ? tag.index : max),
          funnelTags[0].index
        );
        let tag = funnelTags.find(({ index }) => index === highest);
        return <Tag className={funnel_tag}>{tag.name}</Tag>;
      },
    },

    {
      title: "Tags",
      // dataIndex: "tags",
      key: "tags",
      responsive: "md",
      render: connection => (
        <span>
          <span
            style={{
              color: "var(--color-primary)",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowTagGroup(connection.id);
            }}
          >
            <i className="fal fa-tag" />
          </span>

          {(connection.tags || []).slice(0, 3).map(({ name, id }) => (
            <Tag key={id}>{name}</Tag>
          ))}
        </span>
      ),
    },

    {
      title: "Subjective score",
      // dataIndex: "subjectiveScores",
      key: "subjectiveScores",
      responsive: "sm",
      render: connection => {
        let scores = connection.subjectiveScores;

        let avg;
        if (scores && scores.length) {
          let { score: ttl } = scores.reduce((a, b) => ({
            score: a.score + b.score,
          }));
          avg = (ttl / scores.length).toFixed(1);
        }

        return (
          <div
            onClick={() => {
              setShowEvaluate(connection.id);
            }}
          >
            {avg && (
              <div className={average_score}>
                <span>{avg}</span>
              </div>
            )}

            {!avg && <span style={{ color: "#DADEE2" }}>n/a</span>}
          </div>
        );
      },
    },

    {
      title: "Last updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      responsive: "lg",
      className: pre_space,
      render: date => (
        <span className={date_style}>{moment(date).format("ll")}</span>
      ),
    },

    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: 30,
      render: id => (
        <Button
          type="right_arrow"
          size="small"
          onClick={() => {
            history.push(`${startup_page}/${id}`);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  function addTag(tag, connection) {
    mutate({
      variables: {
        connectionId: connection.id,
        tagId: tag.id,
      },

      optimisticResponse: {
        __typename: "Mutation",
        connectionTagAdd: {
          tags: [
            ...connection.tags,
            {
              createdAt: new Date().getTime(),
              index: connection.tags.length,
              createdBy: "tmp",
              id: "tmp-id",
              description: null,
              name: tag.name,
              tagGroupId: tag.tagGroupId,
              __typename: "Tag",
            },
          ],
          __typename: "Connection",
        },
      },

      update: (proxy, { data: { connectionTagAdd } }) => {
        const data = proxy.readQuery({
          query: connectionsGet,
        });

        proxy.writeQuery({
          query: connectionsGet,
          data: {
            connectionsGet: data.connectionsGet.map(c => {
              if (c.id !== connection.id) {
                return c;
              }

              return {
                ...c,
                tags: connectionTagAdd.tags,
              };
            }),
          },
        });
      },
    });
  }

  function deleteTag(tag, connection) {
    mutateDelete({
      variables: {
        connectionId: connection.id,
        tagId: tag.id,
      },

      optimisticResponse: {
        __typename: "Mutation",
        connectionTagRemove: {
          tags: [
            ...connection.tags
              .filter(({ id }) => id !== tag.id)
              .map(t => ({
                ...t,
                index: null,
                description: null,
                createdBy: "tmp",
                createdAt: 0,
              })),
          ],
          __typename: "Connection",
        },
      },

      update: (proxy, { data: { connectionTagRemove } }) => {
        const data = proxy.readQuery({
          query: connectionsGet,
        });

        proxy.writeQuery({
          query: connectionsGet,
          data: {
            connectionsGet: data.connectionsGet.map(c => {
              if (c.id !== connection.id) {
                return c;
              }

              return {
                ...c,
                tags: connectionTagRemove.tags,
              };
            }),
          },
        });
      },
    });
  }

  const defaultFilters = {
    tags: [],
    funnelTags: [],
    search: "",
    starred: false,
  };

  const f = filters || defaultFilters;

  let hasFilters =
    f.tags.length || f.funnelTags.length || f.search || f.starred;

  return (
    <>
      <CreateNewStartup
        history={history}
        setDone={connection => {
          console.log("connection...", connection);
          history.push(`${startup_page}/${connection.id}`);
        }}
        setShowTagGroup={setShowTagGroup}
        setShowEvaluate={setShowEvaluate}
      />

      <div className={small_text_flex}>
        {(hasFilters && (
          <div
            className={clear_filters}
            onClick={() => {
              setFilters({ search: "", tags: [], funnelTags: [] });
            }}
          >
            clear all filters
          </div>
        )) || <div />}

        <div className={counter}>Showing {connections.length} results</div>
      </div>

      {data.connectionsGet.length >= 10 && (
        <Filters
          setFilters={setFilters}
          filters={filters}
          tagGroups={tagGroups}
        />
      )}

      <Card maxWidth={1200} style={{ paddingTop: "5px" }}>
        {!connections.length && (
          <div className={void_list}>
            <div className={void_list_label}>No results to show</div>
            <div className={void_list_icon}>
              <i className="fal fa-ghost" />
            </div>
          </div>
        )}

        <Table
          dataSource={connections || []}
          columns={columns}
          diableHead={true}
          pagination={false}
          loading={loading}
        />

        {showTagGroup && (
          <TagSelector
            title={showTagsForConnection.creative.name}
            show={showTagsForConnection}
            tagGroups={tagGroups}
            checkedTags={showTagsForConnection.tags}
            addTag={tag => {
              addTag(tag, showTagsForConnection);
            }}
            deleteTag={tag => {
              deleteTag(tag, showTagsForConnection);
            }}
            close={() => {
              setShowTagGroup(null);
            }}
          />
        )}

        {showEvaluate && (
          <EvaluateSelector
            connection={showEvaluateForConnection}
            history={history}
            close={() => {
              setShowEvaluate(null);
            }}
          />
        )}
      </Card>
    </>
  );
}
