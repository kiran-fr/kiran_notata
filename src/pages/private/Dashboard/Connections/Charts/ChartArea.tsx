import React, { useState } from "react";
import { Button } from "../../../../../Components/elements";
import TagsChart from "./TagsChart/TagsChart";
import StageChart from "./StageChart/StageChart";
import { Connection } from "../types";
import { ChartBlock, WidthState } from "./ChartBlock";
import styles from "./ChartArea.module.css";

type TagChartItem = {
  tagGroupId: string;
}


const ChartArea = ({ connections, tagGroups }: { connections: Connection[], tagGroups: any[] }) => {

  const [tagCharts, setTagCharts] = useState<TagChartItem[]>([{ tagGroupId: tagGroups[0].id }]);

  const onDeleteBlock  = (index: number) => {
    tagCharts.splice(index, 1);
    console.log(tagCharts)
    setTagCharts(tagCharts.slice());
  };

  return (
    <>
      <div className={styles.flex}>
        <ChartBlock header={"Stage"} initialWidthState={WidthState.FULL}>
          <StageChart
            connections={connections}
          />
        </ChartBlock>
      </div>
      <div className={styles.flex}>
        {
          tagCharts.map((chart, index) => (
              <ChartBlock header={"Tags"} showSelector={true} key={`tag-${index}`} index={index} onDeleteBlock={onDeleteBlock}>
                <TagsChart
                  tags={connections.map(connection => connection.tags).flat()}
                  tagGroups={tagGroups}
                />
              </ChartBlock>
            ),
          )
        }
      </div>
      <Button type={"just_text"} onClick={() => setTagCharts(tagCharts.concat([{ tagGroupId: tagGroups[0].id }]))}>Add
        Graph</Button>
    </>
  );
};

export default ChartArea;
