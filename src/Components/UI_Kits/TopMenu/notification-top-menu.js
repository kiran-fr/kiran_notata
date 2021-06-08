import React, { useState, useEffect } from "react";
import "./notification-top-menu.scss";
import NotificationAlarm from "../../../assets/images/notification-alarm.png";

import { useQuery, useMutation } from "@apollo/client";

import { notificationsGet } from "private/Apollo/Queries";

import { notificationsMarkAllAsSeen } from "private/Apollo/Mutations";

function Notification({ content }) {
  return (
    <div className="notifications__notification">
      <img src={NotificationAlarm} alt="Notification Icon" />
      <p className="notifications__notification__text">{content}</p>
    </div>
  );
}

export default function NotificationsDropDown() {
  const [markAll, res2] = useMutation(notificationsMarkAllAsSeen);

  const [allNotifications, setAllNotifications] = useState([]);

  const { data } = useQuery(notificationsGet);

  useEffect(() => {
    if (data?.notificationsGet) {
      setAllNotifications(data?.notificationsGet);
      async function markAllAsSeen() {
        await markAll();
      }
      markAllAsSeen();
    }
  }, [data]);

  return (
    <div className="notification-menu__dropdown">
      <div className="notifications">
        <div className="notifications">
          {allNotifications.length <= 0 ? (
            <div className="noNotification">No Notification</div>
          ) : (
            allNotifications.map(notif => (
              <Notification
                key={notif.id}
                content={notif.content}
              ></Notification>
            ))
          )}
        </div>
      </div>
      <div className="notification-menu__dropdown__footer">
        See full list of notifications{" "}
        <i class={`fa fa-chevron-down `} aria-hidden="true"></i>
      </div>
    </div>
  );
}
