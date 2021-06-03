import React, { useState } from "react";
import { Dropdown } from "../../../../../../../Components/UI_Kits/Dropdown";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  connectionAutoCompleteName,
  groupsGetV2,
} from "../../../../../../Apollo/Queries";

export default function Startup({ data, setData }) {
  // Queries
  let groupsQuery = useQuery(groupsGetV2);

  let [getStartups, getStartupsRes] = useLazyQuery(connectionAutoCompleteName);

  // States
  const [selected, setSelected] = useState();

  // Data maps
  let items = groupsQuery?.data?.groupsGetV2 || {};
  let suggestions = getStartupsRes?.data?.connectionAutoCompleteName || [];

  suggestions = suggestions.filter(
    ({ creativeId }) => !getAdded().some(({ id }) => creativeId === id)
  );

  const getAdded = () =>
    Object.keys(data.startups)
      .map(creativeId => data.startups[creativeId])
      .filter(x => x);

  return (
    <div className="startup-container">
      <div className="add-startups row">
        <div className="col-sm-7 col-xs-12 add-text">
          Add startups from your current group:
        </div>
        <div className="col-sm-3 col-xs-12 drop-down">
          <Dropdown
            title="Group"
            items={items}
            setSelectedItem={item => {
              setSelected(item);
            }}
          />
        </div>
        <div className="" />
      </div>

      <div className="startup-list">
        {selected?.startups?.map(startup => {
          return (
            <div className="row startup" key={startup.creative.id}>
              <div className="col-sm-8 col-xs-8 name">
                <span>{startup.creative.name}</span>
              </div>
              <div
                className="col-sm-4 col-xs-4 button"
                onClick={() => {
                  setData({
                    ...data,
                    startups: {
                      ...data.startups,
                      [startup.creative.id]: data.startups[startup.creative.id]
                        ? undefined
                        : startup.creative,
                    },
                  });
                }}
              >
                {data.startups[startup.creative.id] ? "added" : "+ Add"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="search">
        {(getStartupsRes.loading && (
          <i className="fa fas-spinner fa-spin" />
        )) || <span className="material-icons">search</span>}

        <input
          className="search-box"
          placeholder="Search Startup"
          type="text"
          onChange={e => {
            let search = e.target?.value;
            getStartups({ variables: { search } });
          }}
        />
      </div>

      <div className="startup-list">
        {suggestions?.map(suggestion => {
          return (
            <div className="row startup" key={suggestion.creativeId}>
              <div className="col-sm-8 col-xs-8 name">
                {/*<i className="fal fa-times" />*/}
                <span>{suggestion.creativeName}</span>
              </div>
              <div
                className="col-sm-4 col-xs-4 button"
                onClick={() => {
                  setData({
                    ...data,
                    startups: {
                      ...data.startups,
                      [suggestion.creativeId]: data.startups[
                        suggestion.creativeId
                      ]
                        ? undefined
                        : {
                            id: suggestion.creativeId,
                            name: suggestion.creativeName,
                          },
                    },
                  });
                }}
              >
                {data.startups[suggestion.creativeId] ? "added" : "+ Add"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="startup-list">
        <hr />
        {getAdded().map(creative => {
          return (
            <div className="row startup" key={creative.id}>
              <div className="col-sm-8 col-xs-8 name">
                <i
                  className="fal fa-times"
                  onClick={() => {
                    setData({
                      ...data,
                      startups: {
                        ...data.startups,
                        [creative.id]: undefined,
                      },
                    });
                  }}
                />
                <span>{creative.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
