import React, { useState } from "react";
import { LegendPayload } from "recharts";

import PieChart from "./TagsChart/PieChart";
import BarChart from "./TagsChart/BarChart";
import styles from "./TagsChart.module.css";

const TagsChart = ({ tags, tagGroups }: any) => {
  const [chartType, setChartType] = useState(false);

  // console.log("tags", tags);
  // console.log("tagGroupsBefore", tagGroups);

  const red = tagGroups[0].tags.reduce(
    (map: Map<string, Object>, props: any) =>
      map.set(props.id, {
        name: props.name,
        value: 0,
        // ...props,
      }),
    new Map()
  );
  // console.log("tagGroups", red);

  tags.forEach((tag: any) => {
    // console.log('red',tag.tagGroupId)
    if (red.get(tag.id)) red.get(tag.id).value++;
  });

  const dat: LegendPayload[] = Array.from(red.values());
  console.log("da", dat);

  dat.sort((a, b) => b.value - a.value);
  return (
    <>
      <button
        className={styles.chart_type}
        onClick={() => setChartType(!chartType)}
      >
        {chartType ? (
          <i className="fas fa-chart-pie" />
        ) : (
          <i className="fas fa-chart-bar" />
        )}
      </button>
      {chartType ? <PieChart data={dat} /> : <BarChart data={dat} />}
    </>
  );
};

export default TagsChart;
