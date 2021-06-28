import React from "react";
// API 
import { useMutation } from "@apollo/client";
import {
  connectionCreate,
  creativeDelete,
} from "../../../../../../Apollo/Mutations";
import notificationMarkAsResolved from "../../../../../../Apollo/Mutations/notificationMarkAsResolved";

// OTHERS 
import { startup_page } from "../../../../../../../definitions";
import { getVal } from "../helpers/utils";

export default function PublicCreativeCreateButtons({ notification, history }) {
  let creativeId = getVal(notification, "creativeId");
  // MUTATIONS 
  const [createConnection, createConnectionRes] = useMutation(connectionCreate);
  const [deleteCreative, deleteCreativeRes] = useMutation(creativeDelete);
  const [markNotification, markNotificationRes] = useMutation(
    notificationMarkAsResolved
  );

  return (
    <>
      <div className="notifications-container-new__notification__action-buttons">
        <button
          className="reject-button"
          onClick={async () => {
            if (deleteCreativeRes.loading) {
              return;
            }

            try {
              let variables = { id: creativeId };
              await deleteCreative({ variables });
            } catch (error) {
              console.log("error");
              return;
            }

            try {
              let variables = { id: notification.id };
              await markNotification({ variables });
            } catch (error) {
              console.log("error", error);
              return;
            }
          }}
        >
          {deleteCreativeRes.loading ? "...deleting" : "delete"}
        </button>

        <button
          className="accept-button"
          onClick={async () => {
            if (createConnectionRes.loading) {
              return;
            }

            let connection;
            try {
              let variables = { creativeId };
              let res = await createConnection({ variables });
              connection = res?.data?.connectionCreate;
            } catch (error) {
              console.log("error");
              return;
            }

            try {
              let variables = { id: notification.id };
              await markNotification({ variables });
            } catch (error) {
              console.log("error", error);
              return;
            }

            history.push(`${startup_page}/company/${connection?.id}?tab=1`);
          }}
        >
          {createConnectionRes.loading ? "...saving" : "save"}
        </button>
      </div>
    </>
  );
}
