import React from "react";
import "./startup-performance-chart.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function StartupPerformanceChart() {
  const data = [
    {
      startupName: "Startup 1",
      subjectiveScore: 70,
      firstImpression: 45,
      beforePitching: 65,
      afterPitching: 35,
    },
    {
      startupName: "Startup 2",
      subjectiveScore: 50,
      firstImpression: 35,
      beforePitching: 30,
      afterPitching: 45,
    },
    {
      startupName: "Startup 3",
      subjectiveScore: 70,
      firstImpression: 60,
      beforePitching: 75,
      afterPitching: 45,
    },
    {
      startupName: "Startup 4",
      subjectiveScore: 80,
      firstImpression: 55,
      beforePitching: 85,
      afterPitching: 65,
    },
    {
      startupName: "Startup 5",
      subjectiveScore: 70,
      firstImpression: 45,
      beforePitching: 65,
      afterPitching: 90,
    },
    {
      startupName: "Startup 6",
      subjectiveScore: 85,
      firstImpression: 65,
      beforePitching: 40,
      afterPitching: 70,
    },
  ];
  return (
    <>
      <div className="performance-chart-container">
        <div className="performance-chart-container__chart">
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient
                  id="subjective-score"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#FFAB86" />
                  <stop offset="100%" stopColor="#FF725E" />
                </linearGradient>
                <linearGradient
                  id="first-inpression"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#B2FE78" />
                  <stop offset="100%" stopColor="#7FD65F" />
                </linearGradient>
                <linearGradient
                  id="before-pitching"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#96E4D5" />
                  <stop offset="100%" stopColor="#74C6B3" />
                </linearGradient>
                <linearGradient id="after-pitching" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FED695" />
                  <stop offset="100%" stopColor="#F9C05F" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="0"
                stroke="#F1F1F1"
                vertical={false}
              />
              <XAxis
                dataKey="startupName"
                tick={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  fontFamily: "Proxima Nova",
                  textTransform: "uppercase",
                }}
                axisLine={false}
              />
              <YAxis
                tick={
                  (true,
                  {
                    fontSize: 10,
                    fontWeight: "bold",
                    letterSpacing: "0.04em",
                    fontFamily: "Proxima Nova",
                  })
                }
                tickFormatter={tick => `${tick}%`}
                minTickGap={10}
                domain={[0, 100]}
                axisLine={false}
                type="number"
              />
              <Legend />
              <Bar
                name="Subjective Score"
                dataKey="subjectiveScore"
                fill="url(#subjective-score)"
                barSize={20}
                radius={[10, 10, 10, 10]}
              />
              <Bar
                name="First Impression"
                dataKey="firstImpression"
                fill="url(#first-inpression)"
                barSize={20}
                radius={[10, 10, 10, 10]}
              />
              <Bar
                name="Before Pitching"
                dataKey="beforePitching"
                fill="url(#before-pitching)"
                barSize={20}
                radius={[10, 10, 10, 10]}
              />
              <Bar
                name="Afer Pitching"
                dataKey="afterPitching"
                fill="url(#after-pitching)"
                barSize={20}
                radius={[10, 10, 10, 10]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
