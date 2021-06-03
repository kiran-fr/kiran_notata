import React, { useRef, useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { groupsGetV2 } from "../../../../Apollo/Queries";

import "./index.scss";
import "../public.scss";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import { ICONPOSITION } from "../constants";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import DeleteGroup from "./delete-group-modal";
import LeaveGroup from "./leave-group-modal";
import Settings from "../startup/groups-individuals/create-new-group/settings";
import { group_dashboard } from "definitions";
import { GhostLoader } from "../../../../../Components/elements";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function Groups({ history }) {
  const sortByRef = useRef();

  // States
  const [showSortByDropDown, setShowSortByDropDown] = useState(false);
  const [browseDropDownState, setBrowseDropDownState] = useState(undefined);
  const [value, setValue] = useState(0);

  // Modal states
  const [deleteModal, setDeleteModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);

  // Queries
  let { data, error, loading } = useQuery(groupsGetV2);

  // Mutations

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

  // MUST COME AFTER HOOKS

  // Split groups into two groups
  let groups = { iAmAdmin: [], iAmMember: [] };
  for (let group of data?.groupsGetV2 || []) {
    group.iAmAdmin ? groups.iAmAdmin.push(group) : groups.iAmMember.push(group);
  }

  let groupArray = groups[value === 0 ? "iAmAdmin" : "iAmMember"] || [];

  if (loading) {
    return <GhostLoader />;
  }

  return (
    <div className="groups-contianer">
      <div className="card">
        <div className="card-heading">Groups</div>

        <Tabs value={value} onChange={setTab}>
          <Tab label="I am admin of" {...a11yProps(0)} />
          <Tab label="I am member of" {...a11yProps(1)} />
        </Tabs>

        <div className="row">
          <div
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
            <i class="fa fa-arrow-up" aria-hidden="true" />
            <i class="fa fa-arrow-down" aria-hidden="true" />
            {showSortByDropDown && (
              <div className="sortby-dropdown">
                <div className="sortby-dropdown__item">Name</div>
                <div className="sortby-dropdown__item">Members</div>
                <div className="sortby-dropdown__item">Starred</div>
                <div className="sortby-dropdown__item">Updated</div>
              </div>
            )}
          </div>
          <div className="col-sm-6 col-xs-6 col-sm-pull-0 col-xs-pull-5 create-group-container">
            <ButtonWithIcon
              iconName="add"
              className="create-new-group"
              text="CREATE NEW GROUP"
              iconPosition={ICONPOSITION.START}
            />
          </div>
        </div>

        {
          /* EACH GROUP LINE */
          groupArray.map((group, index) => {
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
                        <div
                          className="data__browse__drop-dwon__item"
                          onClick={() => setSettingsModal(true)}
                        >
                          <span class="material-icons settings">
                            content_copy
                          </span>
                          <span className="text">SETTINGS</span>
                        </div>
                        {value === 0 ? (
                          <div
                            className="data__browse__drop-dwon__item leave"
                            onClick={() => setDeleteModal(true)}
                          >
                            <span class="material-icons leave">delete</span>
                            <span className="text">DELETE GROUP</span>
                          </div>
                        ) : (
                          <div
                            className="data__browse__drop-dwon__item leave"
                            onClick={() => setLeaveModal(true)}
                          >
                            <span class="material-icons leave">logout</span>
                            <span className="text">LEAVE GROUP</span>
                          </div>
                        )}
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
          submit={() => {
            setDeleteModal(false);
          }}
          close={() => {
            setDeleteModal(false);
          }}
          submitTxt="Delete"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={<DeleteGroup />}
        />
      )}

      {leaveModal && (
        <Modal
          title="Leave group"
          submit={() => {
            setLeaveModal(false);
          }}
          close={() => {
            setLeaveModal(false);
          }}
          submitTxt="Leave"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={<LeaveGroup />}
        />
      )}

      {settingsModal && (
        <Modal
          title="Settings"
          submit={() => {
            setSettingsModal(false);
          }}
          close={() => {
            setSettingsModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={<Settings isAdmin={value === 0} />}
        />
      )}
    </div>
  );
}
