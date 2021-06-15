import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { groupGetV2 } from "../../Apollo/Queries";
import "./group-dashboard.scss";
import { GhostLoader } from "Components/elements";
import StartupPerformanceChart from "./startup-performance-chart";
import CommentsActivities from "./comments-activities";
import CompanyNameAndDescription from "./CompanyNameAndDescription";
import ManageResources from "./ManageResources";
import StartupList from "./StartupList";

export default function GroupDashboard({ match, history }) {
  // Queries
  let [groupGet, { data, loading, error, called }] = useLazyQuery(groupGetV2);

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
  let group = data?.groupGetV2 || {};

  // Load if API is called, loading, and had not received data
  if (called && loading && !data) {
    return <GhostLoader />;
  }

  return (
    <>
      <div className="group-dashboard-container">
        <div
          className="row"
          style={{
            maxWidth: "1100px",
            margin: "auto",
          }}
        >
          {/*<div className="col-md-9 col-sm-12 col-xs-12 nopadding-left">*/}
          <div className="col-md-12 col-sm-12 col-xs-12 nopadding-left">
            <div className="row">
              {/* Company name and description */}
              <div className="col-sm-7 col-md-7">
                <div className="card">
                  <CompanyNameAndDescription group={group} history={history} />
                </div>
              </div>

              {/* Manage resources */}
              <div className="col-sm-5 col-md-5 nopadding-left">
                <div className="card">
                  <ManageResources group={group} />
                </div>
              </div>

              {/* Chart */}
              <div className="col-sm-12">
                <div className="card">
                  <StartupPerformanceChart group={group} />
                </div>
              </div>

              {/* Startups */}
              <StartupList group={group} history={history} />
            </div>
          </div>

          {/*<div className="col-md-3 col-sm-12 col-xs-12 comments-activities-container">*/}
          {/*  <CommentsActivities />*/}
          {/*</div>*/}
        </div>
      </div>
    </>
  );
}
