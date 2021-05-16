import React from "react";

export default function DeleteGroup() {
  return (
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
  );
}
