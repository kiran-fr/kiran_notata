import { useMutation } from "@apollo/client";
import React from "react";
import { Modal } from "../../../../../../../Components/UI_Kits";
import { evaluationTemplateGet } from "private/Apollo/Queries";
import { evaluationTemplateSectionDelete } from "private/Apollo/Mutations";

export default function DeleteSectionModal({
  templateId,
  section,
  history,
  close,
}) {
  let options = {
    refetchQueries: [
      {
        query: evaluationTemplateGet,
        variables: {
          id: templateId,
        },
      },
    ],
  };

  const [deleteSection, deleteSectionRes] = useMutation(
    evaluationTemplateSectionDelete,
    options
  );

  console.log("deleteSectionRes", deleteSectionRes);

  return (
    <Modal
      title="Delete Section Template"
      loading={deleteSectionRes.loading}
      submit={async () => {
        try {
          let variables = { id: section?.id };
          await deleteSection({ variables });
        } catch (error) {
          console.log("error", error);
        }
        close();
      }}
      close={close}
      submitTxt="Delete"
      closeTxt="Cancel"
      children={
        <div className="delete-group-modal-container">
          <div className="description">
            Are you sure you want to delete this section permanently?
          </div>
          <div className="remember">Remember:</div>
          <div className="options">
            - This cannot be undone
            <br />
          </div>
        </div>
      }
    />
  );
}
