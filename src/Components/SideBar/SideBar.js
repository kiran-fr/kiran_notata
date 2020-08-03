import React from "react";

import classnames from "classnames";

// import {
//   dashboard,
//   profile,
//   report,
//   inbox,
//   activities,
//   tags,
//   groups,
//   settings,
//   team,
//   templates,
//   signOut,
// } from "../../routes";

import { sidebar_container, menu_container } from "./SideBar.module.css";

import { MenuIconItem } from "../elements/NotataComponents/";

let dashboard = "/dashboard";
let profile = "/dashboard/profile";
let report = "/dashboard/report";
let inbox = "/dashboard/inbox";
let activities = "/dashboard/activities";
let tags = "/dashboard/tags";
let groups = "/dashboard/groups";
let settings = "/dashboard/settings";
let team = "/dashboard/team";
let templates = "/dashboard/templates";
let signOut = "/signout";

const menuItems = [
  {
    label: "Home",
    iconClass: "fal fa-home",
    link: dashboard
  },
  {
    label: "Inbox",
    iconClass: "fal fa-inbox",
    notifications: 0,
    link: inbox
  },
  {
    label: "Activities",
    iconClass: "fal fa-tasks",
    notifications: 0,
    link: activities
  },
  {
    label: "Reports",
    iconClass: "fal fa-chart-bar",
    link: report
  },
  {
    label: "Templates",
    iconClass: "fal fa-copy",
    link: templates
  },
  {
    label: "Tags",
    iconClass: "fal fa-tag",
    link: tags
  },
  {
    label: "Profile",
    iconClass: "fal fa-user",
    link: profile
  },
  {
    label: "Team",
    iconClass: "fal fa-users",
    link: team
  },
  {
    label: "Groups",
    iconClass: "fal fa-share-alt",
    link: groups
  },
  {
    label: "Settings",
    iconClass: "fal fa-cog",
    link: settings
  },
  {
    label: "Log out",
    iconClass: "fal fa-sign-out-alt",
    link: signOut
  }
];

const SideBar = () => (
  <div className={classnames(sidebar_container, "desktop_only")}>
    <div className={menu_container}>
      {menuItems.map((item, i) => (
        <MenuIconItem key={`m-${i}`} horizontal large {...item} />
      ))}
    </div>
  </div>
);

export default SideBar;
