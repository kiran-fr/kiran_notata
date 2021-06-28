import React from "react";
import { useMutation } from "@apollo/client";
import { groupLeave } from "../../../Apollo/Mutations";
import { groupsGetV2 } from "../../../Apollo/Queries";
import { Modal } from "Components/UI_Kits/Modal/Modal";

export default function LeaveGroupModal({ group, close }) {
  const [leaveGroup, { loading }] = useMutation(groupLeave, {
    refetchQueries: [{ query: groupsGetV2 }],
    awaitRefetchQueries: true,
  });

  async function save() {
    if (loading) {
      return;
    }
    try {
      await leaveGroup({ variables: { id: group.id } });
    } catch (error) {
      console.log("error", error);
    }
    close();
  }

  return (
    <Modal
      title="Leave group"
      loading={loading}
      submit={save}
      close={close}
      submitTxt="Leave"
      closeTxt="Cancel"
      submitButtonStyle="secondary"
      children={
        <div className="delete-group-modal-container">
          <div className="description">
            Are you sure you want to leave this group?
          </div>
          <div className="leave-modal-options">
            - Your added startups will be removed from group <br />
            - Comments will be deleted <br />
            - Your evaluations will be removed from group <br />
          </div>
        </div>
      }
    />
  );
}
