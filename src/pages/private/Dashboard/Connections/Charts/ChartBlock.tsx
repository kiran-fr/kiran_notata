import React, { useState } from "react";
import styles from "./ChartBlock.module.css";

export enum ChartType {
  PIE = "PIE", BAR = "BAR"
}

enum WidthState {
  HALF = "HALF", FULL = "FULL"
}

const ChartBlock = ({ header, showSelector, ...props }: any) => {
  const [chartType, setChartType] = useState<ChartType>(ChartType.BAR);
  const [widthState, setWidthState] = useState<WidthState>(WidthState.FULL);

  return (
    <>
      <div className={styles.content} style={{width: widthState === WidthState.FULL ? '100%' : '50%'}}>
        <div className={styles.header_text}>{header}</div>

        {
          showSelector && (
            <div className={styles.block_controls}>
              <button
                className={styles.width_type}
              >
                {widthState === WidthState.HALF ? (
                  <i className="fas fa-expand-alt" onClick={() => setWidthState(WidthState.FULL)}/>
                ) : (
                  <i className="fas fa-compress-alt" onClick={() => setWidthState(WidthState.HALF)}/>
                )}
              </button>

              <button
                className={styles.chart_type}
              >
                {chartType === ChartType.PIE ? (
                  <i className="fas fa-chart-pie" onClick={() => setChartType(ChartType.BAR)}/>
                ) : (
                  <i className="fas fa-chart-bar" onClick={() => setChartType(ChartType.PIE)}/>
                )}
              </button>
            </div>
          )
        }

        <div>{React.cloneElement(props.children, { chartType, widthState})}</div>
      </div>
    </>
  );
};

export default ChartBlock;
