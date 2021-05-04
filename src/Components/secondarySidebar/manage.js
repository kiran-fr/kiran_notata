import React from "react";
import styles from "./sidebar.module.css";
import Sidebar from "./index";

export default function ManageSidebar({ close }) {
  const options = [
    "Groups",
    "Funnel Stage",
    "Tags",
    "Subjective Score",
    "Updated",
  ];
  const subOptions = [
    "Last Evaluation",
    "First Impression",
    "Before Pitching",
    "After Pitching",
  ];
  return (
    <Sidebar title="Manage Columns" icon="fas fa-cog" close={close}>
      <div className={styles.manage}>
        <ul>
          <li>
            <label className={styles.customCheck}>
              <input type="checkbox" />
              <span class={styles.checkmark}></span>
            </label>
            <p>Show All</p>
          </li>
        </ul>
        <ul>
          {options.map(item => (
            <li>
              <label className={styles.customCheck}>
                <input type="checkbox" />
                <span class={styles.checkmark}></span>
              </label>
              <p>{item}</p>
            </li>
          ))}

          <li>
            <label className={styles.customCheck}>
              <input type="checkbox" />
              <span class={styles.checkmark}></span>
            </label>
            <p>Evaluation</p>

            <ul>
              {subOptions.map(item => (
                <li>
                  <label className={styles.customCheck}>
                    <input type="checkbox" />
                    <span class={styles.checkmark}></span>
                  </label>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </Sidebar>
  );
}
