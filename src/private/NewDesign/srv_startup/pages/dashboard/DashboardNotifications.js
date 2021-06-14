import React from "react";
// import { notifications_page } from "../../../../../definitions";
import { notification } from "../../../../../definitions";
import { useQuery } from "@apollo/client";
import { notificationsGet } from "../../../../Apollo/Queries";
import moment from "moment";
import { Loader } from "../../../../../Components/elements";
import Notifications from "./Notifications/Notifications";

export default function DashboardNotifications({ history }) {
  const { data, loading } = useQuery(notificationsGet);

  let notifications = data?.notificationsGet || [];

  return (
    <div className="card dashboard-container__notification">
      <div className="dashboard-container__notification__heading">
        Notifications
      </div>

      {!data && loading && <Loader />}

      {!notifications.length && (
        <div
          style={{
            marginTop: "50px",
            marginBottom: "50px",
            color: "#969ba3",
            fontSize: "12px",
          }}
        >
          You have no notifications
        </div>
      )}

      <Notifications
        notifications={notifications.slice(0, 4)}
        history={history}
      />

      <div
        className="dashboard-container__notification__more-updates"
        onClick={() => history.push(notification)}
      >
        View notifications
      </div>
    </div>
  );
}
