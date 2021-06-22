import React, { useState, useEffect } from "react";
import "./notification-top-menu.scss";
import NotificationAlarm from "../../../assets/images/notification-alarm.png";

import { useQuery, useMutation } from "@apollo/client";

import { notificationsGet } from "private/Apollo/Queries";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();

  const { data } = useQuery(notificationsGet);
  const notifications = data?.notificationsGet || [];

  return (
    <div className="notification-menu__dropdown">
      <div className="notifications">
        <div className="notifications">
          {notifications.length <= 0 ? (
            <div className="noNotification">No Notification</div>
          ) : (
            notifications
              .slice(0, 3)
              .map(notification => (
                <Notification
                  key={notification.id}
                  content={notification.content}
                  notificationCreatedAt={notification.createdAt}
                />
              ))
          )}
        </div>
      </div>
      <div
        className="notification-menu__dropdown__footer"
        onClick={() => history.push(notifications)}
      >
        VIEW NOTIFICATIONS
      </div>
    </div>
  );
}
