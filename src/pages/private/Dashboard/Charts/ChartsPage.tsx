import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import moment from "moment";

// API
import { useQuery } from "@apollo/client";
import { connectionsGet, tagGroupGet } from "Apollo/Queries";

// COMPONENTS
import Filters from "../Filters";

import { Content, Table, Card, GhostLoader } from "Components/elements";
import { History } from "history";

import styles from "../Connections/Connections.module.css";

import tableColumns from "./TableColumns/TableColumns";
import ChartArea from "./ChartArea";
import { Connection } from "../Connections/types";

function applyFilters({
  connections,
  filters,
}: {
  connections: Connection[];
  filters: any;
}) {
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
      filters.tags.every((ft: any) => tags.map(({ id }) => id).includes(ft.id))
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

      return filters.funnelTags.some(({ id }: any) => id === tag?.id);
    });
  }

  if (filters.dateRange[0] || filters.dateRange[1]) {
    const [start, end] = [
      filters.dateRange[0] ? moment(filters.dateRange[0]).valueOf() : null,
      filters.dateRange[1] ? moment(filters.dateRange[1]).valueOf() : null,
    ];
    connections = connections.filter(
      connection =>
        (start ? start <= connection.updatedAt.valueOf() : true) &&
        (end ? end >= connection.updatedAt.valueOf() : true)
    );
  }

  return connections;
}

function Connections({
  history,
  chartFilters,
}: {
  history: History;
  chartFilters: { tags: any[] };
}) {
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
      f = JSON.parse(localStorage.getItem("filters") || "");
      setFilterState(f);
    } catch (error) {}
  }, []);

  function setFilters(filterData: any) {
    localStorage.setItem("filters", JSON.stringify(filterData));
    setFilterState(filterData);
  }

  const { data, loading, error } = useQuery(connectionsGet);

  const tagGroupsQuery = useQuery(tagGroupGet);
  const tagGroups =
    (tagGroupsQuery.data && tagGroupsQuery.data.accountGet.tagGroups) || [];

  const groupsTags = useMemo(
    () =>
      tagGroups.reduce(
        (groupsMap: Map<any, any>, props: any) =>
          groupsMap.set(
            props.id,
            props.tags.reduce(
              (map: Map<any, any>, props: any) =>
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
  let connectionsGeneral: any[] = [];

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

  const columns = tableColumns({ history });

  let hasFilters =
    filters.tags.length ||
    filters.funnelTags.length ||
    filters.search ||
    filters.starred ||
    (filters.dateRange.length &&
      (filters.dateRange[0] || filters.dateRange[1]));

  return (
    <Content maxWidth={1200}>
      {data.connectionsGet.length >= 10 && (
        <Filters
          setFilters={setFilters}
          filters={filters}
          tagGroups={tagGroups}
          fullFilter={false}
        />
      )}
      <Card maxWidth={1200} style={{ paddingBottom: "20px" }}>
        <ChartArea
          connections={connectionsGeneral}
          groupsTags={groupsTags}
          tagGroups={tagGroups}
        />
      </Card>

      <div className={styles.small_text_flex}>
        {(hasFilters && (
          <div
            className={styles.clear_filters}
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

        <div className={styles.counter}>
          Showing {connections.length} results
        </div>
      </div>

      <Card maxWidth={1200} noMargin={true} style={{ paddingBottom: "20px" }}>
        <Table
          dataSource={connections || []}
          columns={columns}
          disableHead={false}
          pagination={false}
          allowSorting={true}
          loading={loading}
          emptyLabel="No results."
        />
      </Card>
    </Content>
  );
}

const mapStateToProps = (state: any) => ({
  chartFilters: state.connections.chartFilters,
});

export default connect(mapStateToProps)(Connections);
