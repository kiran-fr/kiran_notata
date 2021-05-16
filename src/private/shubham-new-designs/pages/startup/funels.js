import React from "react";
import { Dropdown } from "../../../../Components/UI_Kits/Dropdown";
import "./funels.scss";

export default function Funels() {
  const items = [
    { id: 1, name: "First" },
    { id: 2, name: "Before" },
    { id: 3, name: "After" },
  ];
  return (
    <div className="funels-contianer">
      <div className="row">
        <div className="col-sm-12 col-md-4 col-xs-12">
          <div className="row">
            <div className="col-sm-6 col-xs-3">
              <div className="funel-name">Funel 1</div>
              <div className="met">Met</div>
              <div>
                <i className="fa fa-times"></i>
              </div>
            </div>
            <div className="col-sm-6 col-xs-6">
              <div className="bar">
                <div className="highligh1"></div>
              </div>
              <div className="bar">
                <div className="highligh2-90"></div>
              </div>
              <div className="bar">
                <div className="highligh2-76"></div>
              </div>
              <div className="bar">
                <div className="highligh2-58"></div>
              </div>
              <div className="bar">
                <div className="highligh2-30"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-md-8 col-xs-12">
          <div className="funel-name add-new-funel">Add new funnel</div>
          <div className="add-new-funel dropdown">
            <Dropdown title="" items={items}></Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
