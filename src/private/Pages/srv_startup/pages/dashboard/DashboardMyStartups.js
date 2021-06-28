import React, { useState } from "react";
// API 
import { useQuery } from "@apollo/client";
import { connectionsGet } from "../../../../Apollo/Queries";
// COMPONENTS 
import SubjectiveScoreModal from "../../../Startup/Modal/SubjectiveScoreModal";
import { Loader } from "../../../../../Components/elements";
// OTHERS
import { startup_page } from "../../../../../definitions";
import { DynamicIcons } from "../../../CommonFunctions";

export default function DashboardMyStartups({ history }) {
  // STATES
  const [editScoreForConnection, setEditScoreForConnection] = useState(
    undefined
  );

  let variables = {
    filters: {
      limit: 3,
      sortBy: "UPDATED_AT",
      sortDirection: "DESC",
    },
  };
  // QUERIES 
  const { data, loading, error } = useQuery(connectionsGet, { variables });

  // DATA MAPS 
  let startups = data?.connectionsGet || [];

  return (
    <div className="card dashboard-container__my-startups">
      <div className="dashboard-container__my-startups__heading">
        My startups
      </div>

      {!data && loading && <Loader />}

      <div className="dashboard-container__my-startups__data-container">
        <div className="dashboard-container__my-startups__data-container__data-entry data-entry-heading">
          <div className="dashboard-container__my-startups__data-container__data-entry__heading">
            Name
          </div>
          <div className="dashboard-container__my-startups__data-container__data-entry__heading">
            Stage
          </div>
          <div className="dashboard-container__my-startups__data-container__data-entry__heading">
            Subjective Score
          </div>
        </div>

        {startups.map(startup => {
          let scores = startup.subjectiveScores;
          let score = "n/a";

          if (scores.length === 1) {
            score = scores[0].score.toFixed(1);
          }

          if (scores && scores.length && scores.length !== 1) {
            score = (
              scores.reduce((a, b) => a.score + b.score) / scores.length
            ).toFixed(1);
          }
          let tagSet;
          if (startup.funnelTags.length) {
            let highest = startup.funnelTags.reduce(
              (max, tag) => (tag.index > max ? tag.index : max),
              startup.funnelTags[0].index
            );
            tagSet = startup.funnelTags.find(({ index }) => index === highest);
          }
          return (
            <div
              className="dashboard-container__my-startups__data-container__data-entry"
              key={startup.id}
            >
              <div className="dashboard-container__my-startups__data-container__data-entry__startup-name">
                {startup?.creative?.name}
              </div>
              <div className="dashboard-container__my-startups__data-container__data-entry__funnels">
                {tagSet ? <img alt="" src={DynamicIcons(tagSet.index)} /> : ""}
                <div className="dashboard-container__my-startups__data-container__data-entry__funnels__funnel-type">
                  {tagSet ? tagSet.name : "n/a"}
                </div>
              </div>
              <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score">
                <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__score">
                  {score ? score : "n/a"}
                </div>
                <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__change">
                  <div
                    className="dashboard-container__my-startups__data-container__data-entry__subjective-score__change__btn"
                    onClick={() => setEditScoreForConnection(startup)}
                  >
                    Set
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="dashboard-container__my-startups__more-startups"
        onClick={() => {
          history.push(startup_page);
        }}
      >
        VIEW STARTUPS
      </div>

      {editScoreForConnection && (
        <SubjectiveScoreModal
          connection={editScoreForConnection}
          close={() => setEditScoreForConnection(undefined)}
        />
      )}
    </div>
  );
}
