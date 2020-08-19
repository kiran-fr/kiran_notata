import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

// API
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { userGet } from "../../Apollo/Queries";

// import {
//   frontpage,
//   dashboard,
//   profile,
//   report,
//   inbox,
//   activities,
//   tags,
//   group,
//   settings,
//   team,
//   evaluation_templates,
//   signOut,
// } from "../../routes";

// STYLE
import {
  container,
  logo,
  icons,
  icon_dropdown_container,
  drop_down,
  drop_down_ghost,
  drop_down_list,
  drop_down_close,
} from "./Header.module.css";

import { MenuIconItem } from "../elements/";

import classnames from "classnames";

let frontpage = "/";
let dashboard = "/dashboard";
let profile = "/dashboard/profile";
let report = "/dashboard/report";
let inbox = "/dashboard/inbox";
let activities = "/dashboard/activities";
let tags = "/dashboard/tags";
let group = "/dashboard/group";
let settings = "/dashboard/settings";
let team = "/dashboard/team";
let templates = "/dashboard/templates";
let signOut = "/signout";

const menuItems = [
  {
    label: "Home",
    iconClass: "fal fa-home",
    link: dashboard,
  },
  // {
  //   label: "Reports",
  //   iconClass: "fal fa-chart-bar",
  //   link: report,
  // },
  // {
  //   label: "Activities",
  //   iconClass: "fal fa-tasks",
  //   link: activities,
  //   notifications: 0,
  // },
  // {
  //   label: "Inbox",
  //   iconClass: "fal fa-inbox",
  //   link: inbox,
  //   notifications: 0,
  // },

  {
    label: "Templates",
    iconClass: "fal fa-copy",
    link: templates,
  },
  {
    label: "Profile",
    iconClass: "fal fa-user",
    link: profile,
  },
  {
    label: "Sharing",
    iconClass: "fal fa-share-alt",
    link: group,
  },
];

const moreMenuItems = [
  // {
  //   label: "Templates",
  //   iconClass: "fal fa-copy",
  //   link: templates,
  // },
  {
    label: "Tags",
    iconClass: "fal fa-tag",
    link: tags,
  },
  // {
  //   label: "Profile",
  //   iconClass: "fal fa-user",
  //   link: profile,
  // },
  {
    label: "Team",
    iconClass: "fal fa-users",
    link: team,
  },
  // {
  //   label: "Groups",
  //   iconClass: "fal fa-share-alt",
  //   link: group,
  // },
  // {
  //   label: "Settings",
  //   iconClass: "fal fa-cog",
  //   link: settings,
  // },
  {
    label: "Log out",
    iconClass: "fal fa-sign-out-alt",
    link: signOut,
  },
];

export const DashboardHeader = ({ history }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { data, loading, error } = useQuery(userGet);

  let have_profile;
  if (!loading && !error && data) {
    let user = data.userGet || {};
    have_profile = user.email !== null;
  }

  return (
    <div className={container}>
      <div
        className={classnames(logo, "desktop_only")}
        onClick={() => history.push(frontpage)}
      >
        NOTATA
      </div>

      <div className={classnames(icons, "mobile_only")}>
        {menuItems.map((item, i) => (
          <MenuIconItem key={i} {...item} />
        ))}

        <div className={icon_dropdown_container}>
          <MenuIconItem
            label="More"
            iconClass="fal fa-bars"
            onClick={() => setOpenMenu(true)}
          />

          {openMenu && (
            <div className={drop_down}>
              <div
                className={drop_down_ghost}
                onClick={() => setOpenMenu(false)}
              />

              <div className={drop_down_list}>
                <div
                  className={drop_down_close}
                  onClick={() => setOpenMenu(false)}
                >
                  <i className="fal fa-times" />
                </div>

                {moreMenuItems.map((item, i) => (
                  <MenuIconItem
                    key={`m-${i}`}
                    horizontal
                    {...item}
                    onClick={() => setOpenMenu(false)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
