import React from "react";
import {
  progress_bar,
  progress_bar_inner
} from "./EvaluationProgressBar.module.css";

const EvaluationProgressBar = ({ percent, total, potential, bg }) => {
  return (
    <div
      className={progress_bar}
      style={{ backgroundColor: bg ? bg : "#eaeaea" }}
    >
      <div
        className={progress_bar_inner}
        style={{
          width: `${percent}%`,
          backgroundColor:
            (total <= potential / 3 && "red") ||
            (total >= (potential / 3) * 2 && "green") ||
            "orange"
        }}
      />
    </div>
  );
};

export default EvaluationProgressBar;
