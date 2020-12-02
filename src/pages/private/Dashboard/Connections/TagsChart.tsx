import React, { useState } from "react";
import { LegendPayload } from "recharts";
import { Select } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

import PieChart from "./TagsChart/PieChart";
import BarChart from "./TagsChart/BarChart";
import styles from "./TagsChart.module.css";
import "antd/lib/select/style/index.css";
const { Option } = Select;

const TagsChart = ({ tags, tagGroups }: any) => {
  const [chartType, setChartType] = useState(false);
  const [dataType, setDataType] = useState(tagGroups[0].id);

  // console.log("tags", tags);
  console.log("tagGroupsBefore", tagGroups);

  const groupTags = tagGroups
    .find((tagGroup: any) => tagGroup.id === dataType)
    .tags.reduce(
      (map: Map<string, Object>, props: any) =>
        map.set(props.id, {
          name: props.name,
          value: 0,
        }),
      new Map()
    );
  // console.log("tagGroups", groupTags);

  tags.forEach((tag: any) => {
    if (groupTags.get(tag.id)) groupTags.get(tag.id).value++;
  });

  const dat: LegendPayload[] = Array.from(groupTags.values());
  console.log("da", dat);

  dat.sort((a, b) => b.value - a.value);
  return (
    <>
      <Select
        defaultValue={tagGroups[0].name}
        style={{ width: 240 }}
        bordered={false}
        showArrow={false}
        optionLabelProp="label"
        onSelect={(e, opt) => setDataType(opt.key)}
      >
        {tagGroups.map((tagGroup: any) => (
          <Option
            key={tagGroup.id}
            value={tagGroup.name}
            label={
              <>
                <CaretRightOutlined />
                &nbsp; {tagGroup.name}
              </>
            }
          >
            {tagGroup.name}
          </Option>
        ))}
      </Select>

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
