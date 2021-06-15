import React, { useState } from "react";
import { Modal } from "../../../../../../../Components/UI_Kits";
import { useMutation } from "@apollo/client";
import { userInvitationResponse } from "../../../../../../Apollo/Mutations";
import { notificationsGet } from "../../../../../../Apollo/Queries";
import notificationMarkAsResolved from "../../../../../../Apollo/Mutations/notificationMarkAsResolved";

export default function AccountInvitationButtons({ notification }) {
  const [rejectModal, setRejectModal] = useState(false);
  const [acceptModal, setAcceptModal] = useState(false);

  const [markResolved] = useMutation(notificationMarkAsResolved, {
    refetchQueries: [{ query: notificationsGet }],
    awaitRefetchQueries: true,
  });

  const [respond, respondRes] = useMutation(userInvitationResponse);

  let accountId = notification?.references?.find(
    ({ key }) => key === "accountId"
  )?.val;

  return (
    <>
      <div className="notifications-container-new__notification__action-buttons">
        <button className="reject-button" onClick={() => setRejectModal(true)}>
          reject
        </button>

        <button className="accept-button" onClick={() => setAcceptModal(true)}>
          accept
        </button>
      </div>

      {rejectModal && (
        <Modal
          title="Reject Team Invitation"
          loading={respondRes.loading}
          close={() => setRejectModal(false)}
          submit={async () => {
            // Save response
            try {
              let variables = {
                accountId,
                response: "REJECT",
              };
              await respond({ variables });
            } catch (error) {
              return console.log("error", error);
            }

            // Mark notification as resolved
            try {
              let variables = {
                id: notification.id,
              };
              await markResolved({ variables });
            } catch (error) {
              return console.log("error", error);
            }

            setRejectModal(false);
          }}
          submitTxt="Reject"
          closeTxt="Cancel"
          children={
            <div className="delete-group-modal-container">
              <div className="description">Reject this invitation</div>
              <div className="remember">
                Are you sure you want to reject this invitation?
              </div>
            </div>
          }
        />
      )}

      {acceptModal && (
        <Modal
          title="Accept Team Invitation"
          loading={respondRes.loading}
          close={() => setAcceptModal(false)}
          submit={async () => {
            try {
              let variables = {
                accountId,
                response: "ACCEPT",
              };
              await respond({ variables });
            } catch (error) {
              return console.log("error", error);
            }

            try {
              let variables = {
                id: notification.id,
              };
              await markResolved({ variables });
              window.location.reload();
            } catch (error) {
              return console.log("error", error);
            }
            setAcceptModal(false);
          }}
          submitTxt="Accept"
          closeTxt="Cancel"
          children={
            <div className="delete-group-modal-container">
              <div className="description">Accept this invitation</div>
              <div className="remember">Remember:</div>
              <div className="options">
                - You will leave your current team
                <br />
                - Your current data will not be tranferred to your new team
                <br />
                {/*- Evaluations will be removed from group<br />*/}
              </div>
            </div>
          }
        />
      )}
    </>
  );
}
