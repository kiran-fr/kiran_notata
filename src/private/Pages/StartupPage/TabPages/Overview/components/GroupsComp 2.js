import React, { useState } from "react";
import Dropdown from "../../../../srv_startup/pages/ui-kits/drop-down";
import CreateNewGroupModal from "../modals/CreateNewGroupModal";

const items = [
  { id: 1, name: "First" },
  { id: 2, name: "Before" },
  { id: 3, name: "After" },
];

export default function GroupsComp({ connection }) {
  const [createGroupModal, setCreateGroupModal] = useState(false);

  return (
    <>
      <div className="row groups-container">
        <div className="overview-container__scores__heading">Groups</div>
        <div className="col-sm-4 col-xs-12 group-name">
          Group 1, Big group 2
        </div>
        <div className="col-sm-8 col-xs-12 add-startup-container">
          <span className="add-text">Add startup to a group</span>
          <span className="add-startup-to-group">
            <Dropdown title="" items={items} />
            <span className="green_plus">
              <i
                className="fa fa-plus"
                aria-hidden="true"
                onClick={() => setCreateGroupModal(true)}
              />
            </span>
          </span>
        </div>
      </div>

      {createGroupModal && (
        <CreateNewGroupModal close={() => setCreateGroupModal(false)} />
      )}
    </>
  );
}
