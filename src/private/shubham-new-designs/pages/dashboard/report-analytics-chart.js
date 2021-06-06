import React, { useState } from "react";
import "./report-analytics-chart.scss";
import ghraphChart from "../../../../assets/images/bar-graph.png";
import selectedBarGraphChart from "../../../../assets/images/selected-bar-graph.png";
import selectedColumnGraph from "../../../../assets/images/column-graph-selected.png";
import pieChart from "../../../../assets/images/pi-chart.png";
import selectedPieChart from "../../../../assets/images/pie-chart-selected.png";
import columnChart from "../../../../assets/images/column-chart.png";
import { REPORTCHARTS } from "../constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Cell,
  Label,
} from "recharts";
const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    midAngle,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius - 55) * cos;
  const sy = cy + (outerRadius - 55) * sin;
  return (
    <Sector
      cx={sx}
      cy={sy}
      innerRadius={30}
      outerRadius={65}
      startAngle={startAngle}
      endAngle={endAngle}
      fill="url(#gradient1)"
    />
  );
};
export default function ReportAnalyticChart() {
  const data = [
    { techValue: 50, startupName: "FINTECH" },
    { techValue: 40, startupName: "PROPTECH" },
    { techValue: 35, startupName: "ADTECH" },
    { techValue: 25, startupName: "GAMING" },
  ];
  const pieChartData = [
    { value: 44, color: "url(#gradient1)" },
    { value: 31, color: "url(#gradient2)" },
    { value: 25, color: "url(#gradient3)" },
  ];
  const [selectedChart, setSelectedChart] = useState(REPORTCHARTS.PIE);
  return (
    <div className="reports-analytics-chart">
      <div className="reports-analytics-chart__top-bar">
        <div className="reports-analytics-chart__top-bar--tags">
          <span className="reports-analytics-chart__top-bar--tags--heading">
            TAGS:
          </span>
          <span className="reports-analytics-chart__top-bar--tags--select-tag">
            Market:
            <i class={`fa fa-chevron-down`} aria-hidden="true"></i>
          </span>
        </div>
        <div className="reports-analytics-chart__top-bar--chart-types">
          <img
            src={
              selectedChart === REPORTCHARTS.BAR
                ? selectedBarGraphChart
                : ghraphChart
            }
            class={`${selectedChart === REPORTCHARTS.BAR ? "selected" : ""}`}
            onClick={() => setSelectedChart(REPORTCHARTS.BAR)}
          />
          <img
            src={
              selectedChart === REPORTCHARTS.COLUMN
                ? selectedColumnGraph
                : columnChart
            }
            class={`${selectedChart === REPORTCHARTS.COLUMN ? "selected" : ""}`}
            onClick={() => setSelectedChart(REPORTCHARTS.COLUMN)}
          />
          <img
            src={
              selectedChart === REPORTCHARTS.PIE ? selectedPieChart : pieChart
            }
            class={`${selectedChart === REPORTCHARTS.PIE ? "selected" : ""}`}
            onClick={() => setSelectedChart(REPORTCHARTS.PIE)}
          />
        </div>
      </div>
      {selectedChart === REPORTCHARTS.COLUMN && (
        <div
          className={`reports-analytics-chart__${selectedChart.toLowerCase()}`}
        >
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 15,
              }}
            >
              <CartesianGrid
                strokeDasharray="0"
                stroke="#F1F1F1"
                vertical={false}
              />
              <XAxis
                dataKey="startupName"
                tick={{
                  fontSize: 8,
                  fontWeight: "bold",
                  letterSpacing: "0.08em",
                  fontFamily: "Proxima Nova",
                  color: "#969BA3",
                }}
                axisLine={false}
              />
              <YAxis
                tick={{
                  fontSize: 10,
                  fontWeight: "bold",
                  letterSpacing: "0.08em",
                  fontFamily: "Proxima Nova",
                  color: "#969BA3",
                }}
                minTickGap={10}
                domain={[0, 50]}
                axisLine={false}
                type="number"
              />
              <Bar
                dataKey="techValue"
                fill="#94E3D3"
                barSize={40}
                radius={[20, 20, 20, 20]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {selectedChart === REPORTCHARTS.PIE && (
        <>
          <div
            className={`reports-analytics-chart__${selectedChart.toLowerCase()}__legends`}
          >
            <div
              className={`reports-analytics-chart__${selectedChart.toLowerCase()}__legends__legend`}
            >
              <div className="legend-indicator red"></div>
              <div className="legend-name">B2B - 160</div>
              <div className="legend-value">(44%)</div>
            </div>
            <div
              className={`reports-analytics-chart__${selectedChart.toLowerCase()}__legends__legend`}
            >
              <div className="legend-indicator green"></div>
              <div className="legend-name">B2G - 113</div>
              <div className="legend-value">(31%)</div>
            </div>
            <div
              className={`reports-analytics-chart__${selectedChart.toLowerCase()}__legends__legend`}
            >
              <div className="legend-indicator yellow"></div>
              <div className="legend-name">B2C - 92</div>
              <div className="legend-value">(25%)</div>
            </div>
          </div>
          <div
            className={`reports-analytics-chart__${selectedChart.toLowerCase()}`}
          >
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  activeIndex={0}
                  data={pieChartData}
                  dataKey="value"
                  innerRadius={35}
                  outerRadius={60}
                  activeShape={renderActiveShape}
                  startAngle={-60}
                  endAngle={300}
                  paddingAngle={5}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell fill={entry.color}></Cell>
                  ))}
                </Pie>
                <defs>
                  <linearGradient id="gradient1">
                    <stop offset="5.69%" stopColor="#FFAB87" />
                    <stop offset="85.59%" stopColor="#FF7560" />
                  </linearGradient>
                  <linearGradient id="gradient2">
                    <stop offset="20.62%" stopColor="#82E3D0" />
                    <stop offset="83.68%" stopColor="#5AB8A5" />
                  </linearGradient>
                  <linearGradient id="gradient3">
                    <stop offset="21.48%" stopColor="#FDC75E" />
                    <stop offset="82.17%" stopColor="#FFD89D" />
                  </linearGradient>
                </defs>
              </PieChart>
            </ResponsiveContainer>
            <div className="total-text">
              <div className="total">Total</div>
              <div className="count">365</div>
            </div>
          </div>
        </>
      )}
      {selectedChart === REPORTCHARTS.BAR && (
        <table className="reports-analytics-chart__bar">
          <thead>
            <th className="th-country">Country</th>
            <th className="th-startup">Startups</th>
            <th className="th-noof-startups">% of Startups</th>
          </thead>
          <tbody>
            <tr>
              <td className="td-country">Norway</td>
              <td className="td-startups">200</td>
              <td className="td-noof-startups">
                45%
                <div className="bar-container">
                  <div className="bar-45"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="td-country">USA</td>
              <td className="td-startups">180</td>
              <td className="td-noof-startups">
                25%
                <div className="bar-container">
                  <div className="bar-25"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="td-country">Netherland</td>
              <td className="td-startups">125</td>
              <td className="td-noof-startups">
                10%
                <div className="bar-container">
                  <div className="bar-10"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="td-country">Singapore</td>
              <td className="td-startups">80</td>
              <td className="td-noof-startups">
                80%
                <div className="bar-container">
                  <div className="bar-80"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="td-country">USA</td>
              <td className="td-startups">180</td>
              <td className="td-noof-startups">
                25%
                <div className="bar-container">
                  <div className="bar-25"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="td-country">Netherland</td>
              <td className="td-startups">125</td>
              <td className="td-noof-startups">
                10%
                <div className="bar-container">
                  <div className="bar-10"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="td-country">Singapore</td>
              <td className="td-startups">80</td>
              <td className="td-noof-startups">
                80%
                <div className="bar-container">
                  <div className="bar-80"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="td-country">Other</td>
              <td className="td-startups">120</td>
              <td className="td-noof-startups">
                30%
                <div className="bar-container">
                  <div className="bar-30"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
