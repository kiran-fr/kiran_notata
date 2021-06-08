import Funnels from "./Funnels";
import React from "react";

export default function FunnelsComp({ connection }) {
  return (
    <div className="row funnel-summary-container">
      <div className="overview-container__scores__heading">Funnels</div>
      <Funnels />
    </div>
  );
}
