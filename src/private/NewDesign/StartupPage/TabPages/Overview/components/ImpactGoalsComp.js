import React, { useState } from "react";
import images from "../../../Images";

export default function ImpactGoalsComp({ connection }) {
  const [activeImage, setActiveImage] = useState([]);

  return (
    <div className="row impact-goals-container">
      <div className="impact-goals-container__heading">Impact Goals</div>
      <div className="impact-goals-container__sub-heading">
        Write or choose tags
      </div>
      {images.map(item => {
        return (
          <div
            key={item.key}
            onClick={() => setActiveImage([...activeImage, item.key])}
            className={`col-sm-4 col-md-3 col-lg-2 col-xs-4 img-col ${
              activeImage.includes(item.key) ? "active-img-col" : ""
            }`}
          >
            <img src={item.src} />
          </div>
        );
      })}
    </div>
  );
}
