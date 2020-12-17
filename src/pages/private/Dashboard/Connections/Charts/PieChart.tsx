import React, { useEffect, useRef, useState } from "react";
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
import { CHART_COLORS } from "./ChartArea";

const style = {
  halfBlock: {
    top: 20,
    left: 245,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflowY: "scroll",
    lineHeight: "20px",
    fontSize: "14px",
  },
  fullBlock: {
    top: 20,
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
      >
        <tspan fontWeight="bold" x={cx} dy="0">{payload.name.length > 35
          ? `${payload.name.slice(0, 20)}...`
          : payload.name}</tspan>
        <tspan x={cx} dy="1.1em">{(percent * 100).toFixed(2)}%</tspan>
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

  // ================
  // STATE REGION
  // ================

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndexes, setSelectedIndex] = useState<{
    [key: string]: boolean;
  }>({});
  const [width, setWidth] = useState(0);

  const ref = useRef<any>(null);
  useEffect(() => {
    setWidth(ref.current.clientWidth)
  }, [ref.current, widthState]);

  return (
    <div style={{ width: "100%", height: 300 }}  ref={ref}>

      <ResponsiveContainer>
        <Chart margin={{ top: 25, right: 0, left: 10 }}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(data: any, index: number) => setActiveIndex(index)}
            dataKey="value"
            data={data}
            cx={widthState === "FULL" ? 230 : 100}
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
          </Pie>
          <Legend
            iconSize={10}
            height={260}
            width={width - (widthState === "FULL" ? 500 : 230)}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={
              widthState === "FULL" ? style.fullBlock : style.halfBlock
            }
            formatter={(value, entry: any) =>
              `${value} - ${(entry?.payload.percent * 100).toFixed(2)}%`
            }
          />
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
