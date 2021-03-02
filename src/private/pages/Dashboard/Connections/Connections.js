import React, { useState, useEffect } from "react";

// API
import { useQuery, useMutation } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";
import { connectionSetStar } from "private/Apollo/Mutations";

// COMPONENTS
import Filters from "../Filters";
import SelectTagsForStartup from "./SelectTagsForStartup";
import SetSubjectiveScore from "./SetSubjectiveScore";

// import CreateNewStartup from "./CreateStartup";

// FUNCTIONS
import applyFilters from "./applyFilters";

// Definitions
import defaultFilters from "./defaultFilters";

// Components
import { Table, Card, GhostLoader } from "Components/elements";
import tableColumns from "./TableColumns";

export default function Connections({ history }) {
  // States
  const [filters, setFilterState] = useState(defaultFilters);
  const [showTagGroupForId, setShowTagGroupForId] = useState(undefined);
  const [showSubjectiveScoreForId, setShowSubjectiveScoreForId] = useState(
    undefined
  );

  // Queries
  const { data, called, loading, error } = useQuery(connectionsGet);

  // Mutations
  const [setStarMutation] = useMutation(connectionSetStar);

  // Load filters from local store
  useEffect(() => {
    let f;
    try {
      f = JSON.parse(localStorage.getItem("filters"));
    } catch (error) {}
    if (f) setFilterState(f);
  }, []);

  // Setting filters: save to local store
  function setFilters(filterData) {
    localStorage.setItem("filters", JSON.stringify(filterData));
    setFilterState(filterData);
  }

  // Handle error
  if (error) {
    throw error;
  }

  // Handle loading
  if (called && loading) {
    return <GhostLoader />;
  }

  // Define data
  const connections = data?.connectionsGet || [];

  // Filter data
  const filteredConnections = applyFilters({ connections, filters });

  const columns = tableColumns({
    history,
    setStarMutation,
    setShowTagGroupForId,
    setShowSubjectiveScoreForId,
  });

  return (
    <>
      {connections.length >= 10 && (
        <Filters
          setFilters={setFilters}
          filters={filters}
          fullFilter={true}
          itemCount={filteredConnections.length}
        />
      )}

      <Card maxWidth={1200} noMargin={true}>
        <Table
          dataSource={filteredConnections}
          columns={columns}
          disableHead={false}
          pagination={false}
          allowSorting={true}
          loading={loading}
          emptyLabel={"No results."}
        />

        {showTagGroupForId && (
          <SelectTagsForStartup
            connection={connections.find(({ id }) => id === showTagGroupForId)}
            close={() => setShowTagGroupForId(undefined)}
          />
        )}

        {showSubjectiveScoreForId && (
          <SetSubjectiveScore
            connection={connections.find(
              ({ id }) => id === showSubjectiveScoreForId
            )}
            history={history}
            close={() => {
              setShowSubjectiveScoreForId(undefined);
            }}
          />
        )}
      </Card>
    </>
  );
}
