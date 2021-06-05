import React, { useState } from "react";
import "./your-team.scss";
import {
  ICONPOSITION,
  SETTINGSMENU,
} from "../../NewDesign/srv_startup/pages/constants";
import ButtonWithIcon from "../../NewDesign/srv_startup/pages/ui-kits/button-with-icon";
import { Modal } from "../../../Components/UI_Kits/Modal/Modal";

export default function YourTeam({ setMenuSelected }) {
  const [deleteModal, setDeleteModal] = useState(false);
  return (
    <div className="your-team-container">
      <div className="card your-team-container__card">
        <div className="card-heading your-team-container__heading">
          <i
            class="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => setMenuSelected(SETTINGSMENU.HOME)}
          ></i>
          Your team
        </div>
        <div className="your-team">
          <div className="your-team__header">Team members</div>
          <div className="your-team__members">
            {[...Array(4)].map((elementInArray, index) => {
              return (
                <div
                  className="your-team__members__member"
                  key={`member-id-${index}`}
                >
                  <i
                    class="fa fa-times-circle"
                    aria-hidden="true"
                    onClick={() => setDeleteModal(true)}
                  ></i>
                  daria.kys29@gmail.com
                </div>
              );
            })}
          </div>
          <div className="your-team__header your-team__pending-invitation">
            Pending invitations
          </div>
          <div className="your-team__email">Email</div>
          <div className="your-team__pending-invite-container">
            <input
              type="text"
              placeholder="johndoe@leverageux.com"
              className="your-team__pending-invite-container__search-user"
            ></input>
            <ButtonWithIcon
              className="your-team__pending-invite-container__invite-btn"
              iconName="add"
              text="invite"
              iconPosition={ICONPOSITION.START}
            ></ButtonWithIcon>
          </div>
          <div className="your-team__members">
            <div className="your-team__members__member">
              <i class="fa fa-times-circle" aria-hidden="true"></i>
              daria.kys29@gmail.com
            </div>
            <div className="your-team__members__member">
              <i class="fa fa-times-circle" aria-hidden="true"></i>
              ana@leverageux.com
            </div>
            <div className="your-team__members__member">
              <i class="fa fa-times-circle" aria-hidden="true"></i>
              daria.kys29@gmail.com
            </div>
            <div className="your-team__members__member">
              <i class="fa fa-times-circle" aria-hidden="true"></i>
              ana@leverageux.com
            </div>
          </div>
        </div>
      </div>
      {deleteModal && (
        <Modal
          title="Delete member from your team"
          submit={() => {
            setDeleteModal(false);
          }}
          close={() => {
            setDeleteModal(false);
          }}
          submitTxt="Delete"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={
            <p className="delete-member-modal-from-team">
              Are you sure you want to delete the member (daria.kys29@gmail.com)
              from your team?
            </p>
          }
        ></Modal>
      )}
    </div>
  );
}
