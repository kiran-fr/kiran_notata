import * as React from "react";
import { XAxis, BarChart, Bar, Cell, ResponsiveContainer } from "recharts";
import { Connection } from "../../types";

type StageChartData = {
  id: number;
  name: number;
  value: number;
};

const ScoresChart = ({ connections }: { connections: Connection[] }) => {
  const dataMap = connections.reduce(
    (map: Map<number, StageChartData>, connection: Connection) => {
      connection.subjectiveScores.forEach(score => {
        const chartData = map.get(score.score);
        if (chartData) {
          chartData.value += 1;
          map.set(score.score, chartData);
        } else {
          map.set(score.score, {
            id: score.score,
            value: 1,
            name: score.score,
          });
        }
      });
      return map;
    },
    new Map<number, StageChartData>()
  );

  const data = Array.from(dataMap.values());
  data.sort((a, b) => b.id - a.id);

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
    const { x, y, payload } = props;

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

export default ScoresChart;
