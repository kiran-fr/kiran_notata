import React, { useState, useEffect } from "react";

// API
import { useQuery, useMutation } from "@apollo/client";
import {
  connectionsGet,
  evaluationTemplatesGet,
  userGet,
  connectionAutoCompleteName,
} from "private/Apollo/Queries";
import { connectionSetStar } from "private/Apollo/Mutations";

// COMPONENTS
import Filters from "./Filters";
import SelectTagsForStartup from "./Modal/SelectTagsForStartup";

import { Kanban } from "../Kanban/Kanban";

// Components
import Paginator from "./Paginator";

import SetFunnelScore from "./Modal/setFunnelScore";
import SubjectiveScoreModal from "./Modal/SubjectiveScoreModal";
import Table from "./DealFlow/table/DealflowTable";

// import Table from "./../../../Components/NewDesignTable/table.component";

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
  manageColValue,
  filters,
  setFilters,
  currentPage,
  history,
  columnSettings,
  evaluationTemplates,
  evaluationTemplatesQuery,
  connections,
  fetchMore,
  loading,
}) {
  // States (for modal)
  const [showTagGroupForId, setShowTagGroupForId] = useState();
  const [showSubjectiveScoreForId, setShowSubjectiveScoreForId] = useState();
  const [showFunnelScoreForId, setShowFunnelScoreForId] = useState();
  const [subScoreModal, setSubScoreModal] = useState("");
  const [tableFields, setTableFields] = useState();

  //Query: User
  const userQuery = useQuery(userGet);

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

  // Define data
  const user = userQuery.data?.userGet || {};

  // Mutations
  const [setStarMutation] = useMutation(connectionSetStar);

  const allFields = {
    group: true,
    funnel: true,
    tag: true,
    score: true,
    updated: true,
    evaluation: true,
    pitching: true,
  };

  return (
    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
      <Table
        fields={allFields}
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
    // fromDate: new Date().getTime() - 40000,
    // toDate: new Date().getTime(),
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

  // States
  const [filters, setFilterState] = useState(defaultFilters);
  const [currentPage, setCurrentPage] = useState(undefined);
  const [render, setRender] = useState(false);
  const [tabValue, setTabValue] = useState("spreadsheet");
  const [summaryIdData, setSummaryIdData] = useState([]);

  const [manageColValue, setManageColValue] = useState({
    groups: true,
    funnels: true,
    tags: true,
    subjectiveScore: true,
    evaluationTemplates: [],
  });

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

  useEffect(() => {
    evaluationTemplates.forEach(summary => {
      setSummaryIdData(summaryIdData => [...summaryIdData, summary.id]);
      setManageColValue(manageColValue => ({
        ...manageColValue,
        ["evaluationTemplates"]: [
          ...manageColValue.evaluationTemplates,
          summary.id,
        ],
      }));
    });
  }, [evaluationTemplates]);

  console.log("manageColValue", summaryIdData, manageColValue);

  useEffect(() => {
    if (manageColValue) {
      setRender(render);
    }
  }, [manageColValue]);

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

  const allEvaluation =
    evaluationTemplates.length === manageColValue.evaluationTemplates.length;

  // manage Column

  return (
    <>
      <Filters
        manageColValue={manageColValue}
        setFilters={setFilters}
        allEvaluation={allEvaluation}
        filters={filters}
        history={history}
        fullFilter={true}
        tabValue={tabValue}
        summaryIdData={summaryIdData}
        setTabValue={setTabValue}
        connections={connections}
        evaluationTemplates={evaluationTemplates}
        setManageColValue={setManageColValue}
      />
      {tabValue === "spreadsheet" ? (
        <>
          <ListOfStartups
            history={history}
            fetchMore={fetchMore}
            loading={loading}
            filters={filters}
            connections={connections}
            columnSettings={manageColValue}
            evaluationTemplatesQuery={evaluationTemplatesQuery}
            setFilters={setFilters}
            currentPage={currentPage}
            evaluationTemplates={evaluationTemplates}
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
