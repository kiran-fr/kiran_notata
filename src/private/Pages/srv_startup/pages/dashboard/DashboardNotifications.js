import React from "react";
// API 
import { useQuery } from "@apollo/client";
import { notificationsGet } from "../../../../Apollo/Queries";
// COMPONENTS 
import { Loader } from "../../../../../Components/elements";
import Notifications from "./Notifications/Notifications";

// OTHERS
import { notification } from "../../../../../definitions";

export default function DashboardNotifications({ history }) {
  // QUERIES 
  const { data, loading } = useQuery(notificationsGet);

  // DATA MAPS 
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
