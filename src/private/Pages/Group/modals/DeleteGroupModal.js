import React from "react";
import { useMutation } from "@apollo/client";
import { groupDelete } from "../../../Apollo/Mutations";
import { groupsGetV2 } from "../../../Apollo/Queries";
import { Modal } from "Components/UI_Kits/Modal/Modal";

export default function DeleteGroupModal({ group, close }) {
  const [deleteGroup, { loading }] = useMutation(groupDelete, {
    refetchQueries: [{ query: groupsGetV2 }],
    awaitRefetchQueries: true,
  });

  async function save() {
    if (loading) return;
    try {
      await deleteGroup({ variables: { id: group.id } });
    } catch (error) {
      console.log("error", error);
    }
    close();
  }

  return (
    <Modal
      title="Delete group"
      loading={loading}
      submit={save}
      close={close}
      submitTxt="Delete"
      closeTxt="Cancel"
      submitButtonStyle="secondary"
      children={
        <div className="delete-group-modal-container">
          <div className="description">
            Are you sure you want to delete this group permanently?
          </div>
          <div className="remember">Remember:</div>
          <div className="options">
            - Startups will be removed from group <br />
            - Comments will be deleted <br />
            - Evaluations will be removed from group <br />
          </div>
        </div>
      }
    />
  );
}
