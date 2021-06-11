import React, { useState } from "react";
import "./profile.scss";

import { ProfileContent } from "../../../Containers/NewDesign/PreProfile/Profile";
import { settings } from "../../../definitions";

export default function ProfileSettings({ history }) {
  return (
    <div className="profile-container">
      <div className="card profile-container__card">
        <div className="card-heading profile-container__heading">
          <i
            class="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => history.push(settings)}
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
