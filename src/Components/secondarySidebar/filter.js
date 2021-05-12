import React, { useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import Sidebar from "./index";
import { Tags } from "Components/UI_Kits/Tags/Tags";
import img1 from "../../assets/images/redBar.png";
import img2 from "../../assets/images/greenBar.png";
import img3 from "../../assets/images/violetBar.png";
import img4 from "../../assets/images/yellowBar.png";
import img5 from "../../assets/images/grassBar.png";
// API
import { useQuery } from "@apollo/client";
import { funnelGroupGet } from "private/Apollo/Queries";
import DateRangeSelector from "Components/elements/NotataComponents/DateRangeSelector";
import SavingsPlans from "aws-sdk/clients/savingsplans";

export default function FilterBar({
  close,
  filters,
  setFilters,
  filterValue,
  handleSearch,
}) {
  const [selectedDate, setSelectedDate] = useState("2014-08-18");
  const handleDateChange = date => {
    setSelectedDate(date);
  };
  // Query: Connections
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
                <li>
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
                  <div className={styles.image}>
                    <img
                      src={
                        index === 0
                          ? img1
                          : index === 1
                          ? img2
                          : index === 2
                          ? img3
                          : index === 3
                          ? img4
                          : img5
                      }
                    />
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
  const DatePicker = () => {
    const [show, setShow] = useState(false);
    const [dateRanges, setDateRanges] = useState([null, null]);

    const setDateFilter = dateRange => {
      setDateRanges(dateRange);
    };

    return (
      <DateRangeSelector value={dateRanges} onValueChange={setDateFilter} />
    );
  };
  const filterSearch = value => {
    handleSearch(value);
  };
  return (
    <Sidebar
      title={
        <span
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
          clear all filters
        </span>
      }
      icon="fas fa-filter"
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
            getSelectedTag={tags => {
              setFilters({
                ...filters,
                tags: [...tags],
              });
            }}
            closeIcon="smallCloseIcon"
          />
        </div>
        <div className={styles.funnelStage}>
          <h2>DATE</h2>
          <DatePicker />
          <div className={styles.shortDates}>
            <div>
              <p>last 7 days</p>
            </div>
            <div>
              <p>last 14 days</p>
            </div>
            <div>
              <p>last 30 days</p>
            </div>
            <div>
              <p>last 90 days</p>
            </div>
            <div>
              <p>last year</p>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
