import React, { useEffect } from "react";
import "../public.scss";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { useQuery, useLazyQuery } from "@apollo/client";

import StartupInfo from "./startup-info";
import Overview from "./overview";
import GroupsIndividuals from "./groups-individuals/groups-individuals";
import Materials from "./materials";
import Evaluations from "./evaluations/evaluations";
import { connectionGet, accountGet } from "private/Apollo/Queries";
import { GhostLoader } from "Components/elements";
import { startup_page } from "definitions";
import queryString from "query-string";

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

export const Startup = ({ match, history, location }) => {
  // Url stuff
  const { id } = match?.params;

  // States
  const [value, setValue] = React.useState(0);

  // Queries
  const { data: accountGetData } = useQuery(accountGet);
  const [getConnection, getConnectionRes] = useLazyQuery(connectionGet);

  // Execute query
  useEffect(() => {
    if (id) {
      getConnection({ variables: { id } });
    }
  }, [id]);

  // Set tab from url
  useEffect(() => {
    const { tab } = queryString.parse(location.search);
    if (tab) {
      try {
        setValue(parseInt(tab));
      } catch (error) {
        console.log(error);
      }
    }
  }, [location]);

  // Data maps
  let connection = getConnectionRes?.data?.connectionGet;

  // Update tab in url
  const handleChange = (event, newValue) => {
    let pathName = `${match.url}?tab=${newValue}`;
    history.push(pathName);
  };

  const redirectToCompanyPage = connectionId => {
    let path = `${startup_page}/company/${connectionId}`;
    history.push(path);
  };

  console.log("getConnectionRes", getConnectionRes);

  if (!getConnectionRes.data) {
    return <GhostLoader />;
  }

  return (
    <>
      <div className="col-12 startup-container">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="STARTUP INFO" {...a11yProps(0)} />
          <Tab label="OVERVIEW" {...a11yProps(1)} />
          <Tab label="EVALUATIONS" {...a11yProps(2)} />
          <Tab label="GROUPS" {...a11yProps(3)} />
          <Tab label="MATERIALS" {...a11yProps(4)} />
        </Tabs>
      </div>
      <TabPanel value={value} index={0}>
        <StartupInfo startup={connection} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Overview
          creativity={connection}
          redirectToCompanyPage={redirectToCompanyPage}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Evaluations
          history={history}
          connection={connection}
          accountData={accountGetData?.accountGet}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <GroupsIndividuals connection={connection} history={history} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Materials />
      </TabPanel>
    </>
  );
};
