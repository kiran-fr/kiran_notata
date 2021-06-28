import React from "react";

export default function GroupMembers() {
  const noOfMembers = 12;
  return (
    <div className="invite-member-modal-container group-members-modal-container">
      {[...Array(noOfMembers)].map((elementInArray, index) => {
        return (
          <div className="member-record row" key={`member-id-${index}`}>
            <div
              className="col-sm-5 name"
              style={{ textDecoration: "underline" }}
            >
              Ana Konavalenkova
            </div>
            <div className={`col-sm-6 email email-${2}`}>
              ana@leverageux.com
            </div>
          </div>
        );
      })}
    </div>
  );
}
