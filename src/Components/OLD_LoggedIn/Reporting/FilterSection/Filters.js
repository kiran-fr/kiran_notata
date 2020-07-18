import React from "react";
import classnames from "classnames";
import { flatten } from "lodash";
import {
  container,
  each,
  hamburger_container,
  open_container,
  hamburger,
  icons
} from "./Filters.module.css";
import { color2_bg, color3_bg } from "../../../Colors.module.css";

class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      tags: []
    };
  }

  componentDidMount() {
    if (!this.props.data) return;
    let d1 = this.props.data.getEvaluations.map(d => d.tags).filter(d => d);
    let d2 = this.props.data.getEvaluationsSharedWithMe
      .map(d => d.tags)
      .filter(d => d);
    let tags = [...new Set(flatten(d1.concat(d2)))];
    this.setState({ tags });
  }

  render() {
    let { data, filters, updateFilters } = this.props;
    let {
      last_14_days,
      shared_with_me,
      my_own,
      include_archived,
      include_tags
    } = filters;

    return (
      <div className={container}>
        <div className={classnames(hamburger_container, color3_bg)}>
          <div className={icons}>
            {my_own && <i className="fas fa-user-crown" />}
            {shared_with_me && <i className="fas fa-share-alt" />}
            {last_14_days && <i className="fas fa-calendar-alt" />}
            {include_archived && <i className="fas fa-inbox" />}
          </div>

          <div
            onClick={() => this.setState({ open: !this.state.open })}
            className={hamburger}
          >
            <i className="fas fa-filter" />
          </div>
        </div>

        <div
          className={classnames(open_container, color2_bg)}
          style={{ display: this.state.open ? "block" : "none" }}
        >
          <div
            onClick={() =>
              updateFilters({ ...filters, last_14_days: !last_14_days })
            }
            className={each}
          >
            Show only last 14 days
            <i
              className={last_14_days ? "fas fa-check-circle" : "far fa-circle"}
            />
          </div>

          <div
            onClick={() =>
              updateFilters({ ...filters, shared_with_me: !shared_with_me })
            }
            className={each}
          >
            Evaluations shared with me
            <i
              className={
                shared_with_me ? "fas fa-check-circle" : "far fa-circle"
              }
            />
          </div>

          <div
            onClick={() => updateFilters({ ...filters, my_own: !my_own })}
            className={each}
          >
            My own evaluations
            <i className={my_own ? "fas fa-check-circle" : "far fa-circle"} />
          </div>

          <div
            onClick={() =>
              updateFilters({ ...filters, include_archived: !include_archived })
            }
            className={each}
          >
            Include archived
            <i
              className={
                include_archived ? "fas fa-check-circle" : "far fa-circle"
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Filters;
