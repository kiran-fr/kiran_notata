import React, { useState } from "react";

import {
  frontpage,
  dashboard,
  group,
  signOut,
  settings,
} from "pages/definitions";

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

// const moreMenuItems = [
//   // {
//   //   label: "Templates",
//   //   iconClass: "fal fa-copy",
//   //   link: templates,
//   // },
//   {
//     label: "Tags",
//     iconClass: "fal fa-tag",
//     link: tags,
//   },
//   // {
//   //   label: "Profile",
//   //   iconClass: "fal fa-user",
//   //   link: profile,
//   // },
//   {
//     label: "Team",
//     iconClass: "fal fa-users",
//     link: team,
//   },
//   // {
//   //   label: "Groups",
//   //   iconClass: "fal fa-share-alt",
//   //   link: group,
//   // },
//   // {
//   //   label: "Settings",
//   //   iconClass: "fal fa-cog",
//   //   link: settings,
//   // },
//   {
//     label: "Log out",
//     iconClass: "fal fa-sign-out-alt",
//     link: signOut,
//   },
// ];

export const DashboardHeader = ({ history, location }) => {
  const [openMenu, setOpenMenu] = useState(false);

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
          <MenuIconItem key={i} {...item} location={location} />
        ))}
      </div>
    </div>
  );
};
