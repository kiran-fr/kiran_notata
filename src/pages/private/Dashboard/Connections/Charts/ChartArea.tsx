import React, { useState } from "react";
import { Button } from "../../../../../Components/elements";
import TagsChart from "./TagsChart/TagsChart";
import StageChart from "./StageChart/StageChart";
import { Connection } from "../types";
import ChartBlock from "./ChartBlock";

type TagChartItem = {
  id: number;
};

const ChartArea = ({
  connections,
  tagGroups,
}: {
  connections: Connection[];
  tagGroups: any[];
}) => {
  const [tagCharts, setTagCharts] = useState<TagChartItem[]>([{ id: 0 }]);
  return (
    <>
      <ChartBlock header={"Stage"}>
        <StageChart connections={connections} />
      </ChartBlock>

      {tagCharts.map((chart, index) => (
        <ChartBlock key={index} showSelector={true}>
          <TagsChart
            tags={connections.map(connection => connection.tags).flat()}
            tagGroups={tagGroups}
          />
        </ChartBlock>
      ))}

      <Button
        type={"just_text"}
        onClick={() =>
          setTagCharts(
            tagCharts.concat([{ id: tagCharts[tagCharts.length - 1].id + 1 }])
          )
        }
      >
        Add Graph
      </Button>
    </>
  );
};

export default ChartArea;
