import notificationProfile from "../../../../../assets/images/dashboard-notifictaion-profile.png";
import notificationConversation from "../../../../../assets/images/dashboard-notifictaion-converstation.png";
import React from "react";
// import { notifications_page } from "../../../../../definitions";
import { notification } from "../../../../../definitions";
import { useQuery } from "@apollo/client";
import { notificationsGet } from "../../../../Apollo/Queries";
import moment from "moment";
import { Loader } from "../../../../../Components/elements";

export default function DashboardNotifications({ history }) {
  const { data, loading } = useQuery(notificationsGet);

  let notifications = data?.notificationsGet || [];

  return (
    <div className="card dashboard-container__notification">
      <div className="dashboard-container__notification__heading">
        Notifications
      </div>

      {!data && loading && <Loader />}

      {notifications.slice(0, 4).map(notification => (
        <div
          className="dashboard-container__notification__notification"
          key={notification.id}
        >
          <img src={notificationProfile} />
          <div className="dashboard-container__notification__notification__text">
            <span>{notification.content}</span>
            {/*<span className="dashboard-container__notification__notification__text__username">*/}
            {/*  Stephanie Wykoff*/}
            {/*</span>*/}
            {/*  accepted your invitation to join (as a member) group{" "}*/}
            {/*  <span className="dashboard-container__notification__notification__text__username">*/}
            {/*  Band of Angels*/}
            {/*</span>*/}
            <div className="dashboard-container__notification__notification__text__hour-ago">
              {moment(notification.createdAt).format("ll")}
            </div>
          </div>
        </div>
      ))}

      <div
        className="dashboard-container__notification__more-updates"
        onClick={() => history.push(notification)}
      >
        View notifications
      </div>
    </div>
  );
}
