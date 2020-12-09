import React from "react";
import {
  BarChart as Chart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const COLORS = [
//   "#A8A7A7",
//   "#CC527A",
//   "#E8175D",
//   "#932432",
//   "#3C1874",
//   "#474747",
//   "#363636",
// ];

const COLORS = [
  "#68bb35",
  "#339af6",
  "#6d6d6d",
  "#f1a627",
  "#e74226",
  "#bf0045",
  "#4a00f5",
];

const BarChart = ({ data }: { data: object[] }) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <Chart data={data} margin={{ top: 5, right: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
