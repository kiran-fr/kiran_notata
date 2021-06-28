import React, { useState } from "react";
// API 
import { useMutation, useQuery } from "@apollo/client";
import { groupUserInvitationResponse } from "../../../../../../Apollo/Mutations";
import { groupInvitationsGet, userGet } from "../../../../../../Apollo/Queries";
import notificationMarkAsResolved from "../../../../../../Apollo/Mutations/notificationMarkAsResolved";

// OTHERS 
import { getVal } from "../helpers/utils";

export default function GroupInvitationButtons({ notification }) {
  // STATES 
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // QUERIES 
  let { data } = useQuery(userGet);
  let user = data?.userGet;

  // MUTATIONS
  const [respond] = useMutation(groupUserInvitationResponse, {
    refetchQueries: [{ query: groupInvitationsGet }],
  });

  const [markNotification] = useMutation(notificationMarkAsResolved);

  let groupId = getVal(notification, "groupId");

  return (
    <>
      <div className="notifications-container-new__notification__action-buttons">
        <button
          className="reject-button"
          onClick={async () => {
            if (rejecting) return;

            setRejecting(true);
            let variables = {
              groupId: groupId,
              email: user?.email,
              response: "REJECT",
            };

            try {
              await respond({ variables });
            } catch (error) {
              console.log("error", error);
            }

            try {
              let variables = { id: notification.id };
              await markNotification({ variables });
            } catch (error) {
              console.log("error", error);
              return;
            }

            setRejecting(false);
          }}
        >
          {rejecting ? "...rejecting" : "reject"}
        </button>

        <button
          className="accept-button"
          onClick={async () => {
            if (accepting) return;

            setAccepting(true);

            let variables = {
              groupId: groupId,
              email: user?.email,
              response: "ACCEPT",
            };

            try {
              await respond({ variables });
            } catch (error) {
              console.log("error", error);
            }

            try {
              let variables = { id: notification.id };
              await markNotification({ variables });
            } catch (error) {
              console.log("error", error);
              return;
            }

            setAccepting(false);
          }}
        >
          {accepting ? "...accepting" : "accept"}
        </button>
      </div>
    </>
  );
}
