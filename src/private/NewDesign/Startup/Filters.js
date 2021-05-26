import React, { useState, useEffect } from "react";
import styles from "./filter.module.css";
import Filterr from "../../../assets/images/filter.png";
import Column from "../../../assets/images/column.png";
import KanbanIcon from "../../../assets/images/KanbanIcon.svg";
import AddStartup from "./Modal/addStartup";
import { Tabsection } from "Components/UI_Kits/Tabs/index";
import FilterSidebar from "Components/secondarySidebar/filter";
import ColumnSidebar from "Components/secondarySidebar/manage";

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
  } else {
    console.log("kanban section");
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

// function getHasFilters(filters) {
//    const hasFilters =
//     filters.tags && filters.tags.length ||
//     filters.funnelTag && filters.funnelTag.length ||
//     filters.search ||
//     filters.starred
//     // (filters.dateRange.length &&
//     // (filters.dateRange[0] || filters.dateRange[1]));
//     console.log('insidefilter',filters, hasFilters)
//     if(hasFilters) {
//       return true;
//     } else {
//       return false;
//     }
// }

export default function Filters({
  history,
  filters,
  setFilters,
  fullFilter,
  setTabValue,
  setManageColValue,
  manageColValue,
  evaluationTemplates,
}) {
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState();
  const [optionalFilter, setOptionalFilter] = useState();
  const [filterValue, setFilterValue] = useState();

  const [kanbanPopup, setKanbanPopup] = useState(false);

  let hasFilters = false;

  useEffect(() => {
    setTabValue(tabArr[1].value);
    setActiveTab(tabArr[1].value);
  }, []);

  useEffect(() => {
    // hasFilters = getHasFilters(filters)
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
            items={["All Startups", "Funnel 1", "Funnel 2", "Funnel 3"]}
            isOpen={kanbanPopup}
            setIsOpen={setKanbanPopup}
          ></PopupMenu>
          {/* <DropMenu
            dropMenuArr={[
              { iconName: "", title: "Funnel 1" },
              { iconName: "", title: "Funnel 2" },
              { iconName: "", title: "Funnel 3" },
              { iconName: "", title: "Funnel 3" },
              { iconName: "", title: "Funnel 3" },
              { iconName: "", title: "Funnel 3" },
            ]}
          ></DropMenu> */}
        </div>
      ),
    },
    {
      value: "spreadsheet",
      text: (
        <div>
          <img
            style={{ width: 15, height: 15, marginRight: "4px" }}
            src={Column}
            alt=""
          />
          <span>SPREADSHEET</span>
        </div>
      ),
    },
  ];

  const handleSearch = e => {
    if (activeTab === "spreadsheet") {
      setFilterValue(e.target.value);
    }
  };

  const handleTab = val => {
    setTabValue(val);
    setActiveTab(val);
    if (val !== "spreadsheet") {
      setOptionalFilter("");
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
                    <i className="far fa-plus"></i>&nbsp; &nbsp; Add new startup
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
                    />
                    <button onClick={() => handleSearchBtn()}>Search</button>
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
        {activeTab === "spreadsheet" ? (
          <div
            className="text-right text-danger"
            onClick={() => {
              setFilters({
                search: "",
                tags: [],
                funnelTag: [],
                fromDate: new Date().getTime() - 40000,
                toDate: new Date().getTime(),
                starred: false,
              });
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
