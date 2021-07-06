import React from "react";
// COMPONETS
import Notification from "./Notification";
// STYLES
import "./Notitifications.scss";

export default function Notifications({ notifications, history }) {
  return (
    <div className="notifications-container-new">
      {notifications.map(notification => (
        <Notification
          key={`notification-${notification.id}`}
          notification={notification}
          history={history}
        />
      ))}
    </div>
  );
}
