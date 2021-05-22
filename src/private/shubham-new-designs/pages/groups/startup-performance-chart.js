import React from "react";
import Chart from "react-google-charts";

export default function StartupPerformanceChart() {
  return (
    <Chart
      width={"500px"}
      height={"300px"}
      chartType="Bar"
      loader={<div>Loading Chart</div>}
      data={[
        ["Startups", "val1", "val2", "val3", "val4"],
        ["Startup 1", 70, 45, 65, 35],
        ["Startup 2", 70, 45, 65, 35],
        ["Startup 3", 70, 45, 65, 35],
        ["Startup 4", 70, 45, 65, 35],
        ["Startup 5", 70, 45, 65, 35],
        ["Startup 6", 70, 45, 65, 35],
        ["Startup 7", 70, 45, 65, 35],
      ]}
      options={{
        // Material design options
        chart: {
          title: "First Impression",
        },
        colors: ["#FFAB86", "#B2FE78", "#96E4D5", "#FED695"],
        bar: { groupWidth: "95%" },
        legend: { position: "none" },
        vAxis: {
          minValue: 0,
          maxValue: 100,
        },
      }}
      // For tests
      rootProps={{ "data-testid": "2" }}
    />
  );
}
