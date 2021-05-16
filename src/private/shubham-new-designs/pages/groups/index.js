import React from "react";
import "./index.scss";
import "../public.scss";

export default function Groups() {
  return (
    <div className="groups-contianer">
      <div className="card">
        <div className="card-heading">Groups</div>
        <div className="row data">
          <div className="col-sm-6 col-xs-6 data__name">Group 1</div>
          <div className="col-sm-2 col-xs-8 data__members">11 members</div>
          <div className="col-sm-2 col-xs-2  data__startups">15 startups</div>
          <div className="col-sm-2 col-xs-2 data__browse">...</div>
        </div>
      </div>
    </div>
  );
}
