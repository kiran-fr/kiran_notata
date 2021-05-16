import React from "react";
import "./index.scss";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { useQuery } from "@apollo/client";

import StartupInfo from "./startup-info";
import Overview from "./overview";
import GroupsIndividuals from "./groups-individuals";
import Materials from "./materials";
import Evaluations from "./evaluations/evaluations";
import { connectionGet } from "private/Apollo/Queries";
import { GhostLoader } from "Components/elements";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export const Startup = props => {
  const {
    match: {
      params: { id },
    },
  } = props;
  const { data: connectionGetData, loading, error } = useQuery(connectionGet, {
    variables: { id },
  });
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!connectionGetData) {
    return <GhostLoader />;
  }
  let connection = connectionGetData?.connectionGet;

  console.log(connectionGetData);
  return (
    <>
      <div className="col-12 startup-container">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="STARTUP INFO" {...a11yProps(0)} />
          <Tab label="OVERVIEW" {...a11yProps(1)} />
          <Tab label="EVALUATIONS" {...a11yProps(2)} />
          <Tab label="GROUP AND INDIVIDUALS" {...a11yProps(3)} />
          <Tab label="MATERIALS" {...a11yProps(4)} />
        </Tabs>
      </div>
      <TabPanel value={value} index={0}>
        <StartupInfo />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Overview creativity={connection} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Evaluations connection={connection} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <GroupsIndividuals />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Materials />
      </TabPanel>
    </>
  );
};
