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
import { ChartData } from "../types";

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

const BarChart = ({
  data,
  setFilters,
  filters,
  selectedTags,
}: {
  data: ChartData[];
  setFilters: Function;
  filters: any;
  selectedTags: Map<string, ChartData>;
}) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <Chart data={data} margin={{ top: 5, right: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" cursor={"pointer"}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  selectedTags.size > 0 &&
                  Array.from(selectedTags.values()).some(
                    value => value.selected
                  )
                    ? selectedTags.get(entry.id)?.selected
                      ? COLORS[index % COLORS.length]
                      : "grey"
                    : COLORS[index % COLORS.length]
                }
                onClick={() => {
                  if (selectedTags.get(entry.id)?.selected) {
                    setFilters({
                      tags: filters.tags.filter(
                        ({ id }: any) => id !== entry.id
                      ),
                    });
                  } else {
                    setFilters({
                      tags: [...filters.tags, { id: entry.id }],
                    });
                  }
                }}
              />
            ))}
          </Bar>
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
