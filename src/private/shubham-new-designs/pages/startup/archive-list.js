import React from "react";
import "./archive-list.scss";

export default function ArchiveList() {
  return (
    <div className="row tab-panel-container archive-list-container">
      <div className="col-sm-12">
        <div className="card">
          <div className="heading">Archive</div>
          <div className="startups">Startups</div>
          <div className="row">
            <div className="col-sm-4 col-xs-4 startup-name">
              Great Startup Inc
            </div>
            <div className="col-sm-4 col-xs-4 unarchive">UNARHIVE</div>
            <div className="col-sm-4 col-xs-4 delete-permanently">
              DELETE PERMANENTLY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
