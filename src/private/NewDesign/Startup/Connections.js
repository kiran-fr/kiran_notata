import React, { useState, useEffect } from "react";

// API
import { useQuery, useMutation } from "@apollo/client";
import {
  connectionsGet,
  evaluationTemplatesGet,
  userGet,
  connectionAutoCompleteName,
} from "private/Apollo/Queries";
import {
  connectionSetStar,
  connectionFunnelTagAdd,
} from "private/Apollo/Mutations";

// COMPONENTS
import Filters from "./Filters";
import SelectTagsForStartup from "./Modal/SelectTagsForStartup";

import { Kanban } from "../Kanban/Kanban";

// Components
import Paginator from "./Paginator";

import SetFunnelScore from "./Modal/setFunnelScore";
import SubjectiveScoreModal from "./Modal/SubjectiveScoreModal";
import Table from "./DealFlow/table/DealflowTable";

function getCleanFilterData(filters) {
  let clean = {};
  for (let key in filters) {
    if (filters[key] && filters[key].length) {
      clean[key] = filters[key];
    }
  }
  return clean;
}

function ListOfStartups({
  filters,
  setFilters,
  currentPage,
  history,
  columnSettings,
  evaluationTemplates,
  evaluationTemplatesQuery,
  updateFunnelTag,
}) {
  // States (for modal)
  const [showTagGroupForId, setShowTagGroupForId] = useState();
  const [showSubjectiveScoreForId, setShowSubjectiveScoreForId] = useState();
  const [showFunnelScoreForId, setShowFunnelScoreForId] = useState();

  // Fetch more
  useEffect(() => {
    let LastEvaluatedId = currentPage && currentPage.LastEvaluatedId;
    let variables = { LastEvaluatedId };
    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult || prev,
    });
  }, [currentPage]);

  // Mutations
  const [setStarMutation] = useMutation(connectionSetStar);

  // Query: Connections
  const { data, called, loading, error, fetchMore } = useQuery(connectionsGet, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: {
      filters: getCleanFilterData(filters),
      LastEvaluatedId: undefined,
    },
  });

  // define data
  const connections = data?.connectionsGet || [];

  return (
    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
      <Table
        setStarMutation={setStarMutation}
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
        updateFunnelTag={updateFunnelTag}
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
  const defaultFilters = {
    // FILTERS

    search: "",
    tags: [],
    funnelTags: [],
    fromDate: new Date().getTime() - 40000,
    toDate: new Date().getTime(),
    // limit: 25

    // SORTING
    // sortBy: 'GROUP',
    //   // STARRED
    //   // ALPHA
    //   // EVALUATION
    //   // SUBJECTIVE_SCORE
    //   // TAGS
    //   // FUNNEL
    //   // GROUP
    //   // CREATED_AT
    //   // UPDATED_AT

    // sortByVal: "groupId",
    // sortDirection: 'ASC'
  };

  // Query: Account
  const evaluationTemplatesQuery = useQuery(evaluationTemplatesGet);

  const evaluationTemplates =
    evaluationTemplatesQuery?.data?.accountGet?.evaluationTemplates || [];

  //Query: User
  const userQuery = useQuery(userGet);

  // TODO: Column settings
  // This is saved on user.columnSettings

  // Define data
  const user = userQuery.data?.userGet || {};

  // States
  const [filters, setFilterState] = useState(defaultFilters);
  const [currentPage, setCurrentPage] = useState(undefined);
  const [tabValue, setTabValue] = useState("spreadsheet");

  const [manageColValue, setManageColValue] = useState({
    groups: true,
    funnels: true,
    tags: true,
    subjectiveScore: true,
    evaluationTemplates: [],
  });

  // Mutation updating funnel tag for connection
  const [mutate] = useMutation(connectionFunnelTagAdd);

  const updateFunnelTag = (funnelTagId, connectionId) => {
    const variables = {
      connectionId,
      funnelTagId,
    };
    mutate({
      variables,
    });
  };

  // Load filters from local store
  useEffect(() => {
    let f;
    try {
      f = JSON.parse(localStorage.getItem("filters"));
    } catch (error) {}

    if (f) {
      setFilterState(f.dateRange ? defaultFilters : f);
    }
  }, []);

  // Setting filters: save to local store
  function setFilters(filterData) {
    localStorage.setItem("filters", JSON.stringify(filterData));
    setFilterState(filterData);
  }

  useEffect(() => {
    if (user.columnSettings) {
      setManageColValue({
        ...manageColValue,
        groups: user.columnSettings[0].groups,
        funnels: user.columnSettings[0].funnels,
        tags: user.columnSettings[0].tags,
        subjectiveScore: user.columnSettings[0].subjectiveScore,
        evaluationTemplates: user.columnSettings[0].evaluationTemplates || [],
      });
    } else {
      evaluationTemplates.forEach(summary => {
        setManageColValue(manageColValue => ({
          ...manageColValue,
          ["evaluationTemplates"]: [
            ...manageColValue.evaluationTemplates,
            summary.id,
          ],
        }));
      });
    }
  }, [evaluationTemplates && user]);

  // manage Column

  return (
    <>
      <Filters
        manageColValue={manageColValue}
        setFilters={setFilters}
        filters={filters}
        history={history}
        fullFilter={true}
        tabValue={tabValue}
        setTabValue={setTabValue}
        evaluationTemplates={evaluationTemplates}
        setManageColValue={setManageColValue}
      />
      {tabValue === "spreadsheet" ? (
        <>
          <ListOfStartups
            history={history}
            filters={filters}
            columnSettings={manageColValue}
            evaluationTemplatesQuery={evaluationTemplatesQuery}
            setFilters={setFilters}
            currentPage={currentPage}
            evaluationTemplates={evaluationTemplates}
            updateFunnelTag={updateFunnelTag}
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
