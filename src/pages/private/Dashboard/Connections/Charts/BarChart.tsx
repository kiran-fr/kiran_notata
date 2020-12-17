import React, { useState } from "react";
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
}: {
  data: ChartData[];
  setFilters: Function;
  filters: any;
}) => {
  const [selectedIndexes, setSelectedIndex] = useState<{
    [key: string]: boolean;
  }>({});

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
                  Object.keys(selectedIndexes).length > 0
                    ? selectedIndexes[index]
                      ? CHART_COLORS[index % CHART_COLORS.length]
                      : "grey"
                    : CHART_COLORS[index % CHART_COLORS.length]
                }
                onClick={() => {
                  if (selectedIndexes[index]) {
                    delete selectedIndexes[index];
                    setSelectedIndex({
                      ...selectedIndexes,
                    });
                    setFilters({
                      tags: filters.tags.filter(
                        ({ id }: any) => id !== entry.id
                      ),
                    });
                  } else {
                    setSelectedIndex({
                      ...selectedIndexes,
                      [index]: true,
                    });
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
