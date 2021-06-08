import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { userGet, notificationsGet } from "private/Apollo/Queries";
import { notifications_page } from "definitions.js";
import { settings, signOut, setting_profile, your_team } from "definitions.js";
// import { History } from "history";
import NotificationsDropDown from "./notification-top-menu";
import ProfilePic from "../../../assets/images/profile-pic.png";

// STYLE
import styles from "./TopMenu.module.css";

const classnames = require("classnames");

export function TopMenu({ history }) {
  const { data } = useQuery(userGet);
  let user = data?.userGet || {};

  const { data: nData } = useQuery(notificationsGet);
  let notifications = nData?.notificationsGet || [];

  let unseen = notifications.filter(({ seen }) => !seen);

  const [listOpen, setListOpen] = useState(false);
  const [notificationsOpen, setNotificatonsOpen] = useState(false);

  return (
    <div className={styles.top_menu_container}>
      {listOpen && (
        <div className={styles.profile_pic_dropdown}>
          <div
            className={styles.profile_pic_dropdown_item}
            onClick={() => history.push(setting_profile)}
          >
            user profile
          </div>
          <div
            className={styles.profile_pic_dropdown_item}
            onClick={() => history.push(your_team)}
          >
            team
          </div>

          <div
            className={styles.profile_pic_dropdown_item}
            onClick={() => history.push(settings)}
          >
            settings
          </div>

          <div
            className={styles.profile_pic_dropdown_item}
            onClick={() => history.push(signOut)}
          >
            log out
          </div>
        </div>
      )}

      <span>
        <i className="fas fa-question-circle"></i>
      </span>

      <span>
        <i className="fas fa-alarm-clock"></i>
      </span>

      <span
        onMouseEnter={() => setNotificatonsOpen(true)}
        onMouseLeave={() => setNotificatonsOpen(false)}
      >
        <Link to="">
          <i
            className={`fas fa-bell ${
              notificationsOpen ? styles.notification_icon_selected : ""
            }`}
          ></i>
          {unseen.length !== 0 && <div className={styles.circle}></div>}
        </Link>
        {notificationsOpen && <NotificationsDropDown />}

        {/* {notificationsOpen && (
          <div style={{ position: "absolute" }}>
            <pre>{JSON.stringify(notifications, null, 2)}</pre>
          </div>
        )} */}
      </span>

      <div className={styles.profile}>
        <img src={ProfilePic} className={styles.profile_pic_img} />
        <p className={styles.profile_name}>
          {user.given_name} {user.family_name}
        </p>
        <div
          role="button"
          onClick={() => {
            setListOpen(!listOpen);
          }}
        >
          <span className={styles.angle_icon}>
            <i className={`fal fa-angle-${listOpen ? "up" : "down"}`} />
          </span>
        </div>
      </div>

      {/* <div className={classnames(styles.header_block_logo, "desktop_only")}>
        <div className={styles.logo} onClick={() => history.push(frontpage)}>
          NOTATA
        </div>
      </div> */}
    </div>
  );
}
