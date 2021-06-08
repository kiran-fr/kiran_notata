import React, { useEffect, useState } from "react";

import Sidebar from "./index";
// import { Tags } from "Components/UI_Kits/Tags/Tags";
import TagsModal from "../../private/NewDesign/srv_startup/pages/ui-kits/TagsModal";
import { Modal } from "../UI_Kits/Modal/Modal";
import { Loader} from "Components/UI_Kits";
import { sortArr } from "../../private/NewDesign/CommonFunctions";
// common dynamic funnel img function
import { DynamicIcons } from "./../../private/NewDesign/CommonFunctions";
import { CheckBox, Datepicker1 } from "Components/UI_Kits";
// API
import { useQuery } from "@apollo/client";
import { funnelGroupGet } from "private/Apollo/Queries";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./sidebar.module.scss";

import More from "assets/images/more.svg";

export default function FilterBar({
  close,
  filters,
  setFilters,
  filterValue,
  handleSearch,
  defaultFilters,
}) {
  // Query: getfunnelGroup
  const { data, called, loading, error, fetchMore } = useQuery(funnelGroupGet);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [tagSelected, setTagSelected] = useState([]);
  const [dateFlag, setDateFlag] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // useEffect(() => {
  //   setStartDate(filters.fromDate)
  //   setEndDate(filters.toDate)
  //   setDateFlag(true)
  // }, [filters.fromDate && filters.toDate && !dateFlag]);

  useEffect(() => {
    let tagArr = [];
    tagSelected.map(el => tagArr.push(el.id));
    setFilters({ ...filters, tags: tagArr });
  }, [tagSelected]);

  const dateRange = (dates, range) => {
    let fromDate = range[0] ? moment(range[0]).format("x") : "";
    let toDate = range[1] ? moment(range[1]).format("x") : "";
    if (fromDate && toDate) {
      setFilters({ ...filters, fromDate, toDate });
    }
    setStartDate(range[0]);
    setEndDate(range[1]);
    if (fromDate && toDate) {
      setCalendarVisible(false);
    }
  };
  const onChange = dates => {
    const [start, end] = dates;
    let fromDate = start ? moment(start).format("x") : "";
    let toDate = end ? moment(end).format("x") : "";

    if (fromDate && toDate) {
      setFilters({ ...filters, fromDate, toDate });
    }
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setCalendarVisible(false);
    }
  };

  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const funnelGroupArray = data ? data.accountGet.funnelGroups : [];

  useEffect(() => {
    let tagArr = [];
    tagSelected.map(el => tagArr.push(el.id));
    setFilters({ ...filters, tags: tagArr });
  }, [tagSelected]);

  const FunnelStage = () => (
    <ul className={styles.funnelUl}>
      {funnelGroupArray.length ? (
        funnelGroupArray.map(item =>
          item.funnelTags.length ? (
            <>
              <h6>{item.name}</h6>
              {item.funnelTags.length &&
                sortArr(item.funnelTags).map((data, index) => (
                  <li key={index}>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name={data.name}
                          onChange={() =>
                            setFilters({ ...filters, funnelTag: data.id })
                          }
                          checked={data.id === filters?.funnelTag}
                        />
                      </label>
                      <p>{data.name}</p>
                    </div>
                    <div className={styles.image}>
                      <img src={DynamicIcons(index, "filter")} alt="" />
                    </div>
                  </li>
                ))}
            </>
          ) : (
            ""
          )
        )
      ) : loading ? (
        <Loader/>
      ) : (
        ""
      )}
    </ul>
  );

  const filterSearch = value => {
    handleSearch(value);
  };

  return (
    <Sidebar
      title={
        <button
          className={styles.clearAllButton}
          type="button"
          onClick={() => {
            setFilters(defaultFilters);
          }}
        >
          Clear All Filters
        </button>
      }
      close={close}
    >
      <div className={styles.filter}>
        <div className={styles.search}>
          <input
            type="text"
            value={filterValue}
            onChange={e => {
              filterSearch(e);
            }}
          />
          <button
            onClick={() => {
              setFilters({ ...filters, search: filterValue });
            }}
          >
            Search
          </button>
        </div>
        <div>
          <CheckBox
            label={"Starred"}
            isSelected={filters.starred}
            onSelect={() =>
              setFilters({ ...filters, starred: !filters.starred })
            }
          />
        </div>
        <div className={styles.funnelStage}>
          <h2>FUNNEL STAGE</h2>
          <FunnelStage />
        </div>
        <div className="addTagMain">
          <div className="row tags-container overview-tags">
            <div className="tags-container__heading">Tags</div>
            <div className="tags-container__sub-heading">
              Write or choose tags
            </div>
            <div className={styles.tags__placeholder}>
              {tagSelected.length > 0
                ? tagSelected.slice(0, 2).map(el => (
                    <span
                      style={{
                        height: "100%",
                        color: "white",
                        padding: "2px 10px",
                        backgroundColor: "#555",
                        borderRadius: 15,
                        fontSize: 10,
                        marginTop: 1,
                        marginRight: 7,
                      }}
                      key={el.id}
                    >
                      {el.group.name} : {el.name}
                    </span>
                  ))
                : ""}
              {tagSelected.length > 2 ? <img src={More} alt="" /> : null}
              <i
                class="fa fa-plus"
                aria-hidden="true"
                onClick={() => setShowTagsModal(true)}
              ></i>
            </div>
          </div>
        </div>
        <div className={styles.funnelStage}>
          <h2>DATE</h2>
          <Datepicker1
            selected={startDate}
            setCalendarVisible={setCalendarVisible}
            onChange={onChange}
            dateRange={dateRange}
            isCalendarVisible={isCalendarVisible}
            startDate={startDate}
            endDate={endDate}
            formatWeekDay={nameOfDay => nameOfDay.substr(0, 1)}
          />
        </div>
      </div>
      {showTagsModal && (
        <Modal
          title="Add Tags"
          disableFoot={true}
          submit={() => {
            setShowTagsModal(false);
          }}
          close={() => {
            setShowTagsModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={
            <TagsModal
              tagFlag={true}
              tagSelected={tagSelected}
              setTagSelected={setTagSelected}
            />
          }
        ></Modal>
      )}
    </Sidebar>
  );
}
