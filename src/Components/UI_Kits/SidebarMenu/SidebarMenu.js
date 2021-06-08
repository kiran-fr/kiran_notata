import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import GroupsImg from "../../../assets/images/navigation-groups.png";
import NewsImg from "../../../assets/images/navigation-news.png";
import ReportsImg from "../../../assets/images/navigation-reports.png";
import SettingsImg from "../../../assets/images/navigation-settings.png";
import StartupsImg from "../../../assets/images/navigation-startups.png";

//links
import {
  dashboard,
  group,
  settings,
  charts,
  signOut,
  startup_page,
  pre_profile,
  reports,
  settings_new,
  news,
  dashboard_new,
  news1,
} from "definitions.js";

// Styles
import styles from "./Sidebar.module.css";
import classnames from "classnames";
import authLogo from "../../../assets/images/auth_logo.png";

// * MAIN FUNCTION *

export function SideBarMenu() {
  const [listOpen, setListOpen] = useState(false);
  const sidebarr = useRef(0);
  const floatingButonn = useRef(0);
  let menuList = [
    {
      label: "Dashboard",
      iconClass: "fas fa-signal-alt-3",
      iconStyle: {},
      link: `${startup_page}/components/company/dashboard`,
    },
    {
      label: "My Startups",
      iconClass: StartupsImg,
      iconStyle: { paddingTop: "2px" },
      link: startup_page,
    },
    {
      label: "Groups",
      iconClass: GroupsImg,
      iconStyle: {},
      link: group,
    },
    {
      label: "Reports",
      iconClass: "fas fa-file-alt",
      iconStyle: { paddingTop: "7px" },
      link: `${startup_page}/report/reports`,
    },
    //  hide for now  (commented by siva)
    {
      label: "News",
      iconClass: NewsImg,
      iconStyle: { paddingTop: "2px" },
      link: news1,
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
          !listOpen ? styles.sidebar_container : styles.sidebar_container1
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
              onClick={closeSidebar}
            >
              {" "}
              <i className={`fal fa-chevron-right`} />
            </div>
          </div>

          {/* Toggle open/close */}
          <div
            role="button"
            onClick={() => {
              setListOpen(!listOpen);
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
              className={styles.mobile_toggler}
              ref={floatingButonn}
              onClick={openSidebar}
            >
              {" "}
              <i className={`fal fa-chevron-${listOpen ? "right" : "left"}`} />
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
                activeClassName={classnames(
                  !listOpen ? styles.active_open : styles.active_close
                )}
              >
                <div className={styles.icons}>
                  <i className="fas fa-cog" />
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
                to={pre_profile}
                activeClassName={classnames(
                  !listOpen ? styles.active_open : styles.active_close
                )}
                style={{ display: "flex" }}
              >
                <div className={styles.icons} style={{ marginTop: "5px" }}>
                  <img
                    src="https://www.clipartmax.com/png/small/171-1717870_stockvader-predicted-cron-for-may-user-profile-icon-png.png"
                    alt="img"
                  />
                </div>
                <p className={styles.list}>Profile Name</p>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
