import React, { useState, useEffect } from "react";
import "./notification-top-menu.scss";
import NotificationAlarm from "../../../assets/images/notification-alarm.png";

import { useQuery, useMutation } from "@apollo/client";

import { notificationsGet } from "private/Apollo/Queries";
import { useHistory } from 'react-router-dom';


import { notificationsMarkAllAsSeen } from "private/Apollo/Mutations";

import { notification } from "definitions";
import notificationProfile from "../../../assets/images/dashboard-notifictaion-profile.png";
import moment from "moment";

function Notification({ content, notificationCreatedAt }) {
  return (
    <div className="notifications__notification">
      <img src={notificationProfile} alt="Notification Icon" />
      <div className="notifications__notification__text">
        <span>{content}</span>
        <span className="notifications__notification__text__hour-ago">
          {moment(notificationCreatedAt).format("ll")}
        </span>
      </div>
    </div>
  );
}

export default function NotificationsDropDown() {
 
const hist = useHistory();
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
            allNotifications
              .slice(0, 3)
              .map(notif => (
                <Notification
                  key={notif.id}
                  content={notif.content}
                  notificationCreatedAt={notif.createdAt}
                ></Notification>
              ))
          )}
        </div>
      </div>
      <div
        className="notification-menu__dropdown__footer"
        onClick={() => hist.push(notification)}
      >
        See full list of notifications{" "}
        {/* <i class={`fa fa-chevron-down `} aria-hidden="true"></i> */}
      </div>
    </div>
  );
}
