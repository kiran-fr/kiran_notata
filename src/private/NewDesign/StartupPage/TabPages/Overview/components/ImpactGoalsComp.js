import React, { useEffect, useState } from "react";
import images from "../../../Images";
import { useLazyQuery, useMutation } from "@apollo/client";
import { impactGoalsGet } from "../../../../../Apollo/Queries";
import { connectionPut, impactGoalsPut } from "../../../../../Apollo/Mutations";

export default function ImpactGoalsComp({ connection }) {
  const [activeImage, setActiveImage] = useState([]);

  let [setGoals] = useMutation(connectionPut);

  useEffect(() => {
    if (!connection?.impactGoals) {
      return;
    }
    setActiveImage(connection?.impactGoals.map(({ key }) => key));
  }, [connection]);

  return (
    <div className="row impact-goals-container">
      <div className="impact-goals-container__heading">Impact Goals</div>
      <div className="tags-container__sub-heading">
        What UN impact goals fits for this startup?
      </div>

      {images.map(item => {
        return (
          <div
            key={item.key}
            onClick={() => {
              let isSelected = activeImage.find(key => key === item.key);

              let selected;

              // remove
              if (isSelected) {
                selected = activeImage.filter(key => key !== item.key);
              }

              // add
              if (!isSelected) {
                selected = [...new Set([...activeImage, item.key])];
              }

              setActiveImage(selected);

              let variables = {
                id: connection.id,
                input: {
                  impactGoals: selected.map(n => ({ key: n, val: n })),
                },
              };

              setGoals({ variables });
            }}
            className={`col-sm-4 col-md-3 col-lg-2 col-xs-4 img-col ${
              activeImage.includes(item.key) ? "active-img-col" : ""
            }`}
            style={{ cursor: "pointer" }}
          >
            <img src={item.src} />
          </div>
        );
      })}
    </div>
  );
}
