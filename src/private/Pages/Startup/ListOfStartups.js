import React, { useState, useEffect } from "react";

// Modal
import SelectTagsForStartup from "./Modal/SelectTagsForStartup";
import SetFunnelScore from "./Modal/setFunnelScore";
import SubjectiveScoreModal from "./Modal/SubjectiveScoreModal";

// COMPONENTS
import Table from "./DealFlow/table/DealflowTable";

export const ListOfStartups = ({
  manageColValue,
  filters,
  setFilters,
  currentPage,
  history,
  columnSettings,
  evaluationTemplates,
  evaluationTemplatesQuery,
}) => {
  // States (for modal)
  const [showTagGroupForId, setShowTagGroupForId] = useState();
  const [showSubjectiveScoreForId, setShowSubjectiveScoreForId] = useState();
  const [showFunnelScoreForId, setShowFunnelScoreForId] = useState();

  return (
    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
      <Table
        // fields={allFields}
        manageColValue={manageColValue}
        columnSettings={columnSettings}
        data={connections}
        filters={filters}
        setFilters={setFilters}
        evaluationTemplates={evaluationTemplates}
        loading={loading || evaluationTemplatesQuery.loading}
        emptyLabel={"No results."}
        history={history}
        setShowFunnelScoreForId={setShowFunnelScoreForId}
        setShowTagGroupForId={setShowTagGroupForId}
        setShowSubjectiveScoreForId={setShowSubjectiveScoreForId}
      />

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
};
