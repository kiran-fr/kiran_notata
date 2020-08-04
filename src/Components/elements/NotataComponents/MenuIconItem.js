import React from "react";
import { Link, Redirect } from "react-router-dom";

import classnames from "classnames";

import {
  icon,
  notification_counter,
  large_style,
  label_style,
  horizontal_style,
  current_route,
} from "./MenuIconItem.module.css";

export const MenuIconItem = ({
  link,
  label,
  large,
  iconClass,
  notifications,
  horizontal,
  ...props
}) => {
  let this_page = "/";

  if (link) {
    return (
      <Link
        to={link}
        className={classnames(
          icon,
          large && large_style,
          horizontal && horizontal_style,
          link === this_page && current_route
        )}
        {...props}
      >
        {!!notifications && (
          <span className={notification_counter}>{notifications}</span>
        )}
        <i className={iconClass} />
        <div className={label_style}>{label}</div>
      </Link>
    );
  }

  return (
    <div
      className={classnames(
        icon,
        large && large_style,
        horizontal && horizontal_style
      )}
      {...props}
    >
      {!!notifications && (
        <span className={notification_counter}>{notifications}</span>
      )}
      <i className={iconClass} />
      <div className={label_style}>{label}</div>
    </div>
  );
};
