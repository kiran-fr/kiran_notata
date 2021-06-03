import React, { useRef, useState, useEffect } from "react";
import "./index.scss";
import "../public.scss";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import { ICONPOSITION } from "../constants";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Modal } from "../../../../Components/UI_Kits/Modal/Modal";
import DeleteGroup from "./delete-group-modal";
import LeaveGroup from "./leave-group-modal";
import Settings from "../startup/groups-individuals/create-new-group/settings";
import { group_dashboard } from "../../../../definitions";
import CreateNewGroup from "../startup/groups-individuals/create-new-group/create-new-group";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function Groups({ history }) {
  let noOfRows = 5;
  const sortByRef = useRef();
  const [showSortByDropDown, setShowSortByDropDown] = useState(false);
  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);
  const handleClick = e => {
    if (!sortByRef.current.contains(e.target)) {
      setShowSortByDropDown(false);
    }
  };
  const [browseDropDownStates, setBrowseDropDownStates] = useState(
    new Array(noOfRows).fill(false)
  );
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [deleteModal, setDeleteModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(false);

  return (
    <div className="groups-contianer">
      <div className="card">
        <div className="card-heading">Groups</div>
        <Tabs value={value} onChange={handleChange}>
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
            ></i>
            <i class="fa fa-arrow-up" aria-hidden="true"></i>
            <i class="fa fa-arrow-down" aria-hidden="true"></i>
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
              onClick={() => setCreateGroupModal(true)}
            ></ButtonWithIcon>
          </div>
        </div>
        {[...Array(noOfRows)].map((elementInArray, index) => {
          return (
            <>
              <div className="row data" id={`row-data-${index}`}>
                <div
                  className="col-sm-5 col-xs-7 data__name"
                  onClick={() => history.push(group_dashboard)}
                >
                  <i className="fa fa-star"></i>
                  <span class="material-icons">lock</span>
                  Group 1
                </div>
                <div className="col-sm-3 col-xs-6 data__members">
                  11 members
                </div>
                <div className="col-sm-2 col-xs-4  data__startups">
                  15 startups
                </div>
                <div className="col-sm-2 col-xs-1 data__browse">
                  <span
                    class="material-icons"
                    onClick={() => {
                      let states = new Array(noOfRows).fill(false);
                      states[index] = !browseDropDownStates[index];
                      setBrowseDropDownStates(states);
                    }}
                  >
                    more_horiz
                  </span>
                  {browseDropDownStates[index] && (
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
              {index < noOfRows - 1 && (
                <div className="groups-contianer__separator"></div>
              )}
            </>
          );
        })}
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
          children={<DeleteGroup></DeleteGroup>}
        ></Modal>
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
          children={<LeaveGroup></LeaveGroup>}
        ></Modal>
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
          children={<Settings isAdmin={value === 0}></Settings>}
        />
      )}
      {createGroupModal && (
        <Modal
          title="Create new group"
          submit={() => {
            setCreateGroupModal(false);
          }}
          close={() => {
            setCreateGroupModal(false);
          }}
          submitTxt="Create"
          closeTxt="Cancel"
          children={<CreateNewGroup></CreateNewGroup>}
        ></Modal>
      )}
    </div>
  );
}
