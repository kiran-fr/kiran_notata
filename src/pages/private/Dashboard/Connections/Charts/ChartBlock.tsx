import React, { useState } from "react";
import styles from "./ChartBlock.module.css";

export enum ChartType {
  PIE = "PIE",
  BAR = "BAR",
}

export enum WidthState {
  HALF = "HALF",
  FULL = "FULL",
}

export const ChartBlock = ({
  header,
  showSelector,
  initialWidthState = WidthState.HALF,
  onDeleteBlock,
  ...props
}: any) => {
  const [chartType, setChartType] = useState<ChartType>(ChartType.BAR);
  const [widthState, setWidthState] = useState<WidthState>(initialWidthState);
  const [lengthFilter, setlengthFilter] = useState(0);

  return (
    <div
      className={`${styles.content} ${
        widthState === WidthState.FULL ? styles.flex_100 : styles.flex_50
      }`}
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

          <button className={styles.width_type} onClick={onDeleteBlock}>
            <i className="fas fa-trash-alt" />
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
