import React from "react";

export const GhostLoader = ({ small }) => (
  <div className={small ? "lds-roller lds-roller-small" : "lds-roller"}>
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);
