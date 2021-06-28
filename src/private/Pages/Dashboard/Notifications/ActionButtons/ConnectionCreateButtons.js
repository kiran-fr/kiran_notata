import React from "react";
// OTHERS
import { startup_page } from "../../../../../definitions";
import { getVal } from "../helpers/utils";

export default function PublicCreativeUpdateButtons({ notification, history }) {
  let connectionId = getVal(notification, "connectionId");
  return (
    <>
      <div className="notifications-container-new__notification__action-buttons">
        <button
          className="view-button"
          onClick={() => {
            history.push(`${startup_page}/company/${connectionId}?tab=1`);
          }}
        >
          view
        </button>
      </div>
    </>
  );
}
