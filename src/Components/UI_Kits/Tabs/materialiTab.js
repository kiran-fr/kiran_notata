import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

export const Blocks = props => {
  return (
    <Tabs
      value={tabValue}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleTabChange}
      aria-label="disabled tabs example"
    >
      <Tab value={1} label={primaryTxt} />
      <Tab value={2} label={secondaryTxt} />
    </Tabs>
  );
};
