import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Legend,
  Tooltip,
  LegendProps,
  LegendPayload,
} from "recharts";

const TagsChart = ({ tags, tagGroups }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);

  console.log("tags", tags);
  console.log("tagGroupsBefore", tagGroups);

  const red = tagGroups[0].tags.reduce(
    (map: Map<string, Object>, props: any) =>
      map.set(props.id, {
        name: props.name,
        value: 0,
        // ...props,
      }),
    new Map()
  );
  console.log("tagGroups", red);

  tags.forEach((tag: any) => {
    // console.log('red',tag.tagGroupId)
    if (red.get(tag.id)) red.get(tag.id).value++;
  });

  const dat: LegendPayload[] = Array.from(red.values());
  console.log("da", dat);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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

  const style = {
    top: 0,
    left: 350,
    lineHeight: "24px",
  };

  dat.sort((a, b) => b.value - a.value);
  return (
    <PieChart width={400} height={400}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        onMouseEnter={(data: any, index: number) => setActiveIndex(index)}
        dataKey="value"
        data={dat}
        cx={200}
        cy={200}
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
      >
        {dat.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend
        iconSize={10}
        width={240}
        height={140}
        layout="vertical"
        verticalAlign="middle"
        wrapperStyle={style}
        formatter={(value, entry: any) =>
          `${value} - ${(entry?.payload.percent * 100).toFixed(2)}%`
        }
      />
      <Tooltip />
    </PieChart>
  );
};

export default TagsChart;
