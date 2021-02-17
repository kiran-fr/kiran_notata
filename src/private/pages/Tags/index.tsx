import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";

import { Content, GhostLoader, BreadCrumbs } from "Components/elements";
import CreateTagGroup from "./CreateTagGroup";
import TagGroup from "./TagsGroup";

import { tagGroupGet, funnelGroupGet } from "private/Apollo/Queries";
import { useEffect } from "react";

import { settings, tags } from "definitions.js";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { materialTheme } from "index";
import { ThemeProvider } from "@material-ui/core/styles";
import { Card } from "Components/elements/NotataComponents/Card";

export enum TagType {
  TAGS = "tags",
  FUNNELS = "funnels",
}

export default function Tags() {
  const [type, setType] = useState<TagType>(TagType.TAGS);

  // QUERIES

  const [
    getTags,
    {
      data: tagGroupGetData,
      loading: tagGroupGetLoading,
      error: tagGroupGetError,
      called: tagGroupGetCalled,
    },
  ] = useLazyQuery(tagGroupGet);

  const [
    getFunnels,
    {
      data: funnelGroupGetData,
      loading: funnelGroupGetLoading,
      error: funnelGroupGetError,
      called: funnelGroupGetCalled,
    },
  ] = useLazyQuery(funnelGroupGet);

  useEffect(() => {
    if (type === TagType.FUNNELS) {
      getFunnels();
    } else {
      getTags();
    }
  }, [getFunnels, getTags, type]);

  if (funnelGroupGetError || tagGroupGetError) {
    throw funnelGroupGetError || tagGroupGetError;
  }

  const loadingData =
    type === TagType.FUNNELS
      ? !funnelGroupGetCalled || (!funnelGroupGetData && funnelGroupGetLoading)
      : !tagGroupGetCalled || (!tagGroupGetData && tagGroupGetLoading);

  const data =
    (type === TagType.FUNNELS
      ? funnelGroupGetData?.accountGet.funnelGroups
      : tagGroupGetData?.accountGet.tagGroups) || [];

  const handleTabChange = (event: any, newValue: TagType) => {
    setType(newValue);
  };

  return (
    <>
      <BreadCrumbs
        list={[
          {
            val: "Settings",
            link: settings,
          },
          {
            val: "Tags & Funnels",
            link: tags,
          },
        ]}
      />

      <Content maxWidth={600}>
        <h1>{type === TagType.FUNNELS ? "Funnels" : "Tags"}</h1>
        <Card style={{ paddingTop: "0", marginBottom: "20px" }}>
          <ThemeProvider theme={materialTheme}>
            <Tabs
              value={type}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleTabChange}
              aria-label="Funnels And Tags"
            >
              <Tab value={TagType.TAGS} label="Tags" />
              <Tab value={TagType.FUNNELS} label="Funnels" />
            </Tabs>
          </ThemeProvider>
        </Card>

        {!loadingData &&
          [...data].map((props, index) => (
            <TagGroup {...props} key={props.id} index={index} type={type} />
          ))}
        {!loadingData ? (
          <CreateTagGroup index={data.length} type={type} />
        ) : (
          <GhostLoader />
        )}
      </Content>
    </>
  );
}
