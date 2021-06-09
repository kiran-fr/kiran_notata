import React from "react";

export default function RemoveFromGroup() {
  return (
    <div className="delete-group-modal-container">
      <div className="description">
        Are you sure you want to remove this startup from the group?
      </div>
      <div className="remember">Remember:</div>
      <div className="options">
        - All shared evaluations will be removed
        <br />
        - All comments will be deleted
        <br />
      </div>
    </div>
  );
}
