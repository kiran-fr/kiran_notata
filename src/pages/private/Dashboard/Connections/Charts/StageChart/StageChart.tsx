import * as React from "react";
import { XAxis, BarChart, Bar, Cell, ResponsiveContainer } from "recharts";
import { Connection } from "../../types";

type StageChartData = {
  id: string;
  name: string;
  value: number;
};

const StageChart = ({ connections }: { connections: Connection[] }) => {
  const dataMap = connections.reduce(
    (map: Map<string, StageChartData>, connection: Connection) => {
      connection.funnelTags.forEach(funnelTag => {
        const chartData = map.get(funnelTag.id);
        if (chartData) {
          chartData.value += 1;
          map.set(funnelTag.id, chartData);
        } else {
          map.set(funnelTag.id, {
            id: funnelTag.id,
            value: 1,
            name: funnelTag.name,
          });
        }
      });
      return map;
    },
    new Map<string, StageChartData>()
  );

  const data = Array.from(dataMap.values());

  const colors = [
    "#FFBF00",
    "#ff6402",
    "#3ea943",
    "#ff00c9",
    "#7d00ff",
    "#0027ff",
    "#00a2ff",
  ];

  const CustomizedAxisTick = (props: any) => {
    const { x, y, stroke, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fontSize={14}
          fill="#666"
          transform="rotate(0)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <BarChart width={600} height={200} data={data}>
          <Bar
            dataKey="value"
            label={{
              value: "name",
              position: "top",
              fontWeight: "normal",
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index]}
                stroke={colors[index]}
              />
            ))}
          </Bar>
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={<CustomizedAxisTick />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StageChart;
