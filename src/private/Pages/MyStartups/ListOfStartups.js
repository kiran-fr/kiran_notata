import React, { useState, useEffect } from "react";

// API
import { useQuery, useMutation } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";
import { connectionSetStar } from "private/Apollo/Mutations";

// COMPONENTS
import SetFunnelScore from "./Modal/setFunnelScore";
import SubjectiveScoreModal from "./Modal/SubjectiveScoreModal";
import Table from "./DealFlow/DealFlowTable/table/table";
import AddToGroupModalNew from "./Modal/AddToGroupModalNew";
import AddTagsForConnectionModal from "../StartupPage/TabPages/Overview/modals/AddTagsForConnectionModal";

function getCleanFilterData(filters) {
  let clean = {};
  for (let key in filters) {
    if (
      (filters[key] && filters[key].length) ||
      (typeof filters[key] === "boolean" && filters[key])
    ) {
      clean[key] = filters[key];
    }
  }
  return clean;
}

export default function ListOfStartups({
  filters,
  setFilters,
  currentPage,
  history,
  columnSettings,
  evaluationTemplates,
  evaluationTemplatesQuery,
  updateFunnelTag,
  funnelLoad,
}) {
  // States
  const [showTagGroupForId, setShowTagGroupForId] = useState();
  const [showStartUpForId, setShowStartUpForId] = useState();
  const [showSubjectiveScoreForId, setShowSubjectiveScoreForId] = useState();
  const [showFunnelScoreForId, setShowFunnelScoreForId] = useState();

  // Queries
  const { data, called, loading, error, fetchMore } = useQuery(connectionsGet, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: {
      filters: getCleanFilterData(filters),
      LastEvaluatedId: undefined,
    },
  });

  // Mutations
  const [setStarMutation] = useMutation(connectionSetStar);

  // Data maps
  const connections = data?.connectionsGet || [];

  // Effects
  useEffect(() => {
    let LastEvaluatedId = currentPage && currentPage.LastEvaluatedId;
    let variables = { LastEvaluatedId };
    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    });
  }, [currentPage]);

  return (
    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
      <Table
        setStarMutation={setStarMutation}
        columnSettings={columnSettings}
        connections={connections}
        filters={filters}
        setFilters={setFilters}
        funnelLoad={funnelLoad}
        evaluationTemplates={evaluationTemplates}
        loading={loading || evaluationTemplatesQuery.loading}
        emptyLabel={"No results."}
        history={history}
        setShowFunnelScoreForId={setShowFunnelScoreForId}
        setShowTagGroupForId={setShowTagGroupForId}
        setShowStartUpForId={setShowStartUpForId}
        setShowSubjectiveScoreForId={setShowSubjectiveScoreForId}
        updateFunnelTag={updateFunnelTag}
      />

      {showTagGroupForId && (
        <AddToGroupModalNew
          connection={connections.find(({ id }) => id === showTagGroupForId)}
          close={() => setShowTagGroupForId(undefined)}
        />
      )}

      {showFunnelScoreForId && (
        <SetFunnelScore
          updateFunnelTag={updateFunnelTag}
          funnelLoad={funnelLoad}
          connection={connections.find(({ id }) => id === showFunnelScoreForId)}
          close={() => setShowFunnelScoreForId(undefined)}
        />
      )}

      {showStartUpForId && (
        <AddTagsForConnectionModal
          connection={connections.find(({ id }) => id === showStartUpForId)}
          close={() => setShowStartUpForId(undefined)}
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
