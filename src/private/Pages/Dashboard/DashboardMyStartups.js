import React, { useState } from "react";
// API
import { useQuery } from "@apollo/client";
import { connectionsGet } from "../../Apollo/Queries";
// COMPONENTS
import SubjectiveScoreModal from "../MyStartups/Modal/SubjectiveScoreModal";
import { Loader } from "../../../Components/elements";
// OTHERS
import { startup_page } from "../../../definitions";
import { dynamicIcons } from "../commonFunctions";

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
  let connections = data?.connectionsGet || [];

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
          <div className="dashboard-container__my-startups__data-container__data-entry__heading hide-tab-design">
            Subjective Score
          </div>
        </div>

        {connections.map(connection => {
          let scores = connection.subjectiveScores;
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
          if (connection.funnelTags.length) {
            let highest = connection.funnelTags.reduce(
              (max, tag) => (tag.index > max ? tag.index : max),
              connection.funnelTags[0].index
            );
            tagSet = connection.funnelTags.find(
              ({ index }) => index === highest
            );
          }
          return (
            <div
              className="dashboard-container__my-startups__data-container__data-entry"
              key={connection.id}
            >
              <div className="dashboard-container__my-startups__data-container__data-entry__startup">
                <div className="dashboard-container__my-startups__data-container__data-entry__mobile-heading">
                  Name
                </div>
                <div
                  className="dashboard-container__my-startups__data-container__data-entry__startup__name"
                  onClick={() => {
                    history.push(`${startup_page}/company/${connection.id}`);
                  }}
                >
                  {connection?.creative?.name}
                </div>
              </div>
              <div className="dashboard-container__my-startups__data-container__data-entry__funnels-entry">
                <div className="dashboard-container__my-startups__data-container__data-entry__mobile-heading">
                  stage
                </div>
                <div className="dashboard-container__my-startups__data-container__data-entry__funnels-entry__data">
                  {tagSet ? (
                    <img alt="" src={dynamicIcons(tagSet.index)} />
                  ) : (
                    ""
                  )}
                  <div className="dashboard-container__my-startups__data-container__data-entry__funnels-entry__data__funnel-type">
                    {tagSet ? tagSet.name : "n/a"}
                  </div>
                </div>
              </div>
              <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score-container hide-tab-design">

                <div className="dashboard-container__my-startups__data-container__data-entry__mobile-heading">
                  subjective score
                </div>
                <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score-container__data">
                  <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score-container__data__score">
                    {score ? score : "n/a"}
                  </div>
                  <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score-container__data__change">
                    <div
                      className="dashboard-container__my-startups__data-container__data-entry__subjective-score-container__data__change__btn"
                      onClick={() => setEditScoreForConnection(connection)}
                    >
                      Set
                    </div>
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
