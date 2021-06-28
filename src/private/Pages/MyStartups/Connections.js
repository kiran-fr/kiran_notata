import React, { useState, useEffect } from "react";

// API
import { useQuery, useMutation } from "@apollo/client";
import { evaluationTemplatesGet, userGet } from "private/Apollo/Queries";
import { connectionFunnelTagAdd } from "private/Apollo/Mutations";

// COMPONENTS
import ListOfStartups from "./ListOfStartups";
import Filters from "./Filters/Filters";
import { Kanban } from "./Kanban/Kanban";
import Paginator from "./Paginator/Paginator";

// Components
// import SetFunnelScore from "./Modal/setFunnelScore";
// import SubjectiveScoreModal from "./Modal/SubjectiveScoreModal";
// import Table from "./DealFlow/DealflowTable/table/";
// import AddToGroupModalNew from "./Modal/AddToGroupModalNew";
// import { appsyncClient } from "../../../awsconfig";

export default function Connections({ history }) {
  // Constant
  const defaultFilters = {
    search: "",
    tags: [],
    funnelTag: [],
    fromDate: null,
    toDate: null,
    starred: false,
  };

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

  // Queries

  // Query: Account
  const evaluationTemplatesQuery = useQuery(evaluationTemplatesGet);
  //Query: User
  const userQuery = useQuery(userGet);

  // Mutation
  // Mutation updating funnel tag for connection
  const [mutate] = useMutation(connectionFunnelTagAdd);

  // Data maps
  const user = userQuery.data?.userGet || {};
  // TODO: Column Settings
  // This is saved on user.columnSettings
  const evaluationTemplates =
    evaluationTemplatesQuery?.data?.accountGet?.evaluationTemplates || [];

  // Effects
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

  // Function
  // Setting filters: save to local store
  function setFilters(filterData) {
    localStorage.setItem("filters", JSON.stringify(filterData));
    setFilterState(filterData);
  }

  const updateFunnelTag = async (funnelTagId, connectionId) => {
    setFunnelLoad(true);
    const variables = {
      connectionId,
      funnelTagId,
    };
    await mutate({
      variables,
    });
    setFunnelLoad(false);
  };

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
            funnelLoad={funnelLoad}
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
