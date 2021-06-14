import React from "react";
import Notification from "./Notification";
import "./Notitifications.scss";

export default function Notifications({ notifications, history }) {
  return (
    <div className="notifications-container-new">
      {notifications.map(notification => (
        <Notification notification={notification} history={history} />
      ))}
    </div>
  );
}
