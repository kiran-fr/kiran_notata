import React, { useState } from "react";
import "./tags.scss";
import { SETTINGSMENU } from "../../NewDesign/srv_startup/pages/constants";

export default function ProfileSettings({ setMenuSelected }) {
  return (
    <div className="tags-container">
      <div className="card tags-container__card">
        <div className="card-heading tags-container__heading">
          <i
            class="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => setMenuSelected(SETTINGSMENU.HOME)}
          ></i>
          Settings
        </div>
      </div>
    </div>
  );
}
