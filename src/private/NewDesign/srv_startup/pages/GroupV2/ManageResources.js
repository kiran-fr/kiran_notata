import React, { useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddStartup from "./add-startup";
import ManageTemplates from "./manage-templates";
import InviteMembers from "./invite-members";

import { Modal } from "Components/UI_Kits/Modal/Modal";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function ManageResources({ group }) {
  const [value, setValue] = useState(0);
  const [manageTemplateModal, setManageTemplateModal] = useState(false);
  const [inviteMembersModal, setInviteMembersModal] = useState(false);
  const [addStartupModal, setAddStartupModal] = useState(false);

  // Set tab value
  const setTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={setTab}>
        <Tab label="Admin View" {...a11yProps(0)} />
        <Tab label="Member View" {...a11yProps(1)} />
      </Tabs>

      <div className="users-container">
        {/* templates */}
        <div className="users-container__user-count">
          <div className="users-container__user-count__name">
            {group.evaluationTemplates?.length} evaluation templates
          </div>
          {value === 0 && (
            <div className="users-container__user-count__action">
              <div
                className="users-container__user-count__action__btn"
                onClick={() => setManageTemplateModal(true)}
              >
                Manage templates
              </div>
            </div>
          )}
        </div>

        {/* users */}
        <div className="users-container__user-count">
          <div className="users-container__user-count__name">
            <u>{group.members?.length || "0"} members</u>
          </div>
          {value === 0 && (
            <div className="users-container__user-count__action">
              <div
                className="users-container__user-count__action__btn"
                onClick={() => setInviteMembersModal(true)}
              >
                Invite members
              </div>
            </div>
          )}
        </div>

        {/* admins */}
        <div className="users-container__user-count">
          <div className="users-container__user-count__name">
            {group.members?.filter(({ role }) => role === "ADMIN").length ||
              "0"}{" "}
            admins
          </div>
          <div className="users-container__user-count__action">
            <i
              className={`users-container__user-count__action__icon fa fa-chevron-down`}
              aria-hidden="true"
              onClick={() => null}
            />
          </div>
        </div>

        {/* startups */}
        <div className="users-container__user-count">
          <div className="users-container__user-count__name">
            {group.startups?.length || "0"} startups
          </div>
          {value === 0 && (
            <div className="users-container__user-count__action">
              <div
                className="users-container__user-count__action__btn"
                onClick={() => setAddStartupModal(true)}
              >
                Manage Startups
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {addStartupModal && (
        <Modal
          title="Add Startups"
          submit={() => setAddStartupModal(false)}
          close={() => setAddStartupModal(false)}
          submitTxt="SAVE"
          closeTxt="CANCEL"
          children={<AddStartup />}
        />
      )}

      {manageTemplateModal && (
        <Modal
          title="Manage Templates"
          submit={() => setManageTemplateModal(false)}
          close={() => setManageTemplateModal(false)}
          submitTxt="SAVE"
          closeTxt="CANCEL"
          children={<ManageTemplates group={group} />}
        />
      )}

      {inviteMembersModal && (
        <Modal
          title="Invite Members"
          submit={() => {
            setInviteMembersModal(false);
          }}
          close={() => {
            setInviteMembersModal(false);
          }}
          submitTxt="OK"
          closeTxt="CLOSE"
          children={<InviteMembers group={group} />}
          innerClassName="invite-member-modal"
        />
      )}
    </>
  );
}
