import React from "react";
import "./add-startup.scss";

export default function InviteMembers({ type = 1 }) {
  const noOfMembers = 7;
  return (
    <div className="invite-member-modal-container">
      <div className="row">
        <div className="col-sm-6">
          {[...Array(noOfMembers)].map((elementInArray, index) => {
            return (
              <div className="member-record" key={`member-id-${index}`}>
                <div className="invite-member-modal__name-container">
                  {type === 1 && (
                    <i class="icon fa fa-times-circle" aria-hidden="true"></i>
                  )}
                  <div className="name">Ana Konavalenkova</div>
                  {type === 1 && <div className="member-btn">member</div>}
                </div>
                <div className={`email email-${type}`}>ana@leverageux.com</div>
              </div>
            );
          })}
        </div>
        <div className="col-sm-6">
          <div className="search">
            <span class="material-icons">search</span>
            <input
              className="search-box"
              placeholder="Search Members"
              type="text"
            />
          </div>
          <div className="startup-list">
            {[...Array(3)].map((elementInArray, index) => {
              return (
                <div className="member-record" key={`member-id-${index}`}>
                  <div className="invite-member-modal__name-container">
                    <div className="name">Ana Konavalenkova</div>
                    {index === 2 ? (
                      <div className="pending-btn member-btn">PENDING</div>
                    ) : (
                      <div className="invite-btn member-btn">+ INVITE</div>
                    )}
                  </div>
                  <div className="email">ana@leverageux.com</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
