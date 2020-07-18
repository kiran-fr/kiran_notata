import React from "react";
import classnames from "classnames";
import moment from "moment";
import { flatten } from "lodash";
import {
  container,
  each,
  icon,
  hamburger_container,
  open_container,
  hamburger,
  icons
} from "./Filters.module.css";
import { color2_bg, color3_bg } from "../../../elements/Colors.module.css";
import DatePicker from "./Date";

class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  componentDidMount() {
    let d1 = this.props.evaluations.map(d => d.tags).filter(d => d);
    let d2 = this.props.evaluationsSharedWithMe.map(d => d.tags).filter(d => d);
    let tags = [...new Set(flatten(d1.concat(d2)))];
    this.setState({ tags });
  }

  render() {
    let { filters, updateFilters, startDate } = this.props;
    let {
      last_14_days,
      shared_with_me,
      my_own,
      include_archived,
      include_tags,
      from_date,
      to_date
    } = filters;

    return (
      <div className={container}>
        <DatePicker
          date={from_date || moment(startDate, "x").format()}
          label="From date"
          setNewDate={from_date => {
            updateFilters({ ...filters, from_date });
          }}
        />

        <DatePicker
          date={to_date || moment().format()}
          label="To date"
          setNewDate={to_date => {
            updateFilters({ ...filters, to_date });
          }}
        />

        <div
          onClick={() => updateFilters({ ...filters, my_own: !my_own })}
          className={each}
          style={{ paddingRight: "50px" }}
        >
          My own
          <div className={icon}>
            <i
              style={{ color: my_own ? "green" : "gray" }}
              className={my_own ? "fas fa-toggle-on" : "fas fa-toggle-off"}
            />
          </div>
        </div>

        <div
          onClick={() =>
            updateFilters({ ...filters, shared_with_me: !shared_with_me })
          }
          className={each}
          style={{ paddingRight: "50px" }}
        >
          Shared with me
          <div className={icon}>
            <i
              style={{ color: shared_with_me ? "green" : "gray" }}
              className={
                shared_with_me ? "fas fa-toggle-on" : "fas fa-toggle-off"
              }
            />
          </div>
        </div>

        <div
          onClick={() =>
            updateFilters({ ...filters, include_archived: !include_archived })
          }
          className={each}
          style={{ paddingRight: "50px" }}
        >
          Archived
          <div className={icon}>
            <i
              style={{ color: include_archived ? "green" : "gray" }}
              className={
                include_archived ? "fas fa-toggle-on" : "fas fa-toggle-off"
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Filters;
