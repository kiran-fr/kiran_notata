import React from "react";
import "./manage-templates.scss";
import { Dropdown } from "../../../../../Components/UI_Kits/Dropdown";

export default function ManageTemplates() {
  const templates = [
    "First impression",
    "Before Pitching",
    "After pitching",
    "Before pitching 2",
    "First impression 2",
  ];
  const items = [
    { id: 1, title: "First impression" },
    { id: 2, title: "Before Pitching" },
    { id: 3, title: "After pitching" },
    { id: 4, title: "Before pitching 2" },
    { id: 5, title: "After pitching 2" },
  ];
  return (
    <div className="row manage-template-container">
      <div className="col-sm-6 col-xs-12 selected-templates">
        <div className="heading">Group templates</div>
        {templates.map((item, index) => {
          return (
            <div className="group-template" key={`template-${index}`}>
              <i class="fa fa-times" aria-hidden="true"></i>
              {item}
            </div>
          );
        })}
      </div>
      <div className="col-sm-6 col-xs-12 add-tenmplate">
        <div className="heading">Add Template</div>
        <Dropdown title="Template Name" items={items}></Dropdown>
      </div>
    </div>
  );
}
