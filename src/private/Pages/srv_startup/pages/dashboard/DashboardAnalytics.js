import ReportAnalyticChart from "./report-analytics-chart";
import ReportAnalyticFunnel from "./report-analytics-funnel";
import React from "react";

export default function DashboardAnalytics() {
  return (
    <div className="card dashboard-container__reports-and-analytics">
      <div className="coming-soon">
        <div>Coming soon 🚀</div>
      </div>

      <div className="hide-and-blur">
        <div className="dashboard-container__reports-and-analytics__heading">
          Reports and analytics
        </div>
        <div className="dashboard-container__reports-and-analytics__scores-container">
          <div className="dashboard-container__reports-and-analytics__scores-container__score">
            <div className="dashboard-container__reports-and-analytics__scores-container__score__heading">
              All startups
            </div>
            <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container">
              <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__value">
                1825
              </div>
              <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance">
                <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__score">
                  +83
                </div>
                <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator">
                  <span className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator--up-arrow material-icons">
                    north
                  </span>
                  <span className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator--since-last">
                    since last
                    <br /> month
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-container__reports-and-analytics__scores-container__score">
            <div className="dashboard-container__reports-and-analytics__scores-container__score__heading">
              People in your network
            </div>
            <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container">
              <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__value">
                532
              </div>
              <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance">
                <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__score">
                  +24
                </div>
                <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator">
                  <span className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator--up-arrow material-icons">
                    north
                  </span>
                  <span className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator--since-last">
                    since last
                    <br /> month
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-container__reports-and-analytics__chart-funnel-container">
          <div className="dashboard-container__reports-and-analytics__chart-funnel-container--chart">
            <ReportAnalyticChart />
          </div>
          <div className="dashboard-container__reports-and-analytics__chart-funnel-container--chart">
            <ReportAnalyticFunnel />
          </div>
        </div>
      </div>
    </div>
  );
}
