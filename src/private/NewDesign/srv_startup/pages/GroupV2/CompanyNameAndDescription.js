import React, { useState } from "react";
import DeleteGroup from "./delete-group-modal";
import { group as group_page } from "../../../../../definitions";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import { useMutation } from "@apollo/client";
import { groupDelete, groupLeave } from "../../../../Apollo/Mutations";

export default function CompanyNameAndDescription({ group, history }) {
  const [dropDownState, setDropDownState] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);

  const [leaveGroup, leaveGroupRes] = useMutation(groupLeave);
  const [deleteGroup, { loading }] = useMutation(groupDelete);

  return (
    <>
      {
        // Heading
        <div className="group-dashboard-container__card-heading">
          <span className="material-icons">lock</span>
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
                  onClick={() => null}
                  style={{ opacity: 0.5, cursor: "default" }}
                >
                  <span className="material-icons settings">content_copy</span>
                  <span className="text">SETTINGS</span>
                </div>
                <div
                  className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                  onClick={() => null}
                  style={{ opacity: 0.5, cursor: "default" }}
                >
                  <span className="material-icons settings">edit</span>
                  <span className="text">EDIT</span>
                </div>
                <div
                  className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                  onClick={() => null}
                  style={{ opacity: 0.5, cursor: "default" }}
                >
                  <span className="material-icons settings">groups</span>
                  <span className="text">CREATE NEW GROUP</span>
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

      <div>
        <p className="group-dashboard-container__group-details">
          {group.description || group.settings?.isPublic
            ? "open group"
            : "closed group"}
        </p>
      </div>

      {deleteModal && (
        <Modal
          title="Delete group"
          submit={async () => {
            let variables = {
              id: group.id,
            };

            try {
              await deleteGroup({ variables });
            } catch (error) {
              console.log("error", error);
            }
            history.push(group_page);
            setDeleteModal(false);
          }}
          close={() => {
            setDeleteModal(false);
          }}
          loading={loading}
          submitTxt="Delete"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={<DeleteGroup />}
        />
      )}

      {leaveModal && (
        <Modal
          title="Leave group"
          submit={async () => {
            let variables = {
              id: group.id,
            };
            try {
              await leaveGroup({ variables });
            } catch (error) {
              console.log("error", error);
            }
            history.push(group_page);
            setLeaveModal(false);
          }}
          close={() => {
            setLeaveModal(false);
          }}
          loading={leaveGroupRes.loading}
          submitTxt="Delete"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={<DeleteGroup />}
        />
      )}
    </>
  );
}
