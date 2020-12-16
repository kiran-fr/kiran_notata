import React, { useState } from "react";
import {
  PieChart as Chart,
  Pie,
  Sector,
  Cell,
  Legend,
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

const style = {
  halfBlock: {
    top: 0,
    left: 225,
    width: "45%",
    overflowY: "scroll",
    lineHeight: "20px",
    fontSize: "14px",
  },
  fullBlock: {
    top: 0,
    left: 510,
    lineHeight: "20px",
    fontSize: "14px",
    overflowY: "scroll",
  },
};

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    onClick,
    payload,
    percent,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        fontSize={payload.name.length >= 22 ? 11 : undefined}
        width="135px"
        textAnchor="middle"
        fill={fill}
        style={{ whiteSpace: "pre-line" }}
      >
        {payload.name.length > 35
          ? `${payload.name.slice(0, 20)}...`
          : payload.name}
        {`\n`}
        {(percent * 100).toFixed(2)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        onClick={onClick}
        cursor={"pointer"}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const PieChart = ({
  data,
  widthState,
  setFilters,
  filters,
}: {
  data: ChartData[];
  widthState?: string;
  setFilters: Function;
  filters: any;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndexes, setSelectedIndex] = useState<{
    [key: string]: boolean;
  }>({});

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <Chart margin={{ top: 25, right: 0, left: 10 }}>
          <Pie
            activeIndex={activeIndex}
            activeShape={widthState === "FULL" ? renderActiveShape : undefined}
            onMouseEnter={(data: any, index: number) => setActiveIndex(index)}
            dataKey="value"
            data={data}
            cx={widthState === "FULL" ? 230 : 80}
            cy={120}
            labelLine={false}
            innerRadius={widthState === "FULL" ? 110 : 70}
            outerRadius={widthState === "FULL" ? 130 : 90}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  Object.keys(selectedIndexes).length > 0
                    ? selectedIndexes[index]
                      ? COLORS[index % COLORS.length]
                      : "grey"
                    : COLORS[index % COLORS.length]
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
          </Pie>
          <Legend
            iconSize={10}
            height={260}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={
              widthState === "FULL" ? style.fullBlock : style.halfBlock
            }
            formatter={(value, entry: any) =>
              `${value} - ${(entry?.payload.percent * 100).toFixed(2)}%`
            }
          />
          {widthState !== "FULL" && <Tooltip />}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
