import React from "react";
import classnames from "classnames";
import {
  page_header,
  progress_bars,
  progress_bar,
  page_title
} from "./PageHeader.module.css";
import { findIndex } from "lodash";
import { color1 } from "../../elements/Colors.module.css";

export class PageHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { name } = this.props;
    return (
      <div>
        <div className={classnames(page_title, color1)}>{name}</div>
      </div>
    );
  }
}
