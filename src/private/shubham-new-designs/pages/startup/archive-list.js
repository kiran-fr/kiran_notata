import React from "react";
import "./archive-list.scss";
import { OVERVIEWPAGESTATE } from "../constants";

export default function ArchiveList({ setPageState }) {
  let noOfRows = 5;
  return (
    <div className="row tab-panel-container archive-list-container">
      <div className="col-sm-12">
        <div className="card">
          <div className="heading">Archive</div>
          <div className="startups">Startups</div>
          <div className="archive-list-data">
            {[...Array(noOfRows)].map((elementInArray, index) => {
              return (
                <div className="row" key={`row-id-${index}`}>
                  <div className="col-sm-4 col-xs-12 startup-name">
                    Great Startup Inc
                  </div>
                  <div
                    className="col-sm-4 col-xs-12 unarchive"
                    onClick={() => setPageState(OVERVIEWPAGESTATE.OVERVIEW)}
                  >
                    UNARHIVE
                  </div>
                  <div
                    className="col-sm-4 col-xs-12 delete-permanently"
                    onClick={() => setPageState(OVERVIEWPAGESTATE.OVERVIEW)}
                  >
                    DELETE PERMANENTLY
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
