import React from "react";

import classnames from "classnames";
import styles from "./modal.module.css";

// Main function

export function AddScore({ subScore, handleScore }) {
  return (
    <div className={styles.score}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sc => (
        <div
          key={`sc-${sc}`}
          className={classnames(
            styles.child,
            subScore === sc ? styles.activeChild : ""
          )}
          onClick={() => handleScore(sc)}
        >
          <p>{sc}</p>
        </div>
      ))}
    </div>
  );
}
