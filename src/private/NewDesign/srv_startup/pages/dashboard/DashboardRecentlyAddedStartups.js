import React from "react";
import { useQuery } from "@apollo/client";
import { groupGetRecentlyAddedStartups } from "../../../../Apollo/Queries";
import { Loader } from "../../../../../Components/elements";
import { group_dashboard } from "../../../../../definitions";

export default function DashboardRecentlyAddedStartups({ history }) {
  const { data, error, loading } = useQuery(groupGetRecentlyAddedStartups);

  let list = data?.groupGetRecentlyAddedStartups || [];

  return (
    <div className="card dashboard-container__recently-added-card">
      <div className="card-heading-designer">Recently added startups</div>

      {loading && <Loader />}

      <div className="dashboard-container__recently-added-card__data-container">
        {list.map(({ group, creative }) => (
          <div
            className="dashboard-container__recently-added-card__data-container__data-entry"
            key={`${group.id}-${creative.id}`}
          >
            <div className="startup-name">{creative.name}</div>
            <div
              className="group-name"
              onClick={() => {
                history.push(`${group_dashboard}/${group.id}`);
              }}
            >
              {group.name}
            </div>
            {/*<div className="evaluate">Evaluate</div>*/}
          </div>
        ))}
      </div>
    </div>
  );
}
