import React from "react";
import "./add-startup.scss";

export default function AddStartup() {
  return (
    <div className="startup-container">
      <div className="search">
        <span class="material-icons">search</span>
        <input
          className="search-box"
          placeholder="Search Startup"
          type="text"
        />
      </div>
      <div className="startup-list">
        <div className="row startup">
          <div className="col-sm-8 col-xs-8 name">
            <i className="fal fa-times" />
            <span>Great Startup 1</span>
          </div>
          <div className="col-sm-4 col-xs-4 button">+ Add</div>
        </div>
        <div className="row startup">
          <div className="col-sm-8 col-xs-8 name">
            <i className="fal fa-times" />
            <span>Great Startup 1</span>
          </div>
          <div className="col-sm-4 col-xs-4 button">+ Add</div>
        </div>
        <div className="row startup">
          <div className="col-sm-8 col-xs-8 name">
            <i className="fal fa-times" />
            <span>Great Startup 1</span>
          </div>
          <div className="col-sm-4 col-xs-4 button">+ Add</div>
        </div>
        <div className="row startup">
          <div className="col-sm-8 col-xs-8 name">
            <i className="fal fa-times" />
            <span>Great Startup 1</span>
          </div>
          <div className="col-sm-4 col-xs-4 button">+ Add</div>
        </div>
      </div>
    </div>
  );
}
