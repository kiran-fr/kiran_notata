import React from "react";
import { useQuery } from "@apollo/client";

import { Content, GhostLoader } from "../../elements";
import CreateTag from "./CreateTagGroup";
import TagGroup from "./TagsGroup";

import { tagGroupGet } from "../../../Apollo/Queries";

export default function Tags() {
  const { data, loading, error } = useQuery(tagGroupGet);

  if (!data || loading) {
    return <GhostLoader />;
  }

  if (error) {
    console.log(error);

    return <div>We are updating</div>;
  }
  return (
    <Content maxWidth={600}>
      <h1>Tags</h1>
      {[...data.accountGet.tagGroups]
        .sort((a, b) => a.index - b.index)
        .map((props, index) => (
          <TagGroup {...props} key={props.id} index={index} />
        ))}
      <CreateTag index={data.length} />
    </Content>
  );
}
