import notificationProfile from "../../../../../../assets/images/dashboard-notifictaion-profile.png";
import moment from "moment";
import React from "react";
import AccountInvitationButtons from "./ActionButtons/AccountInvitationButtons";
import PublicCreativeCreateButtons from "./ActionButtons/PublicCreativeCreateButtons";
import PublicCreativeUpdateButtons from "./ActionButtons/PublicCreativeUpdateButtons";

function NotificationIcon({ notificationType }) {
  switch (notificationType) {
    case "ACCOUNT_INVITATION":
      return <i className="fas fa-user-plus" />;

    case "PUBLIC_CREATIVE_CREATE":
      return <i className="fas fa-layer-plus" />;

    case "PUBLIC_CREATIVE_UPDATE":
      return <i className="fas fa-file-edit" />;

    default:
      return <i className="fas fa-newspaper" />;
  }
}

export default function Notification({ notification, history }) {
  console.log("notification", notification);

  let { notificationType, resolved } = notification;

  return (
    <div className="notifications-container-new__notification">
      {/*<img src={notificationProfile} />*/}

      <NotificationIcon notificationType={notificationType} />

      <div className="notifications-container-new__notification__text">
        <div className="notifications-container-new__notification__text__message">
          {notification.content}
        </div>

        {!resolved && notificationType === "ACCOUNT_INVITATION" && (
          <AccountInvitationButtons notification={notification} />
        )}

        {!resolved && notificationType === "PUBLIC_CREATIVE_CREATE" && (
          <PublicCreativeCreateButtons
            notification={notification}
            history={history}
          />
        )}

        {!resolved && notificationType === "PUBLIC_CREATIVE_UPDATE" && (
          <PublicCreativeUpdateButtons
            notification={notification}
            history={history}
          />
        )}

        <div className="notifications-container-new__notification__text__hour-ago">
          {moment(notification.createdAt).format("lll")}
        </div>
      </div>
    </div>
  );
}
