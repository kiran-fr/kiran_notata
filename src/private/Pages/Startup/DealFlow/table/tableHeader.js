import React from "react";
import styles from "./table.module.css";

import PopupDropdown from "assets/images/PopupDown.svg";
import { CheckBox } from "../../../../../Components/UI_Kits";
import InputCheckBox from "../../../srv_startup/pages/ui-kits/check-box";

export default function TableHeader(props) {
  const {
    evaluationTemplates,
    filters,
    setFilters,
    columnSettings,
    handlePopup,
    checkAll,
    setCheckAll,
  } = props;

  return (
    <thead>
      <tr>
        <td className={styles.tableHeaderCheckmark}>
          <div>
            <label className={styles.customCheck}>
              <InputCheckBox
                checked={!!checkAll}
                onChange={() => setCheckAll(!checkAll)}
              />
            </label>

            <div onClick={handlePopup} className={styles.selectDropdown}>
              <img src={PopupDropdown} alt="" />
            </div>
          </div>
        </td>
        <td>
          COMPANY NAME
          <i
            className="fal fa-exchange"
            onClick={() => {
              let sortBy = "ALPHA";
              let sortDirection =
                filters.sortBy === "ALPHA" && filters.sortDirection !== "DESC"
                  ? "DESC"
                  : "ASC";

              setFilters({
                ...filters,
                sortBy,
                sortDirection,
              });
            }}
          />
        </td>
        {columnSettings.groups && <td>Groups</td>}
        {columnSettings.funnels && <td>FUNNEL STAGE</td>}
        {columnSettings.tags && <td>TAGS</td>}
        {columnSettings.subjectiveScore && (
          <td>
            SUBJECTIVE SCORE
            <i
              onClick={() => {
                let sortBy = "SUBJECTIVE_SCORE";
                let sortDirection =
                  filters.sortBy === "SUBJECTIVE_SCORE" &&
                  filters.sortDirection !== "DESC"
                    ? "DESC"
                    : "ASC";
                setFilters({
                  ...filters,
                  sortBy,
                  sortDirection,
                });
              }}
              className="fal fa-exchange"
            />
          </td>
        )}
        <td>
          UPDATED
          <i
            onClick={() => {
              let sortBy = "UPDATED_AT";
              let sortDirection =
                filters.sortBy === "UPDATED_AT" &&
                filters.sortDirection !== "DESC"
                  ? "DESC"
                  : "ASC";
              setFilters({
                ...filters,
                sortBy,
                sortDirection,
              });
            }}
            className="fal fa-exchange"
          />
        </td>
        {evaluationTemplates.length
          ? evaluationTemplates.map(({ name, id }) =>
              columnSettings.evaluationTemplates.includes(id) ? (
                <td>
                  {name}
                  <i
                    onClick={() => {
                      let sortBy = "EVALUATION";
                      let sortDirection =
                        filters.sortBy === "EVALUATION" &&
                        filters.sortDirection !== "DESC" &&
                        filters.sortByVal === id
                          ? "DESC"
                          : "ASC";

                      setFilters({
                        ...filters,
                        sortBy,
                        sortDirection,
                        sortByVal: id,
                      });
                    }}
                    className="fal fa-exchange"
                  />
                </td>
              ) : (
                ""
              )
            )
          : ""}
      </tr>
    </thead>
  );
}
