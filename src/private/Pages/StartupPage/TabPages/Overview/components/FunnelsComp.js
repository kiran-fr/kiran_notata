import React from "react";
import { accountGet } from "../../../../../Apollo/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { connectionFunnelTagAdd } from "../../../../../Apollo/Mutations";
import { Loader } from "../../../../../../Components/UI_Kits";
import { sortArr } from "../../../../commonFunctions";

let colorArray = ["red", "blue", "purple", "orange", "green"];

function Funnel({ connection, funnelGroup, selectedFunnelTags }) {
  // Mutations
  const [addTag, addTagRes] = useMutation(connectionFunnelTagAdd);

  if (!funnelGroup?.funnelTags?.length) {
    return <span />;
  }

  async function addTagFn(tag) {
    let variables = {
      connectionId: connection.id,
      funnelTagId: tag.id,
    };

    try {
      await addTag({ variables });
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <div className="funnels-container__funnels__funnel no-margin">
      {addTagRes.loading && <Loader />}

      <div className="funnels-container__funnels__funnel__heading">
        {funnelGroup.name}
      </div>

      <div className="parts">
        {!!funnelGroup?.funnelTags?.length &&
          funnelGroup.funnelTags.map((tag, index) => {
            // Max width of bar
            let max = 180;

            // Min width of bar
            let min = 20;

            // Difference
            let diff = max - min;

            // Increments
            let inc = Math.round(diff / funnelGroup.funnelTags.length);

            // Max with - increment multiplied by index
            let width = `${max - inc * index}px`;

            let isSelected = selectedFunnelTags.some(({ id }) => id === tag.id);

            let color = !isSelected
              ? "gray"
              : tag.color || colorArray[index] || "red";

            return (
              <div
                className="parts__part"
                key={tag.id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  addTagFn(tag, isSelected);
                }}
              >
                <div className="parts__part__heading">{tag.name}</div>
                <div className="parts__part__color_block">
                  <div
                    className={`parts__part__funnel ${color}`}
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function FunnelsComp({ connection }) {
  // Queries
  const { data, loading } = useQuery(accountGet);

  let funnelGroups = data?.accountGet?.funnelGroups || [];
  let funnelTags = sortArr(connection?.funnelTags);


  return (
    <div className="row funnel-summary-container">
      <div className="overview-container__scores__heading">Funnels</div>
      {/*<div className="tags-container__sub-heading">*/}
      {/*  Adding tags makes it easier to filter, find similar startups, and makes great analytics*/}
      {/*</div>*/}

      {/* FUNNELS */}
      <div className="funnels-container__funnels">
        {funnelGroups.map(funnelGroup => {
          return (
            <Funnel
              key={funnelGroup.id}
              connection={connection}
              funnelGroup={funnelGroup}
              selectedFunnelTags={funnelTags}
            />
          );
        })}
      </div>
    </div>
  );
}
