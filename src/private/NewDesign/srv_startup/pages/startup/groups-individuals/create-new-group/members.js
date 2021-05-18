import React from "react";
import { Dropdown } from "../../../../../../../Components/UI_Kits/Dropdown";

export default function Members() {
  const items = [
    { id: 1, title: "Great Group 1" },
    { id: 2, title: "Great Group 2" },
    { id: 3, title: "Great Group 3" },
  ];
  return (
    <div className="startup-container">
      <div className="add-startups row">
        <div className="col-sm-7 col-xs-12 add-text">
          Add startups from your current group:
        </div>
        <div className="col-sm-3 col-xs-12 drop-down">
          <Dropdown title="Group" items={items}></Dropdown>
        </div>
        <div className=""></div>
      </div>
      <div className="search">
        <span class="material-icons">search</span>
        <input className="search-box" placeholder="Search Member" type="text" />
      </div>
      <div className="startup-list">
        <div className="row startup">
          <div className="col-sm-8 col-xs-8 email">
            <i className="fal fa-times" />
            <span>denisgolvanov@gmail.com</span>
          </div>
          <div className="col-sm-4 col-xs-4 button invite-button">+ Invite</div>
        </div>
        <div className="row startup">
          <div className="col-sm-8 col-xs-8 email">
            <i className="fal fa-times" />
            <span>denisgolvanov@gmail.com</span>
          </div>
          <div className="col-sm-4 col-xs-4 button invite-button">+ Invite</div>
        </div>
        <div className="row startup">
          <div className="col-sm-8 col-xs-8 email">
            <i className="fal fa-times" />
            <span>denisgolvanov@gmail.com</span>
          </div>
          <div className="col-sm-4 col-xs-4 button invite-button">+ Invite</div>
        </div>
        <div className="row startup">
          <div className="col-sm-8 col-xs-8 email">
            <i className="fal fa-times" />
            <span>denisgolvanov@gmail.com</span>
          </div>
          <div className="col-sm-4 col-xs-4 button invite-button">+ Invite</div>
        </div>
        <div className="row startup">
          <div className="col-sm-8 col-xs-8 email">
            <i className="fal fa-times" />
            <span>denisgolvanov@gmail.com</span>
          </div>
          <div className="col-sm-4 col-xs-4 button invite-button">+ Invite</div>
        </div>
      </div>
    </div>
  );
}
