import React, { useEffect } from "react";

// API STUFF
import { useQuery, useLazyQuery } from "@apollo/client";
import { connectionGet, accountGet } from "private/Apollo/Queries";
import { startup_page } from "definitions";

// GENERAL COMPONENTS
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { GhostLoader } from "Components/elements";

// COMPONENTS IMPORTED FROM OTHER PAGES

// CUSTOM COMPONENTS
import Overview from "./TabPages/Overview/Overview";
import StartupInfo from "./TabPages/StartupInfo/StartupInfo";
import Evaluations from "./TabPages/Evaluations/Evaluations";
import Groups from "./TabPages/Groups/Groups";

// STYLES
import "../public.scss";

// HELPERS
import queryString from "query-string";
import { userGet } from "../../Apollo/Queries";

// OTHER / CONSTANTS

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

export const StartupPage = ({ match, history, location }) => {
  // Url stuff
  const { id } = match?.params;

  // States
  const [tab, setTab] = React.useState(0);

  // Queries
  const userQuery = useQuery(userGet);
  const accountQuery = useQuery(accountGet);
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
        setTab(parseInt(tab));
      } catch (error) {
        console.log(error);
      }
    }
  }, [location]);

  // Data maps
  let connection = getConnectionRes?.data?.connectionGet;
  let account = accountQuery?.data?.accountGet;
  let user = userQuery?.data?.userGet;

  // Update tab in url
  const handleChange = (event, newValue) => {
    let pathName = `${match.url}?tab=${newValue}`;
    history.push(pathName);
  };

  if (!getConnectionRes?.data) {
    return <GhostLoader />;
  }

  return (
    <>
      <div className="header-routing">
        <span className="header-routing__highlight">My Startups</span>
        <i className="fal fa-chevron-right header-routing__stilt"></i>
        <span className="header-routing__name">
          {`{Startup Name}`}:Selected Tab Name
        </span>
      </div>
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <div className="col-12 startup-container">
          <Tabs value={tab} onChange={handleChange}>
            <Tab label="OVERVIEW" {...a11yProps(0)} />
            <Tab label="STARTUP INFO" {...a11yProps(1)} />
            <Tab label="EVALUATIONS" {...a11yProps(2)} />
            <Tab label="GROUPS" {...a11yProps(3)} />
            {/*<Tab label="MATERIALS" {...a11yProps(4)} />*/}
          </Tabs>
        </div>

        <TabPanel value={tab} index={0}>
          <Overview
            connection={connection}
            history={history}
            user={user}
            account={account}
            refetch={getConnectionRes.refetch}
          />
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <StartupInfo connection={connection} />
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <Evaluations
            history={history}
            connection={connection}
            account={account}
          />
        </TabPanel>

        <TabPanel value={tab} index={3}>
          <Groups
            connection={connection}
            history={history}
            // refetch={getConnectionRes.refetch}
          />
        </TabPanel>

        {/*<TabPanel value={value} index={4}>*/}
        {/*  <Materials />*/}
        {/*</TabPanel>*/}
      </div>
    </>
  );
};
