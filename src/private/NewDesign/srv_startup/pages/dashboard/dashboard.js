import React from "react";
import "./dashboard.scss";
import DashboardRecentlyAddedStartups from "./DashboardRecentlyAddedStartups";
import DashboardGroupInvitations from "./DashboardGroupInvitations";
import DashboardMyStartups from "./DashboardMyStartups";
import DashboardNews from "./DashboardNews";
import DashboardNotifications from "./DashboardNotifications";
import DashboardAnalytics from "./DashboardAnalytics";

export default function DashboardNew({ history }) {
  return (
    <div className="dashboard-container">
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
          <DashboardRecentlyAddedStartups history={history} />
        </div>

        <div className="col-lg-4 col-md-6  col-sm-12 col-xs-12">
          <DashboardGroupInvitations history={history} />
        </div>

        <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12">
          <DashboardMyStartups history={history} />
        </div>

        <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
          <DashboardNews history={history} />
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
          <DashboardNotifications history={history} />
        </div>

        <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12">
          <DashboardAnalytics history={history} />
        </div>
      </div>
    </div>
  );
}
