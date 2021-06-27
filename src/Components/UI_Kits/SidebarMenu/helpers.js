// OTHERS 
import nav_group from "../../../assets/images/nav_group.svg";
import nav_newsicon from "../../../assets/images/nav_newsicon.svg";
import nav_report from "../../../assets/images/nav_report.svg";
import nav_suitcase from "../../../assets/images/nav_suitcase.svg";
import nav_bar from "../../../assets/images/nav_bar.svg";

//links
import {
    // groups sub paths
    group,
    group_dashboard,
    // startup pages
    startup_page,
    startup_company_profile,
    reports,
    news,
  } from "definitions.js";

export const menuListArr = [
    {
      label: "Dashboard",
      iconClass: nav_bar,
      iconStyle: {},
      link: `${startup_page}/dashboard`,
      subPaths: [`${startup_page}/dashboard`],
    },
    {
      label: "My Startups",
      iconClass: nav_suitcase,
      iconStyle: { paddingTop: "2px" },
      link: startup_page,
      subPaths: [startup_page, startup_company_profile],
    },
    {
      label: "Groups",
      iconClass: nav_group,
      iconStyle: {},
      link: group,
      subPaths: [group, `${group_dashboard}/:groupId`],
    },
    {
      label: "Reports",
      iconClass: nav_report,
      iconStyle: {},
      link: reports,
      subPaths: [reports],
    },
    {
      label: "News",
      iconClass: nav_newsicon,
      iconStyle: { paddingTop: "2px" },
      link: news,
      subPaths: [news],
    },
  ];
