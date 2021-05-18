import React from "react";
import styles from "./sidebar.module.css";
import Sidebar from "./index";
import { Tags } from "Components/UI_Kits/Tags/Tags";

// common dynamic funnel img function
import { DynamicIcons } from "./../../private/NewDesign/CommonFunctions";

// API
import { useQuery } from "@apollo/client";
import { funnelGroupGet } from "private/Apollo/Queries";
import DateRangeSelector from "Components/elements/NotataComponents/DateRangeSelector";
import moment from "moment";

/* const DatePicker = ({ filters, setFilters }) => {
  const setDateFilter = dateRange => {
    let from = moment(dateRange[0]);
    let to = moment(dateRange[1]);

    if (from.isValid() && to.isValid()) {
      let fromDate = from?.format("x");
      let toDate = to?.format("x");
      console.log(fromDate, toDate);
      setFilters({ ...filters, fromDate, toDate });
    }
  };
}
 */
const DatePicker = ({ filters, setFilters }) => {
  const setDateFilter = dateRange => {
    let from = moment(dateRange[0]);
    let to = moment(dateRange[1]);

    if (from.isValid() && to.isValid()) {
      let fromDate = from?.format("x");
      let toDate = to?.format("x");
      console.log(fromDate, toDate);
      setFilters({ ...filters, fromDate, toDate });
    }
  };

  return (
    <DateRangeSelector
      value={[filters?.fromDate, filters?.toDate]}
      onValueChange={setDateFilter}
    />
  );
};

const DatePickerNewdesign = () => (
  <div className={styles.dateStage}>
    <div className={styles.dateFrom}>
      <label>From</label>
      <input type="date" id="birthday" name="birthday" />
    </div>
    <div className={styles.dateTo}>
      <label>To</label>
      <input
        type="date"
        id="birthday"
        name="birthday"
        placeholder="mm/dd/yyyy"
      />
    </div>
  </div>
);

export default function FilterBar({
  close,
  filters,
  setFilters,
  filterValue,
  handleSearch,
}) {
  // Query: getfunnelGroup
  const { data, called, loading, error, fetchMore } = useQuery(funnelGroupGet);

  const funnelGroupArray = data ? data.accountGet.funnelGroups : [];

  const FunnelStage = () => (
    <ul className={styles.funnelUl}>
      {funnelGroupArray.length ? (
        funnelGroupArray.map(item => (
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
        ))
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
            setFilters({
              search: "",
              tags: [],
              funnelTags: [],
              fromDate: new Date().getTime() - 40000,
              toDate: new Date().getTime(),
            });
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
        <div className={styles.funnelStage}>
          <h2>FUNNEL STAGE</h2>
          <FunnelStage />
        </div>
        <div className="addTagMain">
          <Tags
            suggested={true}
            size="smallInput"
            items={[
              { name: "software", id: "4" },
              { name: "saas", id: "23" },
              { name: "finance", id: "34" },
              { name: "automotive", id: "17" },
            ]}
            tagSize="smallTagSize"
            setTags={filters.tags}
            // getSelectedTag={tags => {
            //   setFilters({
            //     ...filters,
            //     tags: [...tags],
            //   });
            // }}
            closeIcon="smallCloseIcon"
          />
        </div>
        <div className={styles.funnelStage}>
          <h2>DATE</h2>
          <DatePicker filters={filters} setFilters={setFilters} />
          <DatePickerNewdesign />
        </div>
      </div>
    </Sidebar>
  );
}
