import React, { useState, useMemo } from "react";
import { ChartData } from "../../types";
import Select, { components } from "react-select";
import { Tag } from "../../types";
import PieChart from "../PieChart";
import BarChart from "../BarChart";
import { ChartType } from "../ChartBlock";
import styles from "../ChartBlock.module.scss";

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
    width: 140,
    border: 0,
    boxShadow: "none",
    background: "none",
  }),
  container: (provided: any) => ({
    ...provided,
    width: 140,
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
  lengthFilter,
  widthState,
  setFilters,
  filters,
}: {
  tags: Tag[];
  tagGroups: any;
  chartType?: ChartType;
  lengthFilter?: number;
  widthState?: string;
  setFilters: Function;
  filters: any;
}) => {
  const [dataType, setDataType] = useState(tagGroups[0].id);
  const [selectedTags, setSelectedTag] = useState<{
    [key: string]: boolean;
  }>({});

  const groupsTags = useMemo(
    () =>
      tagGroups.reduce(
        (groupsMap: Map<string, Object>, props: any) =>
          groupsMap.set(
            props.id,
            props.tags.reduce(
              (map: Map<string, Object>, props: any) =>
                map.set(props.id, {
                  id: props.id,
                  name: props.name,
                  value: 0,
                }),
              new Map()
            )
          ),
        new Map()
      ),
    [tagGroups]
  );

  let groupTags = groupsTags.get(dataType);
  tags.forEach(tag => {
    if (groupTags.get(tag.id)) groupTags.get(tag.id).value++;
  });

  let data: ChartData[] = Array.from(groupTags.values());
  if (lengthFilter && lengthFilter > 0)
    data = data.filter(group => group.value >= lengthFilter);
  data.sort((a, b) => b.value - a.value);

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
        <PieChart
          data={data}
          widthState={widthState}
          setFilters={setFilters}
          filters={filters}
          selectedTags={selectedTags}
          setSelectedTag={setSelectedTag}
        />
      ) : (
        <BarChart
          data={data}
          setFilters={setFilters}
          filters={filters}
          selectedTags={selectedTags}
          setSelectedTag={setSelectedTag}
        />
      )}
    </>
  );
};

export default TagsChart;
