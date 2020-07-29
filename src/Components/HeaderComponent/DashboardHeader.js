import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

// API
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { userGet } from "../../Apollo/Queries";
import { profile, signOut, reporting, dashboard } from "../../routes";

// STYLE
import {
  container,
  icons,
  icon,
  icon_label,
  current_route,
  notification_counter,
  label_style,
  horizontal_style,
  icon_dropdown_container,
  drop_down,
  drop_down_list,
  drop_down_close
} from "./Header.module.css";

import classnames from "classnames";

const IconItem = ({ link, label, icon_class, notifications, horizontal }) => {
  let this_page = dashboard;

  return (
    <Link
      to={link}
      className={classnames(
        icon,
        horizontal && horizontal_style,
        link === this_page && current_route
      )}
    >
      {!!notifications && (
        <span className={notification_counter}>{notifications}</span>
      )}
      <i className={icon_class} />
      <div className={label_style}>{label}</div>
    </Link>
  );
};

export const DashboardHeader = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { data, loading, error } = useQuery(userGet);

  let have_profile;
  if (!loading && !error && data) {
    let user = data.userGet || {};
    have_profile = user.email !== null;
  }

  return (
    <div className={container}>
      <div className={icons}>
        <IconItem link={dashboard} icon_class="fal fa-home" label="Home" />

        <IconItem
          link={reporting}
          icon_class="fal fa-chart-bar"
          label="Reporting"
        />

        <IconItem
          link={reporting}
          icon_class="fal fa-tasks"
          label="Activities"
          notifications={0}
        />

        <IconItem
          link={reporting}
          icon_class="fal fa-inbox"
          label="Inbox"
          notifications={0}
        />

        <div className={icon_dropdown_container}>
          <div className={classnames(icon)}>
            <span onClick={() => setOpenMenu(true)}>
              <i className="fal fa-bars" />
              <div className={label_style}>More</div>
            </span>
          </div>

          {openMenu && (
            <div className={drop_down}>
              <div className={drop_down_list}>
                <div
                  className={drop_down_close}
                  onClick={() => setOpenMenu(false)}
                >
                  <i className="fal fa-times" />
                </div>

                <IconItem
                  link={reporting}
                  icon_class="fal fa-copy"
                  label="Templates"
                  horizontal
                />

                <IconItem
                  link={reporting}
                  icon_class="fal fa-tag"
                  label="Tags"
                  horizontal
                />

                <IconItem
                  link={reporting}
                  icon_class="fal fa-share-alt"
                  label="Groups"
                  horizontal
                />

                <IconItem
                  link={profile}
                  icon_class="fal fa-user"
                  label="Profile"
                  horizontal
                />

                <IconItem
                  link={reporting}
                  icon_class="fal fa-cog"
                  label="Settings"
                  horizontal
                />

                <IconItem
                  link={reporting}
                  icon_class="fal fa-sign-out-alt"
                  label="Log out"
                  horizontal
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
