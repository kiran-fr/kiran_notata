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
import { CHART_COLORS } from "./ChartArea";

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
}) => (
  <div style={{ width: "100%", height: 300 }}>
    <ResponsiveContainer>
      <Chart data={data} margin={{ top: 5, right: 30, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" cursor="pointer">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                selectedTags.size > 0 &&
                Array.from(selectedTags.values()).some(value => value.selected)
                  ? selectedTags.get(entry.id)?.selected
                    ? CHART_COLORS[index % CHART_COLORS.length]
                    : "grey"
                  : CHART_COLORS[index % CHART_COLORS.length]
              }
              onClick={() => {
                if (selectedTags.get(entry.id)?.selected) {
                  setFilters({
                    tags: filters.tags.filter(({ id }: any) => id !== entry.id),
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

export default BarChart;
