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

export default function FilterBar({
  close,
  filters,
  setFilters,
  filterValue,
  handleFilter,
}) {
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
                      onChange={e => {
                        setFilters({ ...filters, funnelTag: data.id });
                      }}
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
  const DatePicker = () => (
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
  const handleSearch = value => {
    handleFilter(value);
  };
  return (
    <Sidebar title="FILTERS" icon="fas fa-filter" close={close}>
      <div className={styles.filter}>
        <div className={styles.search}>
          <input
            type="text"
            value={filterValue}
            onChange={e => {
              handleSearch(e);
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
              { name: "software", id: "47" },
            ]}
            tagSize="smallTagSize"
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
