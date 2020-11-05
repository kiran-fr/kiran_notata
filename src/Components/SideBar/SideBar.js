import React from "react";

import classnames from "classnames";

import {
  dashboard,
  profile,
  tags,
  group,
  team,
  templates,
  signOut,
  settings,
} from "pages/definitions";

import { sidebar_container, menu_container } from "./SideBar.module.css";

import { MenuIconItem } from "../elements/";

const menuItems = [
  {
    label: "Home",
    iconClass: "fal fa-home",
    link: dashboard,
  },
  {
    label: "Groups",
    iconClass: "fal fa-share-alt",
    link: group,
  },
  // {
  //   label: "Web Form",
  //   iconClass: "fal fa-inbox",
  //   link: external_form,
  // },
  {
    label: "Settings",
    iconClass: "fal fa-cog",
    link: settings,
  },
  {
    label: "Log out",
    iconClass: "fal fa-sign-out-alt",
    link: signOut,
  },
];

const SideBar = ({ location }) => (
  <div className={classnames(sidebar_container, "desktop_only")}>
    <div className={menu_container}>
      {menuItems.map((item, i) => (
        <MenuIconItem
          key={`m-${i}`}
          horizontal
          large
          {...item}
          location={location}
        />
      ))}
    </div>
  </div>
);

export default SideBar;
