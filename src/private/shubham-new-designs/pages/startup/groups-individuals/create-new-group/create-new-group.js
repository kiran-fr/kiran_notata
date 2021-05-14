import React from "react";
import "./create-new-group.scss";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import General from "./general";
import Settings from "./settings";

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
export default function CreateNewGroup() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <div className="col-12 create-new-group-modal-container">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="GENERAL" {...a11yProps(0)} />
          <Tab label="SETTINGS" {...a11yProps(1)} />
          <Tab label="STARTUPS" {...a11yProps(2)} />
          <Tab label="MEMBERS" {...a11yProps(3)} />
        </Tabs>
      </div>
      <TabPanel value={value} index={0}>
        <General />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Settings />
      </TabPanel>
    </>
  );
}
