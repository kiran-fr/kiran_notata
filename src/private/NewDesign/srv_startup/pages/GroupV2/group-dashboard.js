import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { groupGetV2 } from "../../../../Apollo/Queries";
import "./group-dashboard.scss";
import StartupPerformanceChart from "./startup-performance-chart";
import CommentsActivities from "./comments-activities";
import { GhostLoader } from "../../../../../Components/elements";
import CompanyNameAndDescription from "./CompanyNameAndDescription";
import ManageResources from "./ManageResources";
import StartupList from "./StartupList";

export default function GroupDashboard({ match }) {
  // Queries
  let [groupGet, groupRes] = useLazyQuery(groupGetV2);

  // Execute lazy query
  useEffect(() => {
    if (match.params.groupId) {
      let variables = {
        id: match.params.groupId,
      };
      groupGet({ variables });
    }
  }, [match]);

  // Define group
  let group = groupRes?.data?.groupGetV2 || {};

  if (groupRes?.loading && !groupRes?.data) {
    return <GhostLoader />;
  }

  return (
    <>
      <div className="group-dashboard-container">
        <div className="row">
          <div className="col-md-9 col-sm-12 col-xs-12 nopadding-left">
            <div className="row">
              {/* Company name and description */}
              <div className="col-sm-7 col-md-7">
                <div className="card">
                  <CompanyNameAndDescription group={group} />
                </div>
              </div>

              {/* Manage resources */}
              <div className="col-sm-5 col-md-5 nopadding-left">
                <div className="card">
                  <ManageResources group={group} />
                </div>
              </div>

              {/* Chart */}
              <div className="col-sm-12 startup-container">
                <div className="card">
                  <StartupPerformanceChart group={group} />
                </div>
              </div>

              {/* Startups */}
              <StartupList group={group} />
            </div>
          </div>
          <div className="col-md-3 col-sm-12 col-xs-12 comments-activities-container">
            <CommentsActivities />
          </div>
        </div>
      </div>
    </>
  );
}
