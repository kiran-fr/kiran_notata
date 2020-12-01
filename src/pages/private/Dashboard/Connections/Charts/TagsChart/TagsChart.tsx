import React from "react";
import { LegendPayload } from "recharts";

import PieChart from "../PieChart";
import BarChart from "../BarChart";
import { ChartType } from "../ChartBlock";

const TagsChart = ({ tags, tagGroups, chartType }: any) => {
  const red = tagGroups[0].tags.reduce(
    (map: Map<string, Object>, props: any) =>
      map.set(props.id, {
        name: props.name,
        value: 0,
        // ...props,
      }),
    new Map()
  );

  tags.forEach((tag: any) => {
    if (red.get(tag.id)) red.get(tag.id).value++;
  });

  const dat: LegendPayload[] = Array.from(red.values());

  dat.sort((a, b) => b.value - a.value);
  return (
      chartType === ChartType.PIE ? <PieChart data={dat} /> : <BarChart data={dat} />
  );
};

export default TagsChart;
