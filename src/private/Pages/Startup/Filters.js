import React, { useState, useEffect } from "react";
import styles from "./filter.module.css";
import Filterr from "../../../assets/images/filter.png";
import Column from "../../../assets/images/column.png";
import KanbanIcon from "../../../assets/images/KanbanIcon.svg";
import AddStartup from "./Modal/addStartup";
import { Tabsection } from "Components/UI_Kits/Tabs/index";
import FilterSidebar from "Components/secondarySidebar/filter";
import ColumnSidebar from "Components/secondarySidebar/manage";

//API
import { funnelGroupGet } from "private/Apollo/Queries";
import { useQuery } from "@apollo/client";

import PopupMenu from "./PopupMenu";

import {
  container,
  container_mini,
  footer,
  filter_container,
} from "./Filters.module.scss";

const handleOptional = (setState, filterType, disabled) => {
  if (disabled === "") {
    setState(filterType);
  }
};

const OptionalFilterSidebar = ({ setOptionalFilter, grayFadeOut }) => {
  return (
    <div className={grayFadeOut}>
      <div className={styles.filterContainer}>
        <button
          className={styles.filterButton + " " + styles.manageButton}
          style={{ marginRight: "10px" }}
          onClick={() =>
            handleOptional(setOptionalFilter, "column", grayFadeOut)
          }
        >
          <img src={Column} alt="" /> <span>Manage Columns</span>
        </button>
        <button
          className={styles.filterButton}
          onClick={() =>
            handleOptional(setOptionalFilter, "filter", grayFadeOut)
          }
        >
          <img src={Filterr} alt="" /> <span>Filter</span>
        </button>
      </div>
    </div>
  );
};

function handleclearTxt(filters) {
  const hideTxt =
    (filters.tags && filters.tags.length > 0) ||
    (filters.funnelTag && filters.funnelTag.length > 0) ||
    filters.search ||
    filters.starred ||
    (filters.fromDate && filters.toDate);

  if (hideTxt) {
    return true;
  } else {
    return false;
  }
}

export default function Filters({
  history,
  filters,
  setFilters,
  fullFilter,
  setTabValue,
  setManageColValue,
  manageColValue,
  evaluationTemplates,
  defaultFilters,
  setSelectedfunnelGroup,
}) {
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState();
  const [optionalFilter, setOptionalFilter] = useState();
  const [filterValue, setFilterValue] = useState();
  const [kanbanDropDown, setKanbanDropDown] = useState([]);
  const [clearFilterTxt, setClearFilterTxt] = useState(false);
  const [kanbanPopup, setKanbanPopup] = useState(false);

  // Query: getfunnelGroup
  const { data, called, loading, error, fetchMore } = useQuery(funnelGroupGet);

  const funnelGroup = data ? data.accountGet.funnelGroups : [];

  useEffect(() => {
    setTabValue(tabArr[1].value);
    setActiveTab(tabArr[1].value);
  }, []);

  // Kanban funnels dropdown
  useEffect(() => {
    const groupArr = [];
    funnelGroup.filter(item => {
      if (item.funnelTags.length > 0) {
        groupArr.push(item.name);
      }
    });
    setKanbanDropDown(groupArr);
  }, [funnelGroup.length]);

  useEffect(() => {
    setClearFilterTxt(handleclearTxt(filters));
    setFilterValue(filters.search);
  }, [filters]);

  useEffect(() => {
    if (filterValue === "") {
      setFilters({ ...filters, search: filterValue });
    }
  }, [filterValue]);

  const tabArr = [
    {
      value: "kanban",
      text: (
        <div>
          <img
            style={{
              width: 15,
              height: 15,
              marginRight: "4px",
              transform: "rotateZ(360deg)",
              opacity: activeTab === "kanban" ? 1 : 0.5,
            }}
            src={KanbanIcon}
            alt=""
          />
          <span>KANBAN</span>
          <i
            onClick={() => setKanbanPopup(!kanbanPopup)}
            style={{ marginLeft: "5px" }}
            className="fas fa-chevron-down"
          ></i>
          <PopupMenu
            title="Kanban"
            items={kanbanDropDown}
            isOpen={kanbanPopup}
            setSelectedfunnelGroup={setSelectedfunnelGroup}
            setIsOpen={setKanbanPopup}
          ></PopupMenu>
        </div>
      ),
    },
    {
      value: "spreadsheet",
      text: (
        <div>
          <img
            style={{
              width: 15,
              height: 15,
              marginRight: "4px",
              opacity: activeTab === "kanban" ? 0.5 : 1,
            }}
            src={Column}
            alt=""
          />
          <span>LIST</span>
        </div>
      ),
    },
  ];

  const handleSearch = e => {
    if (activeTab === "spreadsheet") {
      setFilterValue(e.target.value);
    }
  };

  const searchOnEnter = e => {
    if (e.key === "Enter" && activeTab === "spreadsheet") {
      setFilters({ ...filters, search: filterValue });
    }
  };

  const handleTab = val => {
    setTabValue(val);
    setActiveTab(val);
    if (val !== "spreadsheet") {
      setOptionalFilter("");
    } else {
      setKanbanPopup(false);
    }
  };

  const handleSearchBtn = () => {
    if (activeTab === "spreadsheet") {
      setFilters({ ...filters, search: filterValue });
    }
  };

  return (
    <div className={styles.override}>
      <div className={fullFilter ? container : container_mini}>
        <div className={footer}>
          <div className={filter_container}>
            <div
              className={
                styles.table_headerChild + " " + styles.table_headerChildFirst
              }
            >
              {fullFilter && (
                <div
                  className={styles.table_headerInner}
                  style={{ width: "100%" }}
                >
                  <button
                    className={styles.addButton}
                    onClick={() => setModal("startup")}
                  >
                    <i className="far fa-plus" />
                    Add new startup
                  </button>
                  <div
                    className={
                      activeTab !== "spreadsheet"
                        ? styles.grayFadeOut + " " + styles.tableSearch
                        : styles.tableSearch
                    }
                  >
                    <input
                      type="text"
                      value={filterValue}
                      onChange={e => handleSearch(e)}
                      onKeyPress={e => searchOnEnter(e)}
                    />
                    <button
                      className={styles.searchButton}
                      onClick={() => handleSearchBtn()}
                    >
                      <span>Search</span>
                      <span>S</span>
                    </button>
                    <i className="far fa-search"></i>
                  </div>
                </div>
              )}
            </div>
            <div
              className={
                styles.table_headerChild +
                " " +
                styles.table_headerChildMiddle +
                " " +
                "table_headerChildMiddle"
              }
            >
              <Tabsection
                tabFuc={val => handleTab(val)}
                tabArr={tabArr}
                tabValue={activeTab || tabArr[1]?.value}
              />
            </div>
            <div
              className={
                styles.table_headerChild + " " + styles.table_headerChildLast
              }
              style={{ width: "20%" }}
            >
              <div>
                <OptionalFilterSidebar
                  setOptionalFilter={setOptionalFilter}
                  grayFadeOut={
                    activeTab !== "spreadsheet" ? styles.grayFadeOut : ""
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {activeTab === "spreadsheet" && clearFilterTxt ? (
          <div
            className={
              styles.clearAllTxt + " " + "text-right" + " " + styles.handCursor
            }
            onClick={() => {
              setFilters(defaultFilters);
            }}
          >
            Clear All Filters
          </div>
        ) : (
          ""
        )}
      </div>

      {modal === "startup" && (
        <AddStartup history={history} closeModal={setModal} />
      )}
      {optionalFilter === "column" ? (
        <ColumnSidebar
          evaluationTemplates={evaluationTemplates}
          close={setOptionalFilter}
          manageColValue={manageColValue}
          setManageColValue={setManageColValue}
        />
      ) : (
        optionalFilter === "filter" && (
          <FilterSidebar
            defaultFilters={defaultFilters}
            close={setOptionalFilter}
            filters={filters}
            handleSearch={handleSearch}
            filterValue={filterValue}
            setFilters={setFilters}
          />
        )
      )}
    </div>
  );
}
