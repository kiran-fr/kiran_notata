import React, { useState, useRef } from "react";
import { userGet } from "private/Apollo/Queries";
import { useQuery} from "@apollo/client";
import { NavLink, matchPath } from "react-router-dom";
import GroupsImg from "../../../assets/images/navigation-groups.png";
import NewsImg from "../../../assets/images/navigation-news.png";
import ReportsImg from "../../../assets/images/navigation-reports.png";
import SettingsImg from "../../../assets/images/navigation-settings.png";
import StartupsImg from "../../../assets/images/navigation-startups.png";
import DashbaordImg from "../../../assets/images/sidemenu-dashbaord.png";


//links
import {
  dashboard,
  // groups sub paths
  group,
  group_dashboard,
  settings,
  charts,
  signOut,
  // startup pages
  startup_page,
  startup_company_profile,
  pre_profile,
  reports,
  settings_new,
  news,
  dashboard_new,
  news1,
  // settings paths
  tags1,
  funnels1,
  notification,
  web_form,
  your_team,
  setting_profile,
} from "definitions.js";

// Styles
import styles from "./Sidebar.module.css";
import classnames from "classnames";
import authLogo from "../../../assets/images/auth_logo.png";

// * MAIN FUNCTION *

export function SideBarMenu() {
  const [listOpen, setListOpen] = useState(false);
  const [isMobileList, setMobileList] = useState(false);
  const sidebarr = useRef(0);
  const floatingButonn = useRef(0);

  const { data } = useQuery(userGet);
  let user = data?.userGet || {};

  let menuList = [
    {
      label: "Dashboard",
      iconClass: DashbaordImg,
      iconStyle: {},
      link: `${startup_page}/dashboard`,
      subPaths: [`${startup_page}/dashboard`],
    },
    {
      label: "My Startups",
      iconClass: StartupsImg,
      iconStyle: { paddingTop: "2px" },
      link: startup_page,
      subPaths: [startup_page, startup_company_profile],
    },
    {
      label: "Groups",
      iconClass: GroupsImg,
      iconStyle: {},
      link: group,
      subPaths: [group, `${group_dashboard}/:groupId`],
    },
    {
      label: "Reports",
      iconClass: ReportsImg,
      iconStyle: {},
      link: reports,
      subPaths: [reports],
    },
    //  hide for now  (commented by siva)
    {
      label: "News",
      iconClass: NewsImg,
      iconStyle: { paddingTop: "2px" },
      link: news,
      subPaths: [news],
    },
  ];

  const openSidebar = () => {
    sidebarr.current.style.left = "0px";
    floatingButonn.current.style.display = "none";
  };

  const closeSidebar = () => {
    sidebarr.current.style.left = "-290px";
    floatingButonn.current.style.display = "block";
  };
  return (
    <div className={styles.main_sidebar}>
      <div
        ref={sidebarr}
        className={classnames(
          !listOpen ? styles.sidebar_container : styles.sidebar_container1,
          isMobileList
            ? styles.display_mobile_container
            : styles.hide_mobile_container
        )}
      >
        <div className={styles.sidebar_containerInner}>
          <div className={styles.logo_container}>
            <img
              style={{ width: "40px", height: "40px" }}
              src={authLogo}
              alt="logo"
              className={styles.logo}
            />
            <div className={styles.brand}>notata</div>
            <div
              className={styles.mobile_togglerInSidebar}
              onClick={() => setMobileList(false)}
            >
              {" "}
              <i className={`fal fa-chevron-left`} />
            </div>
          </div>

          {/* Toggle open/close */}
          <div
            role="button"
            onClick={() => {
              setListOpen(!listOpen);
              setMobileList(false);
            }}
            className={styles.desktop_sidebarCollapser}
          >
            <span
              className={classnames(
                listOpen ? styles.right_icon : styles.left_icon
              )}
            >
              <i className={`fal fa-chevron-${listOpen ? "right" : "left"}`} />
            </span>
          </div>
          <div>
            <div
              className={classnames(
                styles.mobile_toggler,
                isMobileList
                  ? styles.hide_floating_button
                  : styles.display_floating_button
              )}
              ref={floatingButonn}
              onClick={() => setMobileList(true)}
            >
              {" "}
              <i className={`fa fa-bars`} />
            </div>
          </div>
          {/* Main navigation icons */}
          <div className={styles.menu_lists}>
            {menuList.map((item, i) => (
              <React.Fragment>
                <div key={i} className={styles.menu_list}>
                  <NavLink
                    exact={true}
                    to={item.link}
                    onClick={() => setMobileList(false)}
                    isActive={(match, location) => {
                      let isMatch = match ? true : false;
                      if (!isMatch) {
                        for (var i = 0; i < item.subPaths.length; i++) {
                          let matchPathResult = matchPath(location.pathname, {
                            path: item.subPaths[i],
                          });
                          isMatch = matchPathResult
                            ? matchPathResult.isExact
                            : false;
                          if (isMatch) break;
                        }
                      }
                      return isMatch;
                    }}
                    activeClassName={classnames(
                      !listOpen ? styles.active_open : styles.active_close
                    )}
                  >
                    <div className={styles.icons} style={item.iconStyle}>
                      {/* <i
                        className={item.iconClass}
                        style={{
                          marginLeft: item.label === "Groups" && "-3px",
                        }}
                      /> */}
                      <img src={item.iconClass} className="" />
                    </div>
                    <p className={styles.list}>{item.label}</p>
                  </NavLink>
                </div>
              </React.Fragment>
            ))}

            <div className={styles.menu_list + " " + styles.menu_listSettings}>
              <NavLink
                exact={true}
                to={`${startup_page}/settings`}
                onClick={() => setMobileList(false)}
                activeClassName={classnames(
                  !listOpen ? styles.active_open : styles.active_close
                )}
                isActive={(match, location) => {
                  let isMatch = match ? true : false;
                  let subPaths = [
                    tags1,
                    funnels1,
                    notification,
                    web_form,
                    your_team,
                    setting_profile,
                  ];
                  if (!isMatch) {
                    for (var i = 0; i < subPaths.length; i++) {
                      let matchPathResult = matchPath(location.pathname, {
                        path: subPaths[i],
                      });
                      isMatch = matchPathResult
                        ? matchPathResult.isExact
                        : false;
                      if (isMatch) break;
                    }
                  }
                  return isMatch;
                }}
              >
                <div className={styles.icons}>
                  <img src={SettingsImg} className="" />
                </div>
                <p className={styles.list}>Settings</p>
              </NavLink>
            </div>
            <div
              className={styles.menu_list}
              className={styles.profile_item}
              style={{ paddingTop: "30px", borderTop: "1px solid #BFBFBF" }}
            >
              <NavLink
                exact={true}
                to={setting_profile}
                onClick={() => setMobileList(false)}
                activeClassName={classnames(
                  !listOpen ? styles.active_open : styles.active_close
                )}
                style={{ display: "flex" }}
              >
                <div className={styles.icons} >
                  <img
                    src="https://www.clipartmax.com/png/small/171-1717870_stockvader-predicted-cron-for-may-user-profile-icon-png.png"
                    alt="img"
                  />
                </div>
                <p className={styles.list}>{user.given_name} {user.family_name}</p>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
