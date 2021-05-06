import React from "react";
import styles from "./sidebar.module.css";
import Sidebar from "./index";
import { Tags } from "Components/UI_Kits/Tags/Tags";
import RedBar from "../../assets/images/redBar.png";
import GreenBar from "../../assets/images/greenBar.png";
import VioletBar from "../../assets/images/violetBar.png";
import YellowBar from "../../assets/images/yellowBar.png";
import GrassBar from "../../assets/images/grassBar.png";

export default function FilterBar({ close, filters, setFilters }) {
  const funnels = [
    { name: "Reviewed", img: RedBar },
    { name: "Met", img: GreenBar },
    { name: "Analyzed", img: VioletBar },
    { name: "IC", img: YellowBar },
    { name: "Invested", img: GrassBar },
  ];
  const FunnelStage = () => (
    <ul className={styles.funnelUl}>
      {funnels.map(item => (
        <li>
          <div className="myCheckbox">
            <label className={styles.customCheck}>
              <input type="checkbox" />
              <span class={styles.checkmark}></span>
            </label>
          </div>
          <p>{item.name}</p>
          <div className={styles.image}>
            <img src={item.img} />
          </div>
        </li>
      ))}
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
  return (
    <Sidebar title="FILTERS" icon="fas fa-filter" close={close}>
      <div className={styles.filter}>
        <div className={styles.search}>
          <input
            type="text"
            value={filters.search}
            onChange={e => {
              setFilters({ ...filters, search: e.target.value });
            }}
          />
          <button>Search</button>
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
