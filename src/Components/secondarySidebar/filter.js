import React, { useEffect, useState } from "react";

import Sidebar from "./index";
// import { Tags } from "Components/UI_Kits/Tags/Tags";
import TagsModal from "../../private/NewDesign/srv_startup/pages/ui-kits/TagsModal";
import { Modal } from "../UI_Kits/Modal/Modal";

// common dynamic funnel img function
import { DynamicIcons } from "./../../private/NewDesign/CommonFunctions";
import { CheckBox } from "Components/UI_Kits";

// API
import { useQuery } from "@apollo/client";
import { funnelGroupGet } from "private/Apollo/Queries";
import DateRangeSelector from "Components/elements/NotataComponents/DateRangeSelector";
import moment from "moment";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./sidebar.module.scss";

import More from "assets/images/more.svg";

// const DatePicker = ({ filters, setFilters }) => {
//   const setDateFilter = dateRange => {
//     let from = moment(dateRange[0]);
//     let to = moment(dateRange[1]);

//     if (from.isValid() && to.isValid()) {
//       let fromDate = from?.format("x");
//       let toDate = to?.format("x");
//       console.log(fromDate, toDate);
//       setFilters({ ...filters, fromDate, toDate });
//     }
//   };

//   return (
//     <DateRangeSelector
//       value={[filters?.fromDate, filters?.toDate]}
//       onValueChange={setDateFilter}
//     />
//   );
// };

// const DatePickerNewdesign = ({ filters, setFilters }) => {
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);

//   const handleChange = e => {
//     let { name, value } = e.target;
//     value = moment(value).format("X");
//     setFilters({ ...filters, [name]: value });
//   };

//   useEffect(() => {
//     if (moment(filters.fromDate)?.isValid()) {
//       setFromDate(moment(filters.fromDate).format("YYYY-MM-DD"));
//     } else {
//       setFromDate(moment.unix(filters.fromDate).format("YYYY-MM-DD"));
//     }
//   }, [filters.fromDate]);

//   useEffect(() => {
//     if (moment(filters.toDate)?.isValid()) {
//       setToDate(moment(filters.toDate)?.format("YYYY-MM-DD"));
//     } else {
//       setToDate(moment.unix(filters.toDate)?.format("YYYY-MM-DD"));
//     }
//   }, [filters.toDate]);

//   return (
//     <div className={styles.dateStage}>
//       <div className={styles.dateFrom}>
//         <label>From</label>
//         <input
//           type="date"
//           name="fromDate"
//           value={fromDate}
//           onChange={handleChange}
//         />
//       </div>
//       <div className={styles.dateTo}>
//         <label>To</label>
//         <input
//           type="date"
//           name="toDate"
//           value={toDate}
//           onChange={handleChange}
//         />
//       </div>
//     </div>
//   );
// };

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

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = dates => {
    const [start, end] = dates;
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
    console.log("value", tagArr);

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
                item.funnelTags.map((data, index) => (
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
        <i className={"fa fa-spinner fa-spin"} />
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
          {/* <DatePickerNewdesign filters={filters} setFilters={setFilters} />
          <DatePicker filters={filters} setFilters={setFilters} /> */}
          <div className={styles.date_time}>
            <div className={styles.from_to}>
              <div className={styles.from_to__header}>From</div>
              <div
                className={styles.from_to__datePicker}
                onClick={() => setCalendarVisible(true)}
              >
                <div>
                  {startDate
                    ? startDate.toLocaleDateString("en-US")
                    : "mm/dd/yyyy"}
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                </div>
              </div>
            </div>
            <div className={styles.from_to}>
              <div className={styles.from_to__header}>To</div>
              <div
                className={styles.from_to__datePicker}
                onClick={() => setCalendarVisible(true)}
              >
                <div>
                  {endDate ? endDate.toLocaleDateString("en-US") : "mm/dd/yyyy"}
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.last_day_container}>
            <div className={styles.last_day_container__last_day}>
              last 7 days
            </div>
            <div className={styles.last_day_container__last_day}>
              last 14 days
            </div>
            <div className={styles.last_day_container__last_day}>
              last 30 days
            </div>
            <div className={styles.last_day_container__last_day}>
              last 90 days
            </div>
            <div className={styles.last_day_container__last_day}>last year</div>
          </div>
          {isCalendarVisible && (
            <>
              <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                formatWeekDay={nameOfDay => nameOfDay.substr(0, 1)}
                selectsRange
                inline
              />
              {/* <div className="ghost-filter"></div> */}
            </>
          )}
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
