import React from "react";
import InputCheckBox from "../ui-kits/check-box";

export default function LeaveGroup() {
  return (
    <div className="delete-group-modal-container">
      <div className="description">
        Are you sure you want to leave this group?
      </div>
      <div className="delete-traces">
        <InputCheckBox /> Delete all your traces:
      </div>
      <div className="leave-modal-options">
        - Your added startups will be removed from group <br />
        - Comments will be deleted <br />
        - Your evaluations will be removed from group <br />
      </div>
    </div>
  );
}
