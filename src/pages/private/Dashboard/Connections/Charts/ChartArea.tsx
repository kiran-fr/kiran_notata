import React, { useState } from "react";
import { Button } from "../../../../../Components/elements";
import TagsChart from "./TagsChart/TagsChart";
import StageChart from "./StageChart/StageChart";
import ScoresChart from "./StageChart/ScoresChart";
import { Connection, ChartData } from "../types";
import { ChartBlock, WidthState } from "./ChartBlock";
import styles from "./ChartArea.module.css";

type TagChartItem = {
  id: number;
  tagGroupId: string;
};

export const CHART_COLORS = [
  "#68bb35",
  "#339af6",
  "#f1a627",
  "#e74226",
  "#bf0045",
  "#e2da1c",
  "#4a00f5",
  "#d628e7",
  "#289832",
  "#6d6d6d",
];

const ChartArea = ({
  connections,
  tagGroups,
  groupsTags,
  setFilters,
  filters,
}: {
  connections: Connection[];
  tagGroups: any[];
  groupsTags: Map<string, Map<string, ChartData>>;
  setFilters: any;
  filters: any;
}) => {
  const [tagCharts, setTagCharts] = useState<{ [key: number]: TagChartItem }>({
    0: { id: 0, tagGroupId: groupsTags.keys().next().value },
  });

  return (
    <>
      <div className={styles.flex}>
        <ChartBlock header={"Stage"} initialWidthState={WidthState.HALF}>
          <StageChart connections={connections} />
        </ChartBlock>
        <ChartBlock
          header={"Subjective Scores"}
          initialWidthState={WidthState.HALF}
        >
          <ScoresChart connections={connections} />
        </ChartBlock>
      </div>
      <div className={styles.flex}>
        {Object.values(tagCharts).map((chart, index) => (
          <ChartBlock
            showSelector={true}
            key={`tag-${chart.id}`}
            groupsTags={groupsTags}
            dataType={tagCharts[chart.id].tagGroupId}
            onDeleteBlock={(id: string) => {
              delete tagCharts[chart.id];
              setTagCharts({ ...tagCharts });

              const existingIndex = Object.values(tagCharts).findIndex(
                ({ tagGroupId }) => tagGroupId === id
              );
              let groupTags = groupsTags.get(id);

              // Delete all filters from this group
              if (existingIndex === -1)
                setFilters({
                  tags: filters.tags.filter(
                    ({ id }: any) => !groupTags?.has(id)
                  ),
                });
            }}
            onChangeDataType={(id: string) => {
              const currentId = tagCharts[chart.id].tagGroupId;

              tagCharts[chart.id].tagGroupId = id;
              setTagCharts({
                ...tagCharts,
              });

              const existingIndex = Object.values(tagCharts).findIndex(
                ({ tagGroupId }) => tagGroupId === currentId
              );
              let groupTags = groupsTags.get(currentId);

              // Delete all filters from this group
              if (existingIndex === -1)
                setFilters({
                  tags: filters.tags.filter(
                    ({ id }: any) => !groupTags?.has(id)
                  ),
                });
            }}
          >
            <TagsChart
              tags={connections.map(connection => connection.tags).flat()}
              tagGroups={tagGroups}
              groupsTags={groupsTags}
              setFilters={setFilters}
              filters={filters}
            />
          </ChartBlock>
        ))}
      </div>

      <Button
        type={"just_text"}
        onClick={() =>
          setTagCharts({
            ...tagCharts,
            [Object.values(tagCharts).length
              ? Object.values(tagCharts)[Object.values(tagCharts).length - 1]
                  ?.id + 1
              : 0]: {
              id: Object.values(tagCharts).length
                ? Object.values(tagCharts)[Object.values(tagCharts).length - 1]
                    ?.id + 1
                : 0,
              tagGroupId: groupsTags.keys().next().value,
            },
          })
        }
      >
        Add Graph
      </Button>
    </>
  );
};

export default ChartArea;
