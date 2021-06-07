import React, { useState } from "react";
import "./profile.scss";
import { SETTINGSMENU } from "../../NewDesign/srv_startup/pages/constants";
import { ProfileContent } from "../../../Containers/NewDesign/PreProfile/Profile";

export default function ProfileSettings({ setMenuSelected, history }) {
  return (
    <div className="profile-container">
      <div className="card profile-container__card">
        <div className="card-heading profile-container__heading">
          <i
            class="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => setMenuSelected(SETTINGSMENU.HOME)}
          />
          User profile
        </div>

        <div className="profile-container__content">
          <ProfileContent history={history} skipLast />
        </div>
      </div>
    </div>
  );
}
