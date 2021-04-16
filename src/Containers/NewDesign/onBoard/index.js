import React, { useState, useEffect } from "react";
import { Tabsection } from "Components/UI_Kits";
import { Group } from "./page3";
import { Content } from "Components/elements";
import { LookingFor } from "./page2";
import Page1 from "./page1";
import "./style.css";

export function Onboard() {
  const [tabValue, setTabValue] = useState(1);
  const [render, setRender] = useState(false);

  const handleTab = value => {
    setTabValue(value);
  };

  useEffect(() => {
    setRender(!render);
  }, [tabValue]);

  return (
    <Content
      maxWidth={600}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Tabsection
        tabValue={tabValue}
        tabFuc={data => handleTab(data)}
        tabArr={[
          {
            value: 1,
            text: "personal",
          },
          {
            value: 2,
            text: "who",
          },
          {
            value: 3,
            text: "group",
          },
        ]}
      />
      <div style={{ marginTop: "20px" }}>
        {tabValue === 1 ? (
          <Page1 />
        ) : tabValue === 2 ? (
          <LookingFor />
        ) : (
          <Group />
        )}
      </div>
    </Content>
  );
}
