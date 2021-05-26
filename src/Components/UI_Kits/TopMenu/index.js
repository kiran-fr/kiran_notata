import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { userGet, notificationsGet } from "private/Apollo/Queries";
import { notifications_page } from "definitions.js";
import { History } from "history";

// STYLE
import styles from "./TopMenu.module.css";

const classnames = require("classnames");

export function TopMenu() {
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
        <div style={{ position: "absolute", pointerEvents: "none" }}>
          <div>user profile</div>
          <div>team</div>
          <div>settings</div>
          <div>log out</div>
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
        <Link to={notifications_page}>
          <i className="fas fa-bell"></i>
          {unseen.length !== 0 && <div className={styles.circle}></div>}
        </Link>

        {notificationsOpen && (
          <div style={{ position: "absolute" }}>
            <pre>{JSON.stringify(notifications, null, 2)}</pre>
          </div>
        )}
      </span>

      <div className={styles.profile}>
        <div className={styles.profile_pic}>
          <Link to="">n</Link>
        </div>
        <p className={styles.profile_name}>
          {user.given_name} {user.family_name}
          {/*Profile Name*/}
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
