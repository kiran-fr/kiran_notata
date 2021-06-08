import React, { useState, useEffect } from "react";

// API
import { useQuery, useMutation } from "@apollo/client";
import {
  connectionsGet,
  evaluationTemplatesGet,
  userGet,
  groupsGetV2
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
import AddGroup from "./Modal/addGroup";
import SetFunnelScore from "./Modal/setFunnelScore";
import SubjectiveScoreModal from "./Modal/SubjectiveScoreModal";
import Table from "./DealFlow/table/DealflowTable";
import { Modal } from "Components/UI_Kits/Modal/Modal";
// import { groupsGetV2 } from "../../Apollo/Queries";

// import Table from "./DealFlow/table/newdesignTable/table";

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

function ListOfStartups({
  filters,
  setFilters,
  currentPage,
  history,
  columnSettings,
  evaluationTemplates,
  evaluationTemplatesQuery,
  updateFunnelTag,
  funnelLoad
}) {
  // States (for modal)
  const [showTagGroupForId, setShowTagGroupForId] = useState();
  const [showStartUpForId, setShowStartUpForId] = useState();
  const [showSubjectiveScoreForId, setShowSubjectiveScoreForId] = useState();
  const [showFunnelScoreForId, setShowFunnelScoreForId] = useState();

  // Queries
  const groupsQuery = useQuery(groupsGetV2);

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
        funnelLoad = {funnelLoad}
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
        <Modal
          title="Add startup to group"
          submit={() => setShowTagGroupForId(undefined)}
          close={() => setShowTagGroupForId(undefined)}
          submitTxt="OK"
          closeTxt="CLOSE"
          children={
            <AddGroup
              connection={connections.find(
                ({ id }) => id === showTagGroupForId
              )}
              groups={groupsQuery?.data?.groupsGetV2}
            />
          }
        />
      )}

      {showFunnelScoreForId && (
        <SetFunnelScore
          updateFunnelTag={updateFunnelTag}
          funnelLoad = {funnelLoad}
          connection={connections.find(({ id }) => id === showFunnelScoreForId)}
          close={() => setShowFunnelScoreForId(undefined)}
        />
      )}

      {showStartUpForId && (
        <SelectTagsForStartup
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

export default function Connections({ history }) {
  const defaultFilters = {
    // FILTERS

    search: "",
    tags: [],
    funnelTag: [],
    fromDate: null,
    toDate: null,
    starred: false,
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
  const [selectedfunnelGroup, setSelectedfunnelGroup] = useState(0);
  const [funnelLoad, setFunnelLoad] = useState(false);


  const [manageColValue, setManageColValue] = useState({
    groups: true,
    funnels: true,
    tags: true,
    subjectiveScore: true,
    evaluationTemplates: [],
  });

  // Mutation updating funnel tag for connection
  const [mutate] = useMutation(connectionFunnelTagAdd);

  const updateFunnelTag = async (funnelTagId, connectionId) => {
    setFunnelLoad(true)
    const variables = {
      connectionId,
      funnelTagId,
    };
    await mutate({
      variables,
    });
    setFunnelLoad(false)
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
        defaultFilters={defaultFilters}
        fullFilter={true}
        tabValue={tabValue}
        setTabValue={setTabValue}
        setSelectedfunnelGroup={setSelectedfunnelGroup}
        evaluationTemplates={evaluationTemplates}
        setManageColValue={setManageColValue}
      />
      {tabValue === "spreadsheet" ? (
        <>
          <ListOfStartups
            history={history}
            filters={filters}
            funnelLoad = {funnelLoad}
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
        <Kanban history={history} selectedfunnelGroup={selectedfunnelGroup} />
      )}
    </>
  );
}
