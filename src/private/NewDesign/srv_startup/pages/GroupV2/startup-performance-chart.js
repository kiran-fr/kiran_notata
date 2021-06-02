import React, { useState } from "react";
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
import { getAllUsedTemplates, getSubjectiveScoreSummary } from "./_helpers";

export default function StartupPerformanceChart({ group }) {
  const [disabledTemplates, setDisabledTemplates] = useState({});

  let startups = group.startups;

  if (!startups || !startups.length) {
    return <span />;
  }

  let usedTemplates = getAllUsedTemplates(startups);

  let data = startups.map(startup => {
    let subjectiveScoreSummary = getSubjectiveScoreSummary(startup);
    let subjectiveScore = Math.round(
      (subjectiveScoreSummary?.average || 0) * 10
    );

    let item = {
      id: startup?.creative?.id,
      startupName: startup?.creative?.name,
      subjectiveScore: subjectiveScore,
    };

    for (let { templateId } of usedTemplates) {
      // Get summary
      let summary = startup.evaluationSummaries?.find(
        s => s?.templateId === templateId
      );

      // Add summary to startup item
      if (summary && !disabledTemplates[templateId]) {
        item[templateId] = summary?.averagePercentageScore || 0;
      }
    }

    return item;
  });

  let barColors = [
    ["#B2FE78", "#7FD65F"],
    ["#96E4D5", "#74C6B3"],
    ["#FED695", "#F9C05F"],
  ];

  function getBarColors(i) {
    let n = i >= barColors.length ? barColors.length - 1 : i;
    return barColors[n];
  }

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

                {usedTemplates.map(({ templateId }, i) => (
                  <linearGradient
                    key={templateId}
                    id={templateId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={getBarColors(i)[0]} />
                    <stop offset="100%" stopColor={getBarColors(i)[1]} />
                  </linearGradient>
                ))}
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

              {usedTemplates
                .filter(({ templateId }) => !disabledTemplates[templateId])
                .map(({ templateId, templateName }) => (
                  <Bar
                    key={templateId}
                    dataKey={templateId}
                    name={templateName}
                    fill={`url(#${templateId})`}
                    barSize={20}
                    radius={[10, 10, 10, 10]}
                    onClick={() =>
                      setDisabledTemplates({
                        ...disabledTemplates,
                        [templateId]: !disabledTemplates[templateId],
                      })
                    }
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
