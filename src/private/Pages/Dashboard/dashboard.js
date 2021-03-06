import React from "react";
// COMPONENTS
import DashboardRecentlyAddedStartups from "./DashboardRecentlyAddedStartups";
import DashboardGroupInvitations from "./DashboardGroupInvitations";
import DashboardMyStartups from "./DashboardMyStartups";
import DashboardNews from "./DashboardNews";
import DashboardNotifications from "./DashboardNotifications";
import DashboardAnalytics from "./DashboardAnalytics";
// STYLES
import "./dashboard.scss";

export default function Dashboard({ history }) {
  return (
    <>
      <div className="header-routing">
        <span className="header-routing__name">Dashboard</span>
        <i className="fal fa-chevron-right header-routing__stilt"></i>
        <span className="header-routing__name">Startup Name</span>
      </div>
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
    </>
  );
}
