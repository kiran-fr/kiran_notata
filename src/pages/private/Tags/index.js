import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";

import { Content, GhostLoader } from "../../../Components/elements";
import CreateTag from "./CreateTagGroup";
import TagGroup from "./TagsGroup";

import { tagGroupGet, funnelGroupGet } from "../../../Apollo/Queries";
import { useEffect } from "react";

export default function Tags() {
  const [type, setType] = useState("tags");

  const [
    getTags,
    {
      data: tagGroupGetData,
      loading: tagGroupGetLoading,
      error: tagGroupGetError,
      called: tagGroupGetCalled,
    },
  ] = useLazyQuery(tagGroupGet);

  console.log("tagGroupGetError", tagGroupGetError);

  const [
    getFunnels,
    {
      data: funnelGroupGetData,
      loading: funnelGroupGetLoading,
      error: funnelGroupGetError,
      called: funnelGroupGetCalled,
    },
  ] = useLazyQuery(funnelGroupGet);

  console.log("funnelGroupGetError", funnelGroupGetError);

  useEffect(() => {
    if (type === "funnels") {
      getFunnels();
    } else {
      getTags();
    }
  }, [getFunnels, getTags, type]);

  if (type === "funnels") {
    if (
      !funnelGroupGetCalled ||
      (!funnelGroupGetData && funnelGroupGetLoading)
    ) {
      return <GhostLoader />;
    }
  } else {
    if (!tagGroupGetCalled || (!tagGroupGetData && tagGroupGetLoading)) {
      return <GhostLoader />;
    }
  }

  if (funnelGroupGetError || tagGroupGetError) {
    console.log(funnelGroupGetError);
    console.log(tagGroupGetError);

    return <div>We are updating</div>;
  }

  const data =
    type === "funnels"
      ? funnelGroupGetData.accountGet.funnelGroups
      : tagGroupGetData.accountGet.tagGroups;

  return (
    <Content maxWidth={600}>
      <h1>{type === "funnels" ? "Funnels" : "Tags"}</h1>
      <div>
        <button onClick={() => setType("tags")}>tags</button>
        <button onClick={() => setType("funnels")}>funnels</button>
      </div>
      {[...data]
        .sort((a, b) => a.index - b.index)
        .map((props, index) => (
          <TagGroup {...props} key={props.id} index={index} type={type} />
        ))}
      <CreateTag index={data.length} type={type} />
    </Content>
  );
}
