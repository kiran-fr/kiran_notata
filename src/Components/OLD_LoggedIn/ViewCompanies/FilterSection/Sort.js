import React from "react";
import classnames from "classnames";
import {
  container,
  left,
  // icon,
  right,
  active
} from "./Sort.module.css";

import {
  // container,
  each,
  icon
  // hamburger_container,
  // open_container,
  // hamburger,
  // icons
} from "./Filters.module.css";

class Sort extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { sortBy, sortDirection, setSortDirection, setSortBy } = this.props;

    return (
      <div>
        <div
          className={each}
          onClick={() => {
            sortBy === "date" ? setSortBy("alphabetical") : setSortBy("date");
          }}
        >
          Sort: {sortBy === "date" ? "last updated" : "alphabetical"}
        </div>

        <div
          className={each}
          onClick={() => {
            sortDirection === "asc"
              ? setSortDirection("desc")
              : setSortDirection("asc");
          }}
        >
          Sort direction:{" "}
          {sortDirection === "asc" ? (
            <i className="fas fa-sort-amount-up" />
          ) : (
            <i className="fas fa-sort-amount-down" />
          )}
        </div>
      </div>
    );
  }
}

export default Sort;
