import React from "react";
// STYLES 
import "./report-analytics-funnel.scss";
// IMAGES 
import columnChart from "../../../../../assets/images/column-chart.png";
import filter from "../../../../../assets/images/filter.png";

export default function ReportAnalyticFunnel() {
  return (
    <div className="reports-analytics-funnel">
      <div className="reports-analytics-funnel__top-bar">
        <div className="reports-analytics-funnel__top-bar--tags">
          <span className="reports-analytics-funnel__top-bar--tags--heading">
            funnel:
          </span>
          <span className="reports-analytics-funnel__top-bar--tags--select-tag">
            stages:
            <i class={`fa fa-chevron-down`} aria-hidden="true"></i>
          </span>
        </div>
        <div className="reports-analytics-funnel__top-bar--chart-types">
          <img src={filter} />
          <img src={columnChart} />
        </div>
      </div>
      <div className="reports-analytics-funnel__funnels">
        <div className="reports-analytics-funnel__funnels__funnel">
          <div className="score">58</div>
          <div className="funnel-chart">
            <div className="red"></div>
          </div>
          <div className="funnel-type">Reviewed</div>
        </div>
        <div className="reports-analytics-funnel__funnels__funnel">
          <div className="score">20</div>
          <div className="funnel-chart">
            <div className="blue"></div>
          </div>
          <div className="funnel-type">Met</div>
        </div>
        <div className="reports-analytics-funnel__funnels__funnel">
          <div className="score">20</div>
          <div className="funnel-chart">
            <div className="purple"></div>
          </div>
          <div className="funnel-type">Analyzed</div>
        </div>
        <div className="reports-analytics-funnel__funnels__funnel">
          <div className="score">20</div>
          <div className="funnel-chart">
            <div className="orange"></div>
          </div>
          <div className="funnel-type">IC</div>
        </div>
        <div className="reports-analytics-funnel__funnels__funnel">
          <div className="score">20</div>
          <div className="funnel-chart">
            <div className="green"></div>
          </div>
          <div className="funnel-type">Invested</div>
        </div>
      </div>
    </div>
  );
}
