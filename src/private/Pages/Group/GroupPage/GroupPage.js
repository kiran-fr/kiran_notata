import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { groupGetV2 } from "../../../Apollo/Queries";
import "./GroupPage.scss";
import { GhostLoader } from "Components/elements";
import StartupPerformanceChart from "./sections/Graphs/startup-performance-chart";
import InfoSection from "./sections/InfoSection/InfoSection";
import ManageResources from "./sections/ManageResources/ManageResources";
import StartupList from "./sections/StartupList/StartupList";

export default function GroupPage({ match, history }) {
  const [viewAsMember, setViewAsMember] = useState(false);

  // Queries
  let [groupGet, { data, loading, called, refetch }] = useLazyQuery(groupGetV2);

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

  let adminView = group?.iAmAdmin && !viewAsMember;

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
            <div className="row group-dashboard-container__header-row">
              {/* Company name and description */}
              <div className="col-sm-12 col-md-7">
                <div className="card">
                  <InfoSection
                    group={group}
                    refetch={refetch}
                    history={history}
                    adminView={adminView}
                  />
                </div>
              </div>

              {/* Manage resources */}
              <div className="col-sm-12 col-md-5 nopadding-left">
                <div className="card">
                  <ManageResources
                    group={group}
                    setViewAsMember={setViewAsMember}
                    adminView={adminView}
                  />
                </div>
              </div>
            </div>

            {/* Chart */}

            {
              // || group?.Settings?.showScores
              // You are admin and is not viewing as member
              adminView && (
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card">
                      <StartupPerformanceChart
                        group={group}
                        adminView={adminView}
                      />
                    </div>
                  </div>
                </div>
              )
            }

            {/* Startups */}
            <StartupList
              group={group}
              history={history}
              adminView={adminView}
            />
          </div>
        </div>

        {/*<div className="col-md-3 col-sm-12 col-xs-12 comments-activities-container">*/}
        {/*  <CommentsActivities />*/}
        {/*</div>*/}
      </div>
    </>
  );
}
