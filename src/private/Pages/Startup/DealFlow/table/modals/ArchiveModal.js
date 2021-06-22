import React, { useState } from "react";
import { Modal } from "Components/UI_Kits";
import { OVERVIEWPAGESTATE } from "../../../../srv_startup/pages/constants";
import { useMutation } from "@apollo/client";
import { connectionPut } from "../../../../../Apollo/Mutations";

export default function ArchiveModal({ close, ids }) {
  const [loading, setLoading] = useState(false);
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
