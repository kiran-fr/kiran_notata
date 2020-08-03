import React from "react";
import { Link } from "react-router-dom";

import {
  breadcrumb_container,
  breadcrumb_link
} from "./BreadCrumbs.module.css";

const Component = ({ list }) => {
  return (
    <div className={breadcrumb_container}>
      {list.map((listItem, i) => (
        <div className={breadcrumb_link}>
          <i className="fal fa-caret-right" />
          <Link key={`bc-${i}`} to={listItem.link}>
            {listItem.val}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Component;
