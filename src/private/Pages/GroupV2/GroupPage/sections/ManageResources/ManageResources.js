import React, { useState } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import ManageMembersModal from "../../../modals/ManageMembersModal";
import ManageTemplatesModal from "../../../modals/ManageTemplatesModal";
import ManageStartupsModal from "../../../modals/ManageStartupsModal";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function ManageResources({ group, setViewAsMember }) {
  const [value, setValue] = useState(group.iAmAdmin ? 0 : 1);
  const [manageTemplateModal, setManageTemplateModal] = useState(false);
  const [inviteMembersModal, setInviteMembersModal] = useState(false);
  const [manageStartupsModal, setManageStartupModal] = useState(false);

  // Set tab value
  const setTab = (event, newValue) => {
    setViewAsMember(newValue === 1);
    setValue(newValue);
  };

  return (
    <div className="manage-resources">
      {group.iAmAdmin && (
        <Tabs value={value} onChange={setTab}>
          <Tab label="Admin View" {...a11yProps(0)} />
          <Tab label="Member View" {...a11yProps(1)} />
        </Tabs>
      )}

      <div className="users-container">
        {/* templates */}

        {(!!group.evaluationTemplates?.length || group.iAmAdmin) && (
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
        )}

        {/* users */}

        {group.iAmAdmin && (
          <div className="users-container__user-count">
            <div className="users-container__user-count__name">
              {group.members?.length || "0"} members
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
        )}

        {/* startups */}
        <div className="users-container__user-count">
          <div className="users-container__user-count__name">
            {group.startups?.length || "0"} startups
          </div>
          {value === 0 && (
            <div className="users-container__user-count__action">
              <div
                className="users-container__user-count__action__btn"
                onClick={() => setManageStartupModal(true)}
              >
                Manage Startups
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {manageStartupsModal && (
        <ManageStartupsModal
          group={group}
          close={() => setManageStartupModal(false)}
        />
      )}

      {manageTemplateModal && (
        <ManageTemplatesModal
          group={group}
          close={() => setManageTemplateModal(false)}
        />
      )}

      {inviteMembersModal && (
        <ManageMembersModal
          group={group}
          close={() => setInviteMembersModal(false)}
        />
      )}
    </div>
  );
}
