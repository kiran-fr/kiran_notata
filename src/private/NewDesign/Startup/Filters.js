import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import TagSelector from "Components/TagSelector/TagSelector";
import { Tag, Modal } from "Components/elements/";
// import DateRangeSelector from "Components/elements/NotataComponents/DateRangeSelector";

import { funnelGroupGet, tagGroupsGet } from "private/Apollo/Queries";
import { useQuery } from "@apollo/client";
import { cloneDeep } from "lodash";
import classnames from "classnames";
=======
>>>>>>> 07405f0f9cc334477681b1af4a62d7f253eac4f1
import styles from "./filter.module.css";
import Filterr from "../../../assets/images/filter.png";
import Column from "../../../assets/images/column.png";
import KanbanIcon from "../../../assets/images/KanbanIcon.svg";
import AddStartup from "./Modal/addStartup";
import { Tabsection } from "Components/UI_Kits/Tabs/index";
import FilterSidebar from "Components/secondarySidebar/filter";
import ColumnSidebar from "Components/secondarySidebar/manage";
<<<<<<< HEAD

import PopupMenu from "./PopupMenu";

import moment from "moment";
=======
>>>>>>> 07405f0f9cc334477681b1af4a62d7f253eac4f1
import {
  container,
  container_mini,
  footer,
<<<<<<< HEAD
  // filter_star,
  filter_icon_container,
  filter_icon,
  tag_each,
  tag_kill,
  filter_container,
  // filter_content,
  funnel_tag_container,
  funnel_tag,
  funnel_tag_active,
} from "./Filters.module.scss";
// import {
//   // clear_filters,
//   // counter,
//   // small_text_flex,
// } from "./Connections.module.css";

const Tags = ({ filters, tagGroups, setFilters }) => {
  const [show, setShow] = useState(false);

  return (
    <div className={filter_icon_container}>
      <div className={filter_icon} onClick={() => setShow(!show)}>
        <i className={`${filters.tags?.length ? "fas" : "fal"} fa-tag`} />
      </div>

      <TagSelector
        show={show}
        close={() => setShow(false)}
        tagGroups={tagGroups}
        checkedTags={filters.tags}
        addTag={tag => {
          setFilters({
            ...filters,
            tags: [...filters.tags, tag],
          });
        }}
        deleteTag={tag => {
          setFilters({
            ...filters,
            tags: filters.tags.filter(({ id }) => id !== tag.id),
          });
        }}
      />
    </div>
  );
};

const Funnels = ({ filters, setFilters, setFilterType }) => {
  const { data, error, loading } = useQuery(funnelGroupGet);

  const [show, setShow] = useState(false);

  let funnelGroups = [];
  if (data && !error && !loading) {
    funnelGroups = data.accountGet.funnelGroups;
  }

  const addFunnelTag = funnelTag => {
    // let group = funnelGroups.find(({ id }) => funnelTag.funnelGroupId === id);

    if (filters.funnelTags.some(({ id }) => id === funnelTag.id)) {
      return setFilters([]);
    }

    setFilters([funnelTag]);
  };
=======
  filter_container,
} from "./Filters.module.scss";
>>>>>>> 07405f0f9cc334477681b1af4a62d7f253eac4f1

const OptionalFilterSidebar = ({ setOptionalFilter }) => {
  return (
    <div>
      <div className={styles.filterContainer}>
        <button
          className={styles.filterButton + " " + styles.manageButton}
          style={{ marginRight: "10px" }}
          onClick={() => setOptionalFilter("column")}
        >
          <img src={Column} alt="" /> <span>Manage Columns</span>
        </button>
        <button
          className={styles.filterButton}
          onClick={() => setOptionalFilter("filter")}
        >
          <img src={Filterr} alt="" /> <span>Filter</span>
        </button>
      </div>
    </div>
  );
};

<<<<<<< HEAD
function getHasFilters(filters) {
  return false;
}
=======
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
>>>>>>> 07405f0f9cc334477681b1af4a62d7f253eac4f1

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

  useEffect(() => {
    setTabValue(tabArr[1].value);
    setActiveTab(tabArr[1].value);
  }, []);

  useEffect(() => {
    setFilterValue(filters.search);
  }, [filters]);

<<<<<<< HEAD
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

  const formatDateTag = range => {
    let result = "";
    if (range[0]) {
      result += ` From ${moment(range[0]).format("MM-DD-YYYY")}`;
    }
    if (range[1]) {
      result += ` To ${moment(range[1]).format("MM-DD-YYYY")}`;
=======
  useEffect(() => {
    if (filterValue === "") {
      setFilters({ ...filters, search: filterValue });
>>>>>>> 07405f0f9cc334477681b1af4a62d7f253eac4f1
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
