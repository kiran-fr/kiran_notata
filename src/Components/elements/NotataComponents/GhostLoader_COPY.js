import React from "react";
import classnames from "classnames";
import { container } from "./GhostLoader.module.css";

export const GhostLoader = () => (
  <div className={container} style={{ color: "var(--color-secondary)" }}>
    <i className="fal fa-spinner fa-spin" />
  </div>
);
