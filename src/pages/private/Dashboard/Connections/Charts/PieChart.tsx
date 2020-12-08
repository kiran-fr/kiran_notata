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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const style = {
  halfBlock: {
    top: 0,
    left: 225,
    width: "170px",
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
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={"red"}>
        {payload.name}
      </text> */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
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
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`PV ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const PieChart = ({
  data,
  widthState,
}: {
  data: object[];
  widthState?: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <Chart margin={{ top: 25, right: 0, left: 10 }}>
          <Pie
            activeIndex={activeIndex}
            activeShape={widthState === "FULL" ? renderActiveShape : undefined}
            onMouseEnter={(data: any, index: number) => setActiveIndex(index)}
            dataKey="value"
            data={data}
            cx={widthState === "FULL" ? 230 : 80}
            cy={100}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
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
