import React, { useState } from "react";
import "./chart-tile.scss";
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
  const sx = cx + (outerRadius - 75) * cos;
  const sy = cy + (outerRadius - 75) * sin;
  return (
    <Sector
      cx={sx}
      cy={sy}
      innerRadius={50}
      outerRadius={95}
      startAngle={startAngle}
      endAngle={endAngle}
      fill="url(#gradient1)"
    />
  );
};
export default function ChartTile({ tileHeading }) {
  const data = [
    { techValue: 50, startupName: "FINTECH" },
    { techValue: 40, startupName: "PROPTECH" },
    { techValue: 35, startupName: "ADTECH" },
    { techValue: 25, startupName: "GAMING" },
    { techValue: 35, startupName: "OTHER " },
  ];
  const pieChartData = [
    { value: 44, color: "url(#gradient1)" },
    { value: 31, color: "url(#gradient2)" },
    { value: 25, color: "url(#gradient3)" },
  ];
  const shiftSize = 7;
  const [selectedChart, setSelectedChart] = useState(REPORTCHARTS.COLUMN);
  return (
    <div className="card chart-tile-container">
      <div className="chart-tile-container__header">
        <div className="card-heading">{tileHeading}</div>
        <div className="chart-tile-container__header__icons">
          <i
            class={`fa fa-signal ${
              selectedChart === REPORTCHARTS.BAR ? "selected" : ""
            }`}
            aria-hidden="true"
            onClick={() => setSelectedChart(REPORTCHARTS.BAR)}
          ></i>
          <i
            class={`fa fa-signal ${
              selectedChart === REPORTCHARTS.COLUMN ? "selected" : ""
            }`}
            aria-hidden="true"
            onClick={() => setSelectedChart(REPORTCHARTS.COLUMN)}
          ></i>
          <i
            class={`fa fa-pie-chart ${
              selectedChart === REPORTCHARTS.PIE ? "selected" : ""
            }`}
            aria-hidden="true"
            onClick={() => setSelectedChart(REPORTCHARTS.PIE)}
          ></i>
        </div>
      </div>

      {selectedChart === REPORTCHARTS.COLUMN && (
        <div
          className={`chart-tile-container__chart chart-tile-container__${selectedChart.toLowerCase()}`}
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
            className={`chart-tile-container__chart chart-tile-container__${selectedChart.toLowerCase()} col-sm-8`}
          >
            <ResponsiveContainer height={250}>
              <PieChart height={250}>
                <Pie
                  activeIndex={0}
                  data={pieChartData}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={85}
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
          <div className="col-sm-4">
            <h3>heello</h3>
          </div>
        </>
      )}
    </div>
  );
}
