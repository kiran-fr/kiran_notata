import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import moment from "moment";

// API
import { useQuery, useMutation } from "@apollo/client";
import { connectionsGet, tagGroupGet } from "Apollo/Queries";

import {
  connectionSetStar,
  connectionTagAdd,
  connectionTagRemove,
} from "Apollo/Mutations";

// COMPONENTS
import Filters from "../Filters";
import CreateNewStartup from "./CreateStartup";
import SetSubjectiveScore from "./SetSubjectiveScore";

import { startup_page } from "pages/definitions";

import { Table, Card, GhostLoader } from "Components/elements";

import TagSelector from "Components/TagSelector/TagSelector";

import {
  counter,
  small_text_flex,
  clear_filters,
} from "./Connections.module.css";

import tableColumns from "./TableColumns/TableColumns";

function applyFilters({ connections, filters }) {
  // Check if we have all the vals:
  filters = filters || {};
  filters.dateRange = filters.dateRange || [null, null];

  if (!filters) return connections;

  if (filters.starred) {
    connections = connections.filter(connection => {
      if (!connection) return false;
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

  if (filters.tags?.length) {
    connections = connections.filter(({ tags }) =>
      filters.tags.every(ft => tags.map(({ id }) => id).includes(ft.id))
    );
  }

  if (filters.funnelTags?.length) {
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

  if (filters.dateRange[0] || filters.dateRange[1]) {
    const [start, end] = [
      filters.dateRange[0] ? moment(filters.dateRange[0]).valueOf() : null,
      filters.dateRange[1] ? moment(filters.dateRange[1]).valueOf() : null,
    ];
    connections = connections.filter(
      connection =>
        (start ? start <= connection.updatedAt : true) &&
        (end ? end >= connection.updatedAt : true)
    );
  }

  return connections;
}

export const AddTagMutationOptions = (tag, connection) => ({
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

export const DeleteTagMutationOptions = (tag, connection) => ({
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

function Connections({ history, chartFilters }) {
  const [mutate] = useMutation(connectionTagAdd);
  const [mutateDelete] = useMutation(connectionTagRemove);
  const [showTagGroup, setShowTagGroup] = useState(undefined);
  const [showEvaluate, setShowEvaluate] = useState(undefined);

  const [filters, setFilterState] = useState({
    tags: [],
    funnelTags: [],
    search: "",
    starred: false,
    dateRange: [null, null],
  });
  // const [chartFilters, setChartFilters] = useState({ tags: [] });

  useEffect(() => {
    let f;
    try {
      f = JSON.parse(localStorage.getItem("filters"));
    } catch (error) {}
    if (f) setFilterState(f);
  }, []);

  function setFilters(filterData) {
    localStorage.setItem("filters", JSON.stringify(filterData));
    setFilterState(filterData);
  }

  const [setStar] = useMutation(connectionSetStar);

  const { data, loading, error } = useQuery(connectionsGet);

  const tagGroupsQuery = useQuery(tagGroupGet);
  const tagGroups =
    (tagGroupsQuery.data && tagGroupsQuery.data.accountGet.tagGroups) || [];

  const groupsTags = useMemo(
    () =>
      tagGroups.reduce(
        (groupsMap, props) =>
          groupsMap.set(
            props.id,
            props.tags.reduce(
              (map, props) =>
                map.set(props.id, {
                  id: props.id,
                  name: props.name,
                  value: 0,
                  selected: chartFilters.tags.some(({ id }) => id === props.id),
                }),
              new Map()
            )
          ),
        new Map()
      ),
    [tagGroups, chartFilters]
  );

  if (error || tagGroupsQuery.error) {
    throw error || tagGroupsQuery.error;
  }

  if (!data && loading) return <GhostLoader />;
  if (!tagGroupsQuery.data && tagGroupsQuery.loading) return <GhostLoader />;

  let connections = data.connectionsGet;
  let connectionsGeneral = [];

  if (connections.length >= 10) {
    connectionsGeneral = applyFilters({ connections, filters });
    // Apply filters from charts, affecting selection in table but not in charts themselves
    connections = applyFilters({
      connections: connectionsGeneral,
      filters: chartFilters,
    });
  } else {
    connectionsGeneral.concat(connections);
  }

  let showTagsForConnection;
  if (showTagGroup) {
    showTagsForConnection =
      (connections || []).find(({ id }) => id === showTagGroup) || {};
  }

  let showEvaluateForConnection;
  if (showEvaluate) {
    showEvaluateForConnection =
      (connections || []).find(({ id }) => id === showEvaluate) || {};
  }

  const columns = tableColumns({
    history,
    setStar,
    setShowTagGroup,
    setShowEvaluate,
  });

  function addTag(tag, connection) {
    mutate(AddTagMutationOptions(tag, connection));
  }

  function deleteTag(tag, connection) {
    mutateDelete(DeleteTagMutationOptions(tag, connection));
  }

  let hasFilters =
    filters.tags.length ||
    filters.funnelTags.length ||
    filters.search ||
    filters.starred ||
    (filters.dateRange.length &&
      (filters.dateRange[0] || filters.dateRange[1]));

  return (
    <>
      <CreateNewStartup
        history={history}
        setDone={connection => {
          history.push(`${startup_page}/${connection.id}`, { rightMenu: true });
        }}
        setShowTagGroup={setShowTagGroup}
        setShowEvaluate={setShowEvaluate}
        showModalOnly={false}
      />
      <div className={small_text_flex}>
        {(hasFilters && (
          <div
            className={clear_filters}
            onClick={() => {
              setFilters({
                search: "",
                tags: [],
                funnelTags: [],
                dateRange: [null, null],
              });
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
          fullFilter={true}
        />
      )}

      <Card maxWidth={1200} noMargin={true}>
        <Table
          dataSource={connections || []}
          columns={columns}
          disableHead={false}
          pagination={false}
          allowSorting={true}
          loading={loading}
          emptyLabel={"No results."}
        />

        {showTagGroup && (
          <TagSelector
            title={showTagsForConnection?.creative?.name}
            show={showTagsForConnection}
            tagGroups={tagGroups}
            checkedTags={showTagsForConnection?.tags}
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
          <SetSubjectiveScore
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

const mapStateToProps = state => ({
  chartFilters: state.connections.chartFilters,
});

export default connect(mapStateToProps)(Connections);
