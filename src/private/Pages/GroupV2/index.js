import React, { useRef, useState, useEffect } from "react";

import { useMutation, useQuery } from "@apollo/client";
// import { groupsGetV2 } from "../../../../Apollo/Queries";
import { groupsGetV2 } from "../../Apollo/Queries";

import {
  groupCreate,
  groupDelete,
  groupUsersInvite,
  groupStartupsAdd,
  groupLeave,
  groupSettingsSet,
} from "../../Apollo/Mutations";

import "./index.scss";
import "../public.scss";
import ButtonWithIcon from "../srv_startup/pages/ui-kits/button-with-icon";
import { ICONPOSITION } from "../srv_startup/pages/constants";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import DeleteGroup from "./delete-group-modal";
import LeaveGroup from "./leave-group-modal";
import Settings from "../StartupPage/TabPages/Groups/create-new-group/settings";
import { group_dashboard } from "definitions";
import { GhostLoader } from "Components/elements";
import CreateNewGroup from "../StartupPage/TabPages/Groups/create-new-group/create-new-group";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

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

export default function Groups({ history }) {
  const sortByRef = useRef();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [showSortByDropDown, setShowSortByDropDown] = useState(false);
  const [browseDropDownState, setBrowseDropDownState] = useState(undefined);
  const [data, setData] = useState(defaultData);
  const [tab, setValue] = useState(0);

  // Modal states
  const [deleteModal, setDeleteModal] = useState(undefined);
  const [leaveModal, setLeaveModal] = useState(undefined);
  const [settingsModal, setSettingsModal] = useState(undefined);
  const [createGroupModal, setCreateGroupModal] = useState(false);

  // Queries
  let groupsQuery = useQuery(groupsGetV2);

  // Mutations
  const [createGroup] = useMutation(groupCreate);
  const [addMembers] = useMutation(groupUsersInvite);
  const [addStartups] = useMutation(groupStartupsAdd);

  const [deleteGroup, deleteGroupRes] = useMutation(groupDelete, {
    refetchQueries: [{ query: groupsGetV2 }],
    awaitRefetchQueries: true,
  });

  const [leaveGroup, leaveGroupRes] = useMutation(groupLeave, {
    refetchQueries: [{ query: groupsGetV2 }],
    awaitRefetchQueries: true,
  });

  const [setSettings, setSettingsRes] = useMutation(groupSettingsSet, {
    refetchQueries: [{ query: groupsGetV2 }],
    awaitRefetchQueries: true,
  });

  // Sorting
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleClick = e => {
    if (!sortByRef?.current?.contains(e.target)) {
      setShowSortByDropDown(false);
    }
  };

  // Set tab value
  const setTab = (event, newValue) => {
    setValue(newValue);
  };

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
      try {
        await addStartups({ variables });
      } catch (error) {
        return console.log(error);
      }
    }

    // Invite members
    if (data.members.length) {
      let variables = {
        groupId: group.id,
        emails: data.members,
      };
      try {
        await addMembers({ variables });
      } catch (error) {
        return console.log(error);
      }
    }

    history.push(`${group_dashboard}/${group.id}`);

    setIsLoading(false);
  }

  // MUST COME AFTER HOOKS

  // Split groups into two groups
  // let groups = { iAmAdmin: [], iAmMember: [] };
  // for (let group of groupsQuery?.data?.groupsGetV2 || []) {
  //   group.iAmAdmin ? groups.iAmAdmin.push(group) : groups.iAmMember.push(group);
  // }

  // let groupArray = groups[tab === 0 ? "iAmAdmin" : "iAmMember"] || [];

  let groups = groupsQuery.data?.groupsGetV2;

  if (!groupsQuery.data && groupsQuery.loading) {
    return <GhostLoader />;
  }

  return (
    <div className="groups-contianer">
      <div className="card">
        <div className="card-heading">Groups</div>

        {/* <Tabs value={tab} onChange={setTab}>
          <Tab label="I am admin of" {...a11yProps(0)} />
          <Tab label="I am member of" {...a11yProps(1)} />
        </Tabs>  */}

        <div className="row">
          {/* <div
            className="col-sm-5 col-sm-push-0 col-xs-5 col-xs-push-6 sort-by"
            ref={sortByRef}
          >
            Sort by
            <i
              class={`sort-by-dropdown-icon fa ${
                showSortByDropDown ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              aria-hidden="true"
              onClick={() => setShowSortByDropDown(!showSortByDropDown)}
            />
            <i className="fa fa-arrow-up" aria-hidden="true" />
            <i className="fa fa-arrow-down" aria-hidden="true" />
            {showSortByDropDown && (
              <div className="sortby-dropdown">
                <div className="sortby-dropdown__item">Name</div>
                <div className="sortby-dropdown__item">Members</div>
                <div className="sortby-dropdown__item">Starred</div>
                <div className="sortby-dropdown__item">Updated</div>
              </div>
            )}
          </div> */}
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
              <div key={group.id}>
                <div className="row data" id={`row-data-${index}`}>
                  <div
                    className="col-sm-5 col-xs-7 data__name"
                    onClick={() =>
                      history.push(`${group_dashboard}/${group.id}`)
                    }
                  >
                    {/*<i className="fa fa-star"></i>*/}
                    {/*<span class="material-icons">lock</span>*/}
                    {group.name}
                  </div>
                  <div className="col-sm-3 col-xs-6 data__members">
                    {group.members.length} members
                  </div>
                  <div className="col-sm-2 col-xs-4  data__startups">
                    {group.startups.length} startups
                  </div>
                  <div className="col-sm-2 col-xs-1 data__browse">
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
                          tab === 0 && (
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
                          tab === 1 && (
                            <>
                              {/*<div*/}
                              {/*  className="data__browse__drop-dwon__item"*/}
                              {/*  onClick={() => setSettingsModal(group)}*/}
                              {/*>*/}
                              {/*  <span className="material-icons settings">*/}
                              {/*    content_copy*/}
                              {/*  </span>*/}
                              {/*  <span className="text">SETTINGS</span>*/}
                              {/*</div>*/}

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
                <div className="groups-contianer__separator" />
              </div>
            );
          })
        }
      </div>

      {deleteModal && (
        <Modal
          title="Delete group"
          loading={deleteGroupRes.loading}
          submit={async () => {
            if (deleteGroupRes.loading) return;
            try {
              await deleteGroup({ variables: { id: deleteModal.id } });
            } catch (error) {
              console.log("error", error);
            }
            setDeleteModal(undefined);
          }}
          close={() => {
            setDeleteModal(undefined);
          }}
          submitTxt="Delete"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={<DeleteGroup group={deleteModal} />}
        />
      )}

      {leaveModal && (
        <Modal
          title="Leave group"
          loading={leaveGroupRes.loading}
          submit={async () => {
            if (leaveGroupRes.loading) return;
            try {
              await leaveGroup({ variables: { id: leaveModal.id } });
            } catch (error) {
              console.log("error", error);
            }
            setLeaveModal(undefined);
          }}
          close={() => {
            setLeaveModal(undefined);
          }}
          submitTxt="Leave"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={<LeaveGroup group={leaveModal} />}
        />
      )}

      {settingsModal && (
        <Modal
          title="Settings"
          loading={setSettingsRes.loading}
          submit={async () => {
            if (setSettings.loading) return;
            try {
              await setSettings({
                variables: {
                  groupId: settingsModal.id,
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
          children={
            <Settings group={settingsModal} data={data} setData={setData} />
          }
        />
      )}

      {createGroupModal && (
        <Modal
          title="Create new group"
          submit={saveData}
          loading={isLoading}
          close={() => {
            setCreateGroupModal(undefined);
          }}
          submitTxt="Create"
          closeTxt="Cancel"
          children={<CreateNewGroup data={data} setData={setData} />}
        />
      )}
    </div>
  );
}
