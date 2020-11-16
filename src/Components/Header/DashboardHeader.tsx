import React, { useState } from "react";

import { frontpage } from "pages/definitions";
import { History } from "history";

// STYLE
import styles from "./Header.module.css";

import { MenuIconItem } from "../elements/";
import { useDispatch, useSelector } from "react-redux";
import { hideMobileNavigationMenu, showMobileNavigationMenu } from "../../Modules/menu";

const classnames = require("classnames");

export const DashboardHeader = ({ history, location }: {history: History, location: any}) => {
  const dispatch = useDispatch();
  const visibleMobileLeftMenu = useSelector((state: any) => state.menu.visibleMobileLeftMenu);

  return (
    <div className={styles.container}>
        <div className={classnames(styles.header_block_logo, "desktop_only")}>
          <div
            className={styles.logo}
            onClick={() => history.push(frontpage)}
          >
            NOTATA
          </div>

        </div>
        <div className={classnames(styles.header_block_logo, "desktop_only")}> </div>

      <div className={classnames(styles.icons, "mobile_only")}>
        <div onClick={() => !visibleMobileLeftMenu ?
          dispatch(showMobileNavigationMenu()) : dispatch(hideMobileNavigationMenu())} className={styles.hamburger_menu}>
          <i className="fas fa-bars"/>
        </div>
      </div>
    </div>
  );
};
