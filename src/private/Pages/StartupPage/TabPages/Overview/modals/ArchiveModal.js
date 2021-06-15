import React from "react";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import { useMutation } from "@apollo/client";
import { connectionPut } from "../../../../../Apollo/Mutations";
import { archive_page } from "../../../../../../definitions";

export default function ArchiveModal({ connection, close, history }) {
  const [archive, archiveRes] = useMutation(connectionPut);

  return (
    <Modal
      title="Archive startup"
      loading={archiveRes.loading}
      submit={async () => {
        let variables = {
          id: connection.id,
          input: {
            archived: true,
          },
        };
        try {
          await archive({ variables });
        } catch (error) {
          return console.log("error", error);
        }

        history.push(archive_page);
      }}
      close={close}
      submitTxt="Archive"
      closeTxt="CANCEL"
      children={
        <div className="archive-modal-description">
          After archiving startup still will be available in reports section.
        </div>
      }
    />
  );
}
