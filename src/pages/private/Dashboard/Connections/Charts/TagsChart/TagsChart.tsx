import React, { useState } from "react";
import { LegendPayload } from "recharts";
import Select, { components } from "react-select";
import { Tag } from "../../types";
import PieChart from "../PieChart";
import BarChart from "../BarChart";
import { ChartType } from "../ChartBlock";

const Placeholder = (props: any) => {
  return (
    <>
      <svg height={20} width={20} viewBox="0 0 1024 1024">
        <path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z" />
      </svg>
      <components.Placeholder {...props} />
    </>
  );
};

const SingleValue = (props: any) => {
  return (
    <>
      <svg height={20} width={20} viewBox="0 0 1024 1024">
        <path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z" />
      </svg>
      <components.SingleValue {...props} />
    </>
  );
};

const customStyles = {
  menu: (provided: any) => ({
    ...provided,
    width: 240,
  }),
  control: (base: any) => ({
    ...base,
    width: 240,
    border: 0,
    boxShadow: "none",
    background: "none",
  }),
  container: (provided: any) => ({
    ...provided,
    width: 240,
  }),
  placeholder: (base: any) => ({
    ...base,
    fontSize: "1em",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: () => ({
    display: "none",
  }),
  singleValue: (base: any) => ({
    ...base,
    paddingLeft: 20,
  }),
};

const TagsChart = ({
  tags,
  tagGroups,
  chartType,
}: {
  tags: Tag[];
  tagGroups: any;
  chartType?: ChartType;
}) => {
  const [dataType, setDataType] = useState(tagGroups[0].id);

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

  tags.forEach(tag => {
    if (groupTags.get(tag.id)) groupTags.get(tag.id).value++;
  });

  const dat: LegendPayload[] = Array.from(groupTags.values());
  dat.sort((a, b) => b.value - a.value);

  console.log("tagGroupsBefore", tagGroups);
  // console.log("tagGroups", groupTags);
  console.log("da", dat);

  return (
    <>
      <Select
        options={tagGroups}
        defaultValue={tagGroups[0]}
        onChange={val => setDataType(val.id)}
        components={{ Placeholder, SingleValue }}
        getOptionLabel={option => option.name}
        isOptionSelected={option => option.id === dataType.id}
        placeholder={"Choose"}
        isSearchable={false}
        styles={customStyles}
      />
      {chartType === ChartType.PIE ? (
        <PieChart data={dat} />
      ) : (
        <BarChart data={dat} />
      )}
    </>
  );
};

export default TagsChart;
