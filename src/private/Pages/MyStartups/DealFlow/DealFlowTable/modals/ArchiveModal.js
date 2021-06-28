import React, { useState } from "react";
// API
import { connectionPut } from "../../../../../Apollo/Mutations";
// COMPONENT
import { Modal } from "Components/UI_Kits";
import { useMutation } from "@apollo/client";

export default function ArchiveModal({ close, ids }) {
  // STATES
  const [loading, setLoading] = useState(false);
  // MUTATION
  const [archive] = useMutation(connectionPut);

  async function archiveConnections() {
    if (loading) return;
    setLoading(true);

    let promises = ids.map(id => {
      let variables = {
        id,
        input: { archived: true },
      };
      return archive({ variables });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.log("error", error);
    }

    setLoading(false);
    close();
  }

  return (
    <Modal
      title="Archive startups"
      loading={loading}
      submit={archiveConnections}
      close={close}
      submitTxt="Archive"
      closeTxt="Cancel"
      children={
        <div className="delete-group-modal-container">
          <div className="description">
            Are you sure you want to archive {ids.length} startups?
          </div>
          {/*<div className="remember">Remember:</div>*/}
          {/*<div className="options">*/}
          {/*  - This cannot be undone*/}
          {/*  <br />*/}
          {/*</div>*/}
        </div>
      }
    />
  );
}
