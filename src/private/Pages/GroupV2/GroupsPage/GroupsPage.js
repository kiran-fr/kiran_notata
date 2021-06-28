import React, { useState } from "react";

// API STUFF
import { useQuery } from "@apollo/client";
import { groupsGetV2 } from "../../../Apollo/Queries";
import { group_dashboard } from "definitions";

// STYLES
import "./GroupsPage.scss";
import "../../public.scss";

// COMPONENTS: GENERAL
import ButtonWithIcon from "../../srv_startup/pages/ui-kits/button-with-icon";
import { ICONPOSITION } from "../../srv_startup/pages/constants";
import { GhostLoader } from "Components/elements";

// COMPONENTS: CUSTOM
import LeaveGroupModal from "../modals/LeaveGroupModal";
import DeleteGroupModal from "../modals/DeleteGroupModal";
import GroupSettingsModal from "../modals/GroupSettingsModal";
import CreateNewGroupModal from "../modals/CreateNewGroupModal/CreateNewGroupModal";

export default function Groups({ history }) {
  // States
  const [browseDropDownState, setBrowseDropDownState] = useState(undefined);

  // Modal states
  const [deleteModal, setDeleteModal] = useState(undefined);
  const [leaveModal, setLeaveModal] = useState(undefined);
  const [settingsModal, setSettingsModal] = useState(undefined);
  const [createGroupModal, setCreateGroupModal] = useState(false);

  // Queries
  let groupsQuery = useQuery(groupsGetV2);

  let groups = groupsQuery.data?.groupsGetV2;

  if (!groupsQuery.data && groupsQuery.loading) {
    return <GhostLoader />;
  }

  return (
    <div className="groups-contianer">
      <div className="card">
        <div className="card-heading">Groups</div>
        <div className="row">
          <div className=" create-group-container">
            <ButtonWithIcon
              iconName="add"
              className="create-new-group"
              text="CREATE NEW GROUP"
              iconPosition={ICONPOSITION.START}
              onClick={() => setCreateGroupModal(true)}
            />
          </div>
        </div>

        {
          /* EACH GROUP LINE */
          groups.map((group, index) => {
            return (
              <div
                className="row data"
                id={`row-data-${index}`}
                key={`row-data-${index}`}
              >
                <div
                  className="col-sm-6 col-xs-12 data__name"
                  onClick={() => history.push(`${group_dashboard}/${group.id}`)}
                >
                  {group.iAmAdmin && <i className="fas fa-user-crown" />}

                  {!group.iAmAdmin && group.settings.isPublic && (
                    <i className="fas fa-lock-open-alt" />
                  )}

                  {!group.iAmAdmin && !group.settings.isPublic && (
                    <i className="fas fa-lock-alt" />
                  )}

                  {group.name}
                </div>

                <div className="col-sm-3 col-xs-6 data__members">
                  {(group.iAmAdmin || group.settings.showUsers) &&
                    group.members &&
                    (<span>{group.members.length} members</span> || <span />)}
                </div>

                <div className="col-sm-3 col-xs-4  data__startups">
                  {group.startups.length} startups
                </div>
                <div className="data__browse">
                  <span
                    class="material-icons"
                    onClick={() => {
                      browseDropDownState === group.id
                        ? setBrowseDropDownState(undefined)
                        : setBrowseDropDownState(group.id);
                    }}
                  >
                    more_horiz
                  </span>

                  {browseDropDownState === group.id && (
                    <div className="data__browse__drop-dwon">
                      {
                        // I AM ADMIN
                        group.iAmAdmin && (
                          <>
                            <div
                              className="data__browse__drop-dwon__item"
                              onClick={() => setSettingsModal(group)}
                            >
                              <span className="material-icons settings">
                                content_copy
                              </span>
                              <span className="text">SETTINGS</span>
                            </div>

                            <div
                              className="data__browse__drop-dwon__item leave"
                              onClick={() => setDeleteModal(group)}
                            >
                              <span className="material-icons leave">
                                delete
                              </span>
                              <span className="text">DELETE GROUP</span>
                            </div>
                          </>
                        )
                      }

                      {
                        // I AM NOT ADMIN
                        !group.iAmAdmin && (
                          <>
                            <div
                              className="data__browse__drop-dwon__item leave"
                              onClick={() => setLeaveModal(group)}
                            >
                              <span className="material-icons leave">
                                logout
                              </span>
                              <span className="text">LEAVE GROUP</span>
                            </div>
                          </>
                        )
                      }
                    </div>
                  )}
                </div>
              </div>
            );
          })
        }
      </div>

      {deleteModal && (
        <DeleteGroupModal
          group={deleteModal}
          close={() => setDeleteModal(undefined)}
        />
      )}

      {leaveModal && (
        <LeaveGroupModal
          group={leaveModal}
          close={() => setLeaveModal(undefined)}
        />
      )}

      {settingsModal && (
        <GroupSettingsModal
          group={settingsModal}
          close={() => setSettingsModal(undefined)}
        />
      )}

      {createGroupModal && (
        <CreateNewGroupModal
          close={() => setCreateGroupModal(undefined)}
          history={history}
        />
      )}
    </div>
  );
}
