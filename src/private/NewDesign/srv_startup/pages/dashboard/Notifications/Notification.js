import notificationProfile from "../../../../../../assets/images/dashboard-notifictaion-profile.png";
import moment from "moment";
import React from "react";
import AccountInvitationButtons from "./ActionButtons/AccountInvitationButtons";
import PublicCreativeCreateButtons from "./ActionButtons/PublicCreativeCreateButtons";
import PublicCreativeUpdateButtons from "./ActionButtons/PublicCreativeUpdateButtons";
import ConnectionCreateButtons from "./ActionButtons/ConnectionCreateButtons";
import GroupInvitationButtons from "./ActionButtons/GroupInvitationButtons";

import {
  ACCOUNT_INVITATION,
  CONNECTION_CREATE,
  GROUP_INVITATION,
  PUBLIC_CREATIVE_CREATE,
  PUBLIC_CREATIVE_UPDATE,
} from "./helpers/notificationTypes";

function NotificationIcon({ notificationType }) {
  switch (notificationType) {
    case ACCOUNT_INVITATION:
      return <i className="fas fa-user-plus" />;

    case PUBLIC_CREATIVE_CREATE:
      return <i className="fas fa-layer-plus" />;

    case PUBLIC_CREATIVE_UPDATE:
      return <i className="fas fa-file-edit" />;

    case GROUP_INVITATION:
      return <i className="fas fa-users" />;

    default:
      return <i className="fas fa-newspaper" />;
  }
}

export default function Notification({ notification, history }) {
  console.log("notification", notification);

  let { notificationType, resolved } = notification;

  return (
    <div className="notifications-container-new__notification">
      <NotificationIcon notificationType={notificationType} />

      <div className="notifications-container-new__notification__text">
        <div className="notifications-container-new__notification__text__message">
          {notification.content}
        </div>

        {!resolved && notificationType === ACCOUNT_INVITATION && (
          <AccountInvitationButtons notification={notification} />
        )}

        {!resolved && notificationType === PUBLIC_CREATIVE_CREATE && (
          <PublicCreativeCreateButtons
            notification={notification}
            history={history}
          />
        )}

        {!resolved && notificationType === PUBLIC_CREATIVE_UPDATE && (
          <PublicCreativeUpdateButtons
            notification={notification}
            history={history}
          />
        )}

        {!resolved && notificationType === CONNECTION_CREATE && (
          <ConnectionCreateButtons
            notification={notification}
            history={history}
          />
        )}

        {!resolved && notificationType === GROUP_INVITATION && (
          <GroupInvitationButtons
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
