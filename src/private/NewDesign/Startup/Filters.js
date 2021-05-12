import React, { useState, useEffect } from "react";
import styles from "./filter.module.css";
import Filterr from "../../../assets/images/filter.png";
import Column from "../../../assets/images/column.png";
import AddStartup from "./Modal/addStartup";
import { Tabsection } from "Components/UI_Kits/Tabs/index";
import FilterSidebar from "Components/secondarySidebar/filter";
import ColumnSidebar from "Components/secondarySidebar/manage";
import {
  container,
  container_mini,
  footer,
  filter_container,
} from "./Filters.module.scss";

const OptionalFilterSidebar = ({ setOptionalFilter }) => {
  return (
    <div>
      <div className={styles.filterContainer}>
        <button
          className={styles.filterButton + " " + styles.manageButton}
          style={{ marginRight: "10px" }}
          onClick={() => setOptionalFilter("column")}
        >
          <img src={Column} /> <span>Manage Columns</span>
        </button>
        <button
          className={styles.filterButton}
          onClick={() => setOptionalFilter("filter")}
        >
          <img src={Filterr} /> <span>Filter</span>
        </button>
      </div>
    </div>
  );
};

const tabArr = [
  {
    value: "kanban",
    text: (
      <div>
        <span>KANBAN</span>
        <i style={{ marginLeft: "5px" }} className="fas fa-chevron-down"></i>
      </div>
    ),
  },
  {
    value: "spreadsheet",
    text: (
      <div>
        <img src={Column} />
        <span>SPREADSHEET</span>
      </div>
    ),
  },
];

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

  useEffect(() => {
    setTabValue(tabArr[1].value);
    setActiveTab(tabArr[1].value);
  }, []);

  useEffect(() => {
    setFilterValue(filters.search);
  }, [filters]);

  useEffect(() => {
    if (filterValue === "") {
      setFilters({ ...filters, search: filterValue });
    }
  }, [filterValue]);

  const handleSearch = e => {
    setFilterValue(e.target.value);
  };

  const handleTab = () => {
    if (activeTab === "kanban") {
      setTabValue("spreadsheet");
      setActiveTab("spreadsheet");
    } else {
      setTabValue("kanban");
      setActiveTab("kanban");
    }
  };

  return (
    <div>
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
                    <i class="far fa-plus"></i>&nbsp; &nbsp; Add new startup
                  </button>
                  <div className={styles.tableSearch}>
                    <input
                      type="text"
                      value={filterValue}
                      onChange={e => handleSearch(e)}
                    />
                    <button
                      onClick={() =>
                        setFilters({ ...filters, search: filterValue })
                      }
                    >
                      Search
                    </button>
                    <i class="far fa-search"></i>
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
                tabFuc={handleTab}
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
                <OptionalFilterSidebar setOptionalFilter={setOptionalFilter} />
              </div>
            </div>
          </div>
        </div>
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
