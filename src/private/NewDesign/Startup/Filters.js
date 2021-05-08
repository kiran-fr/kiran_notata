import React, { useState, useEffect } from "react";
import TagSelector from "Components/TagSelector/TagSelector";
import { Tag, Modal } from "Components/elements/";
import DateRangeSelector from "Components/elements/NotataComponents/DateRangeSelector";

import { funnelGroupGet, tagGroupsGet } from "private/Apollo/Queries";
import { useQuery } from "@apollo/client";
import { cloneDeep } from "lodash";
import classnames from "classnames";
import styles from "./filter.module.css";
import Filterr from "../../../assets/images/filter.png";
import Column from "../../../assets/images/column.png";
import AddStartup from "./DealFlow/addStartup";
import { Tabsection } from "Components/UI_Kits/Tabs/index";
import FilterSidebar from "Components/secondarySidebar/filter";
import ColumnSidebar from "Components/secondarySidebar/manage";

import moment from "moment";
import {
  container,
  container_mini,
  content,
  footer,
  filter_star,
  filter_icon_container,
  filter_icon,
  tag_each,
  tag_kill,
  filter_container,
  filter_content,
  funnel_tag_container,
  funnel_tag,
  funnel_tag_active,
} from "./Filters.module.scss";
import {
  clear_filters,
  counter,
  small_text_flex,
} from "./Connections.module.css";

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

  return (
    <div>
      <div className={styles.filterContainer}>
        <button
          className={styles.filterButton + " " + styles.manageButton}
          style={{ marginRight: "10px" }}
          onClick={() => setFilterType("column")}
        >
          <img src={Column} /> <span>Manage Columns</span>
        </button>
        <button
          className={styles.filterButton}
          onClick={() => setFilterType("filter")}
        >
          <img src={Filterr} /> <span>Filter</span>
        </button>
      </div>

      {show && (
        <Modal title="FUNNEL" close={() => setShow(false)}>
          {funnelGroups.map(funnelGroup => {
            let funnelTags = cloneDeep(funnelGroup.funnelTags);
            funnelTags = funnelTags.sort((a, b) => a.index - b.index);
            return (
              <div key={funnelGroup.id}>
                <div className={funnel_tag_container}>
                  {funnelTags.map((funnelTag, i) => (
                    <div
                      key={funnelTag.id}
                      className={classnames(
                        funnel_tag,
                        (filters.funnelTags || []).some(
                          ({ id }) => id === funnelTag.id
                        ) && funnel_tag_active
                      )}
                      style={{ width: `${100 - i * 10}%` }}
                      onClick={() => addFunnelTag(funnelTag)}
                    >
                      {funnelTag.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Modal>
      )}
    </div>
  );
};

function getHasFilters(filters) {
  /*  const hasFilters =
    filters.tags.length ||
    filters.funnelTags.length ||
    filters.search ||
    filters.starred ||
    (filters.dateRange.length &&
      (filters.dateRange[0] || filters.dateRange[1]));*/
  return false;
}

export default function Filters({
  filters,
  setFilters,
  fullFilter,
  setTabValue,
  setShowNewStartupModal,
  setManageColValue,
  manageColValue,
  evaluationTemplates,
  allEvaluation,
  summaryIdData,
}) {
  const tagGroupsQuery = useQuery(tagGroupsGet);
  const tagGroups = tagGroupsQuery?.data?.tagGroupsGet || [];
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState();
  const [filterType, setFilterType] = useState();
  const [filterValue, setFilterValue] = useState();

  useEffect(() => {
    setTabValue(tabArr[1].value);
    setActiveTab(tabArr[1].value);
  }, []);

  const tabArr = [
    { value: "kanban", text: "KANBAN" },
    { value: "spreadsheet", text: "SPREADSHEET" },
  ];

  const formatDateTag = range => {
    let result = "";
    if (range[0]) {
      result += ` From ${moment(range[0]).format("MM-DD-YYYY")}`;
    }
    if (range[1]) {
      result += ` To ${moment(range[1]).format("MM-DD-YYYY")}`;
    }
    return result;
  };

  let hasFilters = getHasFilters(filters);

  const handleTab = () => {
    if (activeTab === "kanban") {
      setTabValue("spreadsheet");
      setActiveTab("spreadsheet");
    } else {
      setTabValue("kanban");
      setActiveTab("kanban");
    }
  };

  const handleFilter = e => {
    setFilterValue(e.target.value);
  };

  return (
    <div>
      <div className={small_text_flex}>
        {/* {!!hasFilters && ( */}
        <div
          className={clear_filters}
          onClick={() => {
            setFilters({
              search: "",
              tags: [],
              funnelTags: [],
              // dateRange: [null, null],
            });
          }}
        >
          clear all filters
        </div>
        {/* )} */}
      </div>

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
                    // onClick={() => setModal("startup")}
                    onClick={() => setShowNewStartupModal(true)}
                  >
                    <i class="far fa-plus"></i>&nbsp; &nbsp; Add new startup
                  </button>
                  <div className={styles.tableSearch}>
                    <input
                      type="text"
                      value={filterValue}
                      onChange={e => handleFilter(e)}
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
                <Funnels
                  filters={filters}
                  setFilters={funnelTags =>
                    setFilters({ ...filters, funnelTags })
                  }
                  setFilterType={setFilterType}
                />
              </div>
            </div>
          </div>
        </div>

        {(!!filters.tags.length || !!filters.funnelTags.length) && (
          // filters.dateRange[0] ||
          // filters.dateRange[1]) &&
          <div className={content}>
            <div>
              {filters.funnelTags.map(funnelTag => {
                return (
                  <Tag key={funnelTag.id}>
                    <div className={tag_each}>
                      <div>
                        <i className="fal fa-filter" /> {funnelTag.name}
                      </div>
                      <div
                        className={tag_kill}
                        onClick={() => {
                          setFilters({
                            ...filters,
                            funnelTags: [],
                          });
                        }}
                      >
                        <i className="fal fa-times" />
                      </div>
                    </div>
                  </Tag>
                );
              })}

              {filters.tags.map(tag => {
                const group =
                  tagGroups.find(({ id }) => id === tag.tagGroupId) || {};
                return (
                  <Tag key={tag.id}>
                    <div className={tag_each}>
                      <div>
                        <i className="fal fa-tag" /> {group.name}: {tag.name}
                      </div>
                      <div
                        className={tag_kill}
                        onClick={() => {
                          setFilters({
                            ...filters,
                            tags: filters.tags.filter(
                              ({ id }) => id !== tag.id
                            ),
                          });
                        }}
                      >
                        <i className="fal fa-times" />
                      </div>
                    </div>
                  </Tag>
                );
              })}

              {/*{(filters.dateRange[0] || filters.dateRange[1]) && (*/}
              {/*  <Tag key="dateFilterTag">*/}
              {/*    <div className={tag_each}>*/}
              {/*      <div>*/}
              {/*        <i className="fal fa-calendar" /> Date:{" "}*/}
              {/*        {formatDateTag(filters.dateRange)}*/}
              {/*      </div>*/}
              {/*      <div*/}
              {/*        className={tag_kill}*/}
              {/*        onClick={() => {*/}
              {/*          setFilters({*/}
              {/*            ...filters,*/}
              {/*            dateRange: [null, null],*/}
              {/*          });*/}
              {/*        }}*/}
              {/*      >*/}
              {/*        <i className="fal fa-times" />*/}
              {/*      </div>*/}
              {/*    </div>*/}
              {/*  </Tag>*/}
              {/*)}*/}
            </div>
          </div>
        )}
      </div>

      {modal === "startup" && <AddStartup closeModal={setModal} />}
      {filterType === "column" ? (
        <ColumnSidebar
          allEvaluation={allEvaluation}
          evaluationTemplates={evaluationTemplates}
          close={setFilterType}
          manageColValue={manageColValue}
          setManageColValue={setManageColValue}
          summaryIdData={summaryIdData}
        />
      ) : (
        filterType === "filter" && (
          <FilterSidebar
            close={setFilterType}
            filters={filters}
            setFilters={setFilters}
          />
        )
      )}
    </div>
  );
}
