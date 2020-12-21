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
};

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
  const [tagCharts, setTagCharts] = useState<TagChartItem[]>([{ id: 0 }]);

  const onDeleteBlock = (index: number) => {
    tagCharts.splice(index, 1);
    setTagCharts(tagCharts.slice());
  };

  return (
    <>
      <div className={styles.flex}>
        <ChartBlock header={"Stage"} initialWidthState={WidthState.FULL}>
          <StageChart connections={connections} />
        </ChartBlock>
      </div>
      <div className={styles.flex}>
        <ChartBlock
          header={"Subjective Scores"}
          initialWidthState={WidthState.FULL}
        >
          <ScoresChart connections={connections} />
        </ChartBlock>
      </div>
      <div className={styles.flex}>
        {tagCharts.map((chart, index) => (
          <ChartBlock
            showSelector={true}
            key={`tag-${chart.id}`}
            index={index}
            onDeleteBlock={() => onDeleteBlock(index)}
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
          setTagCharts(
            tagCharts.concat([
              {
                id: tagCharts.length
                  ? tagCharts[tagCharts.length - 1]?.id + 1
                  : 0,
              },
            ])
          )
        }
      >
        Add Graph
      </Button>
    </>
  );
};

export default ChartArea;
