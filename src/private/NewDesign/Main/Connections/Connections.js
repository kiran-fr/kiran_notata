import React, { useState, useEffect } from "react";

// API
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { connectionsGet, evaluationTemplatesGet } from "private/Apollo/Queries";
import { connectionSetStar } from "private/Apollo/Mutations";

// COMPONENTS
import Filters from "../Filters";
import SelectTagsForStartup from "./SelectTagsForStartup";

import { Kanban } from "../../Kanban/Kanban";
import CreateStartupModal from "Components/CreateStartupModal/CreateStartupModal";

// FUNCTIONS
import applyFilters from "./applyFilters";

// Definitions
import defaultFilters from "./defaultFilters";

// Components
import { Card, Button } from "Components/UI_Kits";
import Paginator from "./Paginator";

//import { Table } from "Components/UI_Kits";
import SetFunnelScore from "./setFunnelScore";
import SubjectiveScoreModal from "./SubjectiveScoreModal";
import tableColumns from "./TableColumns";
import { tableScroll } from "./Connections.module.css";
import Table from "../../../../Components/table/table.component";

function ListOfStartups({ filters, currentPage, history }) {
  // States (for modal)
  const [showTagGroupForId, setShowTagGroupForId] = useState();
  const [showSubjectiveScoreForId, setShowSubjectiveScoreForId] = useState();
  const [showFunnelScoreForId, setShowFunnelScoreForId] = useState();
  const [subScoreModal, setSubScoreModal] = useState("");

  // Query: Account
  const evaluationTemplatesQuery = useQuery(evaluationTemplatesGet);

  // Query: Connections
  const { data, called, loading, error, fetchMore } = useQuery(connectionsGet, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: {
      LastEvaluatedId: undefined,
    },
  });

  // Fetch more
  useEffect(() => {
    let LastEvaluatedId = currentPage && currentPage.LastEvaluatedId;
    let variables = { LastEvaluatedId };
    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    });
  }, [currentPage]);

  // TODO: Column settings
  // This is saved on user.columnSettings
  let columnSettings = {
    groups: false,

    evaluationTemplates: [
      "275c9718-61d4-c04b-ef00-3da8770b4442",
      "e166a3f7-fbf8-6f5c-fa1d-43509844a8d3",
    ],
  };

  // Define data
  const connections = data?.connectionsGet || [];

  const evaluationTemplates =
    evaluationTemplatesQuery?.data?.accountGet?.evaluationTemplates || [];

  console.log("evaluationTemplates", evaluationTemplates);

  // Filter data
  const filteredConnections = applyFilters({ connections, filters });

  // Mutations
  const [setStarMutation] = useMutation(connectionSetStar);

  const columns = tableColumns({
    history,
    setStarMutation,
    setShowTagGroupForId,
    setShowSubjectiveScoreForId,
    setShowFunnelScoreForId,
  });

  return (
    // <Card maxWidth={1200} className={tableScroll} noMargin={true}>
    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
      <Table
        columnSettings={columnSettings}
        data={connections}
        evaluationTemplates={evaluationTemplates}
        loading={loading || evaluationTemplatesQuery.loading}
        emptyLabel={"No results."}
        history={history}
        setShowFunnelScoreForId={setShowFunnelScoreForId}
        setShowTagGroupForId={setShowTagGroupForId}
        setShowSubjectiveScoreForId={setShowSubjectiveScoreForId}
      ></Table>

      {showFunnelScoreForId && (
        <SetFunnelScore
          connection={connections.find(({ id }) => id === showFunnelScoreForId)}
          close={() => setShowFunnelScoreForId(undefined)}
        />
      )}

      {showTagGroupForId && (
        <SelectTagsForStartup
          connection={connections.find(({ id }) => id === showTagGroupForId)}
          close={() => setShowTagGroupForId(undefined)}
        />
      )}

      {showSubjectiveScoreForId && (
        <SubjectiveScoreModal
          connection={connections.find(
            ({ id }) => id === showSubjectiveScoreForId
          )}
          close={() => setShowSubjectiveScoreForId(undefined)}
        />
      )}
    </div>
  );
}

export default function Connections({ history }) {
  // States
  const [filters, setFilterState] = useState(defaultFilters);
  const [currentPage, setCurrentPage] = useState(undefined);
  const [showNewStartupModal, setShowNewStartupModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tabValue, setTabValue] = useState("2");

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

  return (
    <>
      {/* <div
        style={{
          position: "relative",
          marginBottom: "10px",
          top: "-20px",
        }}
      >
        <Button
          onClick={() => setShowNewStartupModal(true)}
          type="right_arrow"
          size="large"
        >
          ADD NEW STARTUP
        </Button>
      </div> */}

      <CreateStartupModal
        history={history}
        open={showNewStartupModal}
        close={() => setShowNewStartupModal(false)}
      />

      <Filters
        setShowNewStartupModal={setShowNewStartupModal}
        setFilters={setFilters}
        filters={filters}
        fullFilter={true}
        tabValue={tabValue}
        setTabValue={setTabValue}
      />

      {tabValue === "2" ? (
        <>
          <ListOfStartups
            history={history}
            filters={filters}
            currentPage={currentPage}
          />
          <Paginator
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      ) : (
        <Kanban />
      )}
    </>
  );
}
