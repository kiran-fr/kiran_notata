import React from "react";
import styles from "./table.module.css";

export default function TableHeader(props) {
  const { evaluationTemplates, filters, setFilters, columnSettings } = props;

  return (
    <thead>
      <tr>
        <td>
          <label className={styles.customCheck} style={{ top: "-8px" }}>
            <input type="checkbox" />
            <span className={styles.checkmark}></span>
          </label>
        </td>
        <td>
          COMPANY NAME
          <i
            className="fal fa-exchange"
            onClick={() => {
              let sortBy = "ALPHA";
              let sortDirection = filters.sortBy === "ALPHA" ? "DESC" : "ASC";

              setFilters({
                ...filters,
                sortBy,
                sortDirection,
              });
            }}
          />
        </td>
        {columnSettings.groups && (
          <td>
            Groups
            <i
              className="fal fa-exchange"
              onClick={() => {
                let sortBy = "GROUP";
                let sortDirection = filters.sortBy === "GROUP" ? "DESC" : "ASC";
                setFilters({
                  ...filters,
                  sortBy,
                  sortDirection,
                });
              }}
            />
          </td>
        )}
        {columnSettings.funnels && (
          <td>
            FUNNEL STAGE
            <i
              className="fal fa-exchange"
              onClick={() => {
                let sortBy = "FUNNEL";
                let sortDirection =
                  filters.sortBy === "FUNNEL" ? "DESC" : "ASC";
                setFilters({
                  ...filters,
                  sortBy,
                  sortDirection,
                });
              }}
            />
          </td>
        )}
        {columnSettings.tags && (
          <td>
            TAGS
            <i
              onClick={() => {
                let sortBy = "TAGS";
                let sortDirection = filters.sortBy === "TAGS" ? "DESC" : "ASC";
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
        {columnSettings.subjectiveScore && (
          <td>
            SUBJECTIVE SCORE
            <i
              onClick={() => {
                let sortBy = "SUBJECTIVE_SCORE";
                let sortDirection =
                  filters.sortBy === "SUBJECTIVE_SCORE" ? "DESC" : "ASC";
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
                filters.sortBy === "UPDATED_AT" ? "DESC" : "ASC";
              setFilters({
                ...filters,
                sortBy,
                sortDirection,
              });
            }}
            className="fal fa-exchange"
          />
        </td>
        {evaluationTemplates.length &&
          evaluationTemplates.map(({ name, id }) =>
            columnSettings.evaluationTemplates.includes(id) ? (
              <td>
                {name}
                <i
                  onClick={() => {
                    let sortBy = "EVALUATION";
                    let sortDirection =
                      filters.sortBy === "EVALUATION" ? "DESC" : "ASC";

                    setFilters({
                      ...filters,
                      sortBy,
                      sortDirection,
                    });
                  }}
                  className="fal fa-exchange"
                />
              </td>
            ) : (
              ""
            )
          )}
      </tr>
    </thead>
  );
}