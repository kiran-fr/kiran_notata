import DeleteStartup from "../components/DeleteStartup";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import React from "react";

import { useMutation } from "@apollo/client";
import {
  connectionPut,
  connectionDelete,
} from "../../../../../../../Apollo/Mutations";
import {
  archive_page,
  startup_page,
} from "../../../../../../../../definitions";

export default function DeleteModal({ connection, close, history }) {
  const [archiveConnection, archiveConnectionRes] = useMutation(connectionPut);
  const [deleteConnection, deleteConnectionRes] = useMutation(connectionDelete);

  return (
    <Modal
      title="Delete startup"
      loading={archiveConnectionRes.loading || deleteConnectionRes.loading}
      submit={async () => {
        let variables = {
          id: connection.id,
        };

        try {
          await deleteConnection({ variables });
        } catch (error) {
          return console.log("error", error);
        }

        history.push(startup_page);
      }}
      close={close}
      submitTxt="Delete"
      submitButtonStyle="secondary"
      closeTxt="CANCEL"
      intermidate={async () => {
        let variables = {
          id: connection.id,
          input: {
            archived: true,
          },
        };
        try {
          await archiveConnection({ variables });
        } catch (error) {
          return console.log("error", error);
        }

        history.push(archive_page);
      }}
      intermidateTxt="Archive"
      children={<DeleteStartup />}
    />
  );
}
