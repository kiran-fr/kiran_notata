import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { groupGetRecentlyAddedStartups } from "../../../../Apollo/Queries";
import { Loader } from "../../../../../Components/elements";
import { group_dashboard } from "../../../../../definitions";
import Button from "@material-ui/core/Button";
import { Modal } from "../../../../../Components/UI_Kits";
import CreateNewGroup from "../../../StartupPage/TabPages/Groups/create-new-group/create-new-group";

export default function DashboardRecentlyAddedStartups({ history }) {
  const { data, error, loading } = useQuery(groupGetRecentlyAddedStartups);

  let list = data?.groupGetRecentlyAddedStartups || [];

  return (
    <>
      <div className="card dashboard-container__recently-added-card">
        <div className="card-heading-designer">Recently shared startups</div>

        {!data && loading && <Loader />}

        <div className="dashboard-container__recently-added-card__data-container">
          {!list.length && !(!data && loading) && (
            <div className="empty-wrapper">
              <div>
                <div>You are not in any groups</div>
              </div>
            </div>
          )}

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
              {/*<div className="evaluate">EvaluatePage</div>*/}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
