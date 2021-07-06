import React, { useState } from "react";

// API STUFF
import { useQuery, useMutation } from "@apollo/client";
import { creativeTemplateGet } from "private/Apollo/Queries";
import { creativeUpdate } from "private/Apollo/Mutations";

// GENERAL COMPONENTS
import { GhostLoader } from "Components/elements";

// CUSTOM COMPONENTS
import InviteStartupModal from "../modals/InviteStartupModal";
import EditStartupContent from "./EditStartupContent";

// STYLES
import "./EditStartupInfo.scss";

export default function EditStartupInfo({ backToInfoPage, connection }) {
  // STATES
  const [inviteStartUpModal, setInviteStartUpModal] = useState(false);

  // QUERIES
  const { data, loading, error } = useQuery(creativeTemplateGet);

  // MUTATIONS
  const [mutateCreativeUpdate, mutateCreativeUpdateRes] = useMutation(
    creativeUpdate
  );

  // MAPS AND REDUCERS
  let creativeTemplate = data?.creativeTemplateGet;

  // Loader
  if (!data && loading) {
    return <GhostLoader />;
  }

  return (
    <>
      <div className="row tab-panel-container">
        <div className="card col-sm-12">
          <div className="row card-notification-bar">
            <div className="text">
              Invite startup to fill in this information.
              <div className="btn" onClick={() => setInviteStartUpModal(true)}>
                {connection?.creative?.sharedWithEmail
                  ? "Edit"
                  : "Invite MyStartups"}
              </div>
            </div>
          </div>

          <EditStartupContent
            template={creativeTemplate}
            creative={connection?.creative}
            connectionId={connection?.id}
            backToInfoPage={backToInfoPage}
            saveCreative={async input => {
              console.log("input", input);

              try {
                let variables = {
                  id: connection?.creative?.id,
                  input,
                };
                await mutateCreativeUpdate({ variables });
              } catch (error) {
                console.log("error", error);
              }
            }}
          />

          {mutateCreativeUpdateRes?.data && !mutateCreativeUpdateRes?.loading && (
            <div
              style={{
                fontSize: "12px",
                color: "#53cab2",
                paddingRight: "38px",
                position: "absolute",
                right: 0,
                bottom: "17px",
              }}
            >
              Successfully saved
            </div>
          )}
        </div>
      </div>

      {inviteStartUpModal && (
        <InviteStartupModal
          connection={connection}
          close={() => {
            setInviteStartUpModal(false);
          }}
        />
      )}
    </>
  );
}
