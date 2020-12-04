import React, { useState } from "react";
import styles from "./ChartBlock.module.css";

export enum ChartType {
  PIE = "PIE",
  BAR = "BAR",
}

enum WidthState {
  HALF = "HALF",
  FULL = "FULL",
}

const ChartBlock = ({ header, showSelector, ...props }: any) => {
  const [chartType, setChartType] = useState<ChartType>(ChartType.BAR);
  const [widthState, setWidthState] = useState<WidthState>(WidthState.FULL);
  const [lengthFilter, setlengthFilter] = useState(0);

  return (
    <div
      className={styles.content}
      style={{ width: widthState === WidthState.FULL ? "100%" : "50%" }}
    >
      <div className={styles.header_text}>{header}</div>

      {showSelector && (
        <div className={styles.block_controls}>
          <input
            onChange={e => setlengthFilter(parseInt(e.target.value))}
            className={styles.filter_input}
          />
          <button
            onClick={() =>
              setWidthState(
                widthState === WidthState.HALF
                  ? WidthState.FULL
                  : WidthState.HALF
              )
            }
            className={styles.width_type}
          >
            <i
              className={`fas ${
                widthState === WidthState.HALF
                  ? "fa-expand-alt"
                  : "fa-compress-alt"
              }`}
            />
          </button>

          <button
            className={styles.chart_type}
            onClick={() =>
              setChartType(
                chartType === ChartType.PIE ? ChartType.BAR : ChartType.PIE
              )
            }
          >
            <i
              className={`fas ${
                chartType === ChartType.PIE ? "fa-chart-pie" : "fa-chart-bar"
              }`}
            />
          </button>
        </div>
      )}

      <div>
        {React.cloneElement(props.children, {
          chartType,
          widthState,
          lengthFilter,
        })}
      </div>
    </div>
  );
};

export default ChartBlock;
