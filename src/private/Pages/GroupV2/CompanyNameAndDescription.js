import React, { useState } from "react";
import DeleteGroup from "./delete-group-modal";
import { group as group_page } from "../../../definitions";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import { useMutation } from "@apollo/client";
import {
  groupDelete,
  groupLeave,
  groupSettingsSet,
  groupUpdate,
  groupCreate,
  groupUsersInvite,
  groupStartupsAdd,
} from "../../Apollo/Mutations";

import { group_dashboard } from "definitions";

import Settings from "../StartupPage/TabPages/Groups/create-new-group/settings";
import CreateNewGroup from "../StartupPage/TabPages/Groups/create-new-group/create-new-group";
import General from "../StartupPage/TabPages/Groups/create-new-group/general";

let defaultData = {
  general: {},
  startups: {},
  members: [],
  settings: {
    chat: true,
    isPublic: false,
    showUsers: true,
    showScores: true,
    showSummaries: true,
    addStartup: false,
    addUser: false,
  },
};

export default function CompanyNameAndDescription({ group, history }) {
  const [dropDownState, setDropDownState] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [editGroupModal, setEditGroupModal] = useState(false);
  const [cloneGroupModal, setCloneGroupModal] = useState(false);
  const [data, setData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);

  const [createGroup] = useMutation(groupCreate);
  const [addMembers] = useMutation(groupUsersInvite);
  const [addStartups] = useMutation(groupStartupsAdd);

  const [leaveGroup, leaveGroupRes] = useMutation(groupLeave);
  const [deleteGroup, { loading }] = useMutation(groupDelete);
  const [setSettings, setSettingsRes] = useMutation(groupSettingsSet);
  const [updateGroup, updateGroupRes] = useMutation(groupUpdate);

  async function saveData() {
    if (isLoading) return;

    setIsLoading(true);

    let group;

    // Create group with name, description and setting
    try {
      let variables = {
        name: data.general.name,
        description: data.general.description,
      };
      let res = await createGroup({ variables });
      group = res.data?.groupCreate;
    } catch (error) {
      return console.log(error);
    }

    // Add startups to group
    let creativeIds = Object.keys(data.startups);
    if (creativeIds.length) {
      let variables = {
        groupId: group.id,
        creativeIds: creativeIds,
      };
      await addStartups({ variables });
    }

    // Invite members
    if (data.members.length) {
      let variables = {
        groupId: group.id,
        emails: data.members,
      };
      await addMembers({ variables });
    }

    history.push(`${group_dashboard}/${group.id}`);

    setIsLoading(false);
  }

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

      <div>
        <p className="group-dashboard-container__group-details">
          {(group.description && group.description) ||
            (group.settings?.isPublic ? "open group" : "closed group")}
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

      {settingsModal && (
        <Modal
          title="Settings"
          loading={setSettingsRes.loading}
          submit={async () => {
            if (setSettingsRes.loading) return;
            try {
              await setSettings({
                variables: {
                  groupId: group.id,
                  settings: data.settings,
                },
              });
            } catch (error) {
              console.log("error", error);
            }
            setSettingsModal(undefined);
          }}
          close={() => {
            setSettingsModal(undefined);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={<Settings group={group} data={data} setData={setData} />}
        />
      )}

      {editGroupModal && (
        <Modal
          title="Edit"
          submit={() => {
            let variables = {
              id: group.id,
              name: data?.general?.name || group.name || "",
              description:
                data?.general?.description || group?.description || "",
            };
            updateGroup({ variables });
            setEditGroupModal(false);
          }}
          loading={updateGroupRes.loading}
          close={() => {
            setEditGroupModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={<General group={group} data={data} setData={setData} />}
        />
      )}

      {cloneGroupModal && (
        <Modal
          title="Create new group"
          submit={saveData}
          loading={isLoading}
          close={() => {
            setCloneGroupModal(undefined);
          }}
          submitTxt="Create"
          closeTxt="Cancel"
          children={
            <CreateNewGroup group={group} data={data} setData={setData} />
          }
        />
      )}
    </>
  );
}
