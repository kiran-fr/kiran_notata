import React, { useState } from "react";
import DeleteGroupModal from "../../../modals/DeleteGroupModal";
import LeaveGroupModal from "../../../modals/LeaveGroupModal";
import GroupSettingsModal from "../../../modals/GroupSettingsModal";
import CreateNewGroupModal from "../../../modals/CreateNewGroupModal/CreateNewGroupModal";
import EditGroupModal from "../../../modals/EditGroupModal";
import CardMessageContainer from "../../../generalComponents/CardMessageContainer";
import ButtonWithIcon from "../../../../srv_startup/pages/ui-kits/button-with-icon";
import { ICONPOSITION } from "../../../../srv_startup/pages/constants";
import SyncModal from "../../../modals/SyncModal";

export default function InfoSection({ group, refetch, history }) {
  const [dropDownState, setDropDownState] = useState(false);

  const [syncModal, setSyncModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [editGroupModal, setEditGroupModal] = useState(false);
  const [cloneGroupModal, setCloneGroupModal] = useState(false);

  let notInMyDealFlow = group?.startups?.filter(
    ({ isInMyDealFlow }) => !isInMyDealFlow
  );

  return (
    <>
      {
        // Heading
        <div className="group-dashboard-container__card-heading">
          <span className="material-icons">
            {group.settings?.isPublic ? "lock_open" : "lock"}
          </span>
          <span>{group.name}</span>
          <span
            className="material-icons group-dashboard-container__browse-card"
            onClick={() => setDropDownState(!dropDownState)}
          >
            {" "}
            more_horiz{" "}
          </span>
        </div>
      }

      {
        // Dropdown menu
        dropDownState && (
          <>
            {group.iAmAdmin && (
              <div className="group-dashboard-container__browse-card__drop-dwon">
                <div
                  className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                  onClick={() => setSettingsModal(true)}
                >
                  <span className="material-icons settings">content_copy</span>
                  <span className="text">SETTINGS</span>
                </div>
                <div
                  className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                  onClick={() => setEditGroupModal(true)}
                >
                  <span className="material-icons settings">edit</span>
                  <span className="text">EDIT</span>
                </div>
                <div
                  className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                  onClick={() => setCloneGroupModal(true)}
                >
                  <span className="material-icons settings">groups</span>
                  <span className="text">CLONE GROUP</span>
                </div>
                <div
                  className="material-icons group-dashboard-container__browse-card__drop-dwon__item leave"
                  onClick={() => null}
                >
                  <span className="material-icons leave">delete</span>

                  <span
                    className="text"
                    onClick={() => {
                      setDeleteModal(true);
                    }}
                  >
                    DELETE GROUP
                  </span>
                </div>
              </div>
            )}

            {!group.iAmAdmin && (
              <div className="group-dashboard-container__browse-card__drop-dwon">
                <div
                  className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                  onClick={() => null}
                  style={{ opacity: 0.5, cursor: "default" }}
                >
                  <span className="material-icons settings">content_copy</span>
                  <span className="text">SETTINGS</span>
                </div>
                <div
                  className="material-icons group-dashboard-container__browse-card__drop-dwon__item leave"
                  onClick={() => null}
                >
                  <span className="material-icons leave">logout</span>

                  <span
                    className="text"
                    onClick={() => {
                      setLeaveModal(true);
                    }}
                  >
                    Leve group
                  </span>
                </div>
              </div>
            )}
          </>
        )
      }

      {!!notInMyDealFlow?.length && (
        <CardMessageContainer
          title="Get in sync"
          notice
          message={`This group has ${notInMyDealFlow?.length} ${
            notInMyDealFlow?.length === 1 ? "startup" : "startups"
          } that's not in your dealflow.`}
          children={
            <div className="row">
              <div className="col-sm-12">
                <ButtonWithIcon
                  iconName="add"
                  className="sharing-bth"
                  text="Sync with group"
                  iconPosition={ICONPOSITION.END}
                  onClick={() => {
                    setSyncModal(true);
                  }}
                />
              </div>
            </div>
          }
        />
      )}

      {deleteModal && (
        <DeleteGroupModal group={group} close={() => setDeleteModal(false)} />
      )}

      {leaveModal && (
        <LeaveGroupModal group={group} close={() => setLeaveModal(false)} />
      )}

      {settingsModal && (
        <GroupSettingsModal
          group={group}
          close={() => setSettingsModal(false)}
        />
      )}

      {editGroupModal && (
        <EditGroupModal group={group} close={() => setEditGroupModal(false)} />
      )}

      {cloneGroupModal && (
        <CreateNewGroupModal
          group={group}
          close={() => setCloneGroupModal(false)}
        />
      )}

      {syncModal && (
        <SyncModal
          groupId={group.id}
          startups={notInMyDealFlow}
          refetch={refetch}
          close={() => setSyncModal(false)}
        />
      )}
    </>
  );
}
