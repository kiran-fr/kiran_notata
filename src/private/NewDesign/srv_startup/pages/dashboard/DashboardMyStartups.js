import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { connectionsGet } from "../../../../Apollo/Queries";
import SubjectiveScoreModal from "../../../Startup/Modal/SubjectiveScoreModal";
import { Loader } from "../../../../../Components/elements";
import { startup_page } from "../../../../../definitions";
import { DynamicIcons } from "../../../CommonFunctions";


export default function DashboardMyStartups({ history }) {
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
  const { data, loading, error } = useQuery(connectionsGet, { variables });

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

          console.log('newbie', startup)
          let tagSet;
            if (startup.funnelTags.length) {
              let highest = startup.funnelTags.reduce(
                (max, tag) => (tag.index > max ? tag.index : max),
                startup.funnelTags[0].index
              );
              tagSet = startup.funnelTags.find(({ index }) => index === highest);
            }

            console.log('newbie123', tagSet)
          return (
            <div
              className="dashboard-container__my-startups__data-container__data-entry"
              key={startup.id}
            >
              <div className="dashboard-container__my-startups__data-container__data-entry__startup-name">
                {startup?.creative?.name}
              </div>
              {tagSet ?
              <div className="dashboard-container__my-startups__data-container__data-entry__funnels">
                {/* <div className="dashboard-container__my-startups__data-container__data-entry__funnels__funnel"> */}
                  {/* <div className="red-100" />
                  <div className="gray-80" />
                  <div className="gray-60" />
                  <div className="gray-40" />
                  <div className="gray-20" /> */}
                {/* </div> */}
                <div className="dashboard-container__my-startups__data-container__data-entry__funnels__funnel-type">
                  <img alt="" src={DynamicIcons(tagSet.index)} />
                  {tagSet.name}
                </div>
              </div>
              :
                "+" 
              }
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
