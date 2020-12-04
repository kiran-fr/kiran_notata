import React, { useState } from "react";
import { Button } from "../../../../../Components/elements";
import TagsChart from "./TagsChart/TagsChart";
import StageChart from "./StageChart/StageChart";
import { Connection } from "../types";
import ChartBlock from "./ChartBlock";

type TagChartItem = {
  tagGroupId: string;
};

const ChartArea = ({
  connections,
  tagGroups,
}: {
  connections: Connection[];
  tagGroups: any[];
}) => {
  const [tagCharts, setTagCharts] = useState<TagChartItem[]>([
    { tagGroupId: tagGroups[0].id },
  ]);

  return (
    <>
      <ChartBlock header={"Stage"}>
        <StageChart connections={connections} />
      </ChartBlock>

      {tagCharts.map(chart => (
        <ChartBlock header={"Tags"} showSelector={true}>
          <TagsChart
            tags={connections.map(connection => connection.tags).flat()}
            tagGroups={tagGroups}
          />
        </ChartBlock>
      ))}

      <Button
        type={"just_text"}
        onClick={() =>
          setTagCharts(tagCharts.concat([{ tagGroupId: tagGroups[0].id }]))
        }
      >
        Add Graph
      </Button>
    </>
  );
};

export default ChartArea;
