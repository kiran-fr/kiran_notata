import React from "react";
// COMPONENT
import { Dropdown } from "../../../Components/UI_Kits/Dropdown";
// STYLES
import "./manage-templates.scss";

export default function ManageTemplates() {
  const templates = [
    "First impression",
    "Before Pitching",
    "After pitching",
    "Before pitching 2",
    "First impression 2",
  ];
  const items = [
    { id: 1, name: "First impression" },
    { id: 2, name: "Before Pitching" },
    { id: 3, name: "After pitching" },
    { id: 4, name: "Before pitching 2" },
    { id: 5, name: "After pitching 2" },
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
