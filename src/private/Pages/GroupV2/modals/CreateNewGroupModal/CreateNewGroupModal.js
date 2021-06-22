import React, { useEffect, useState } from "react";

import "./CreateNewGroupModal.scss";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { Modal } from "Components/UI_Kits/Modal/Modal";
import General from "./components/General";
import Settings from "./components/Settings";
import Startups from "./components/Startups";
import Members from "./components/Members";

import { useMutation } from "@apollo/client";
import {
  groupCreate,
  groupStartupsAdd,
  groupUsersInvite,
} from "../../../../Apollo/Mutations";
import defaultData from "../../_defaultGroupData";
import { group_dashboard } from "../../../../../definitions";

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

export default function CreateNewGroupModal({ group, close, history }) {
  const [data, setData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const [createGroup] = useMutation(groupCreate);
  const [addMembers] = useMutation(groupUsersInvite);
  const [addStartups] = useMutation(groupStartupsAdd);

  useEffect(() => {
    if (group) {
      let newData = {
        general: {
          name: group.name + " - COPY",
          description: group.description,
        },
        settings: group.settings,
        members: group.members
          ?.filter(({ user }) => !user.isMe)
          .map(({ user }) => user.email),
        startups: {},
      };
      for (let { creative } of group.startups || []) {
        newData.startups[creative.id] = creative;
      }
      setData(newData);
    }
  }, [group]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  async function saveData() {
    if (isLoading) return;

    setIsLoading(true);

    let group;

    // Create group with name, description and setting
    try {
      let variables = {
        name: data.general.name,
        description: data.general.description,
      };
      let res = await createGroup({ variables });
      group = res.data?.groupCreate;
    } catch (error) {
      return console.log(error);
    }

    // Add startups to group
    let creativeIds = Object.keys(data.startups);

    if (creativeIds.length) {
      let variables = {
        groupId: group.id,
        creativeIds: creativeIds,
      };
      try {
        await addStartups({ variables });
      } catch (error) {
        return console.log(error);
      }
    }

    // Invite members
    if (data.members.length) {
      let variables = {
        groupId: group.id,
        emails: data.members,
      };
      try {
        await addMembers({ variables });
      } catch (error) {
        return console.log(error);
      }
    }

    history.push(`${group_dashboard}/${group.id}`);

    setIsLoading(false);
  }

  return (
    <Modal
      title="Create new group"
      submit={saveData}
      loading={isLoading}
      close={close}
      submitTxt="Create"
      closeTxt="Cancel"
      children={
        <>
          <div className="col-12 create-new-group-modal-container">
            <Tabs value={tab} onChange={handleChange}>
              <Tab label="GENERAL" {...a11yProps(0)} />
              <Tab label="SETTINGS" {...a11yProps(1)} />
              <Tab label="STARTUPS" {...a11yProps(2)} />
              <Tab label="MEMBERS" {...a11yProps(3)} />
            </Tabs>
          </div>
          <TabPanel value={tab} index={0}>
            <General data={data} setData={setData} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Settings data={data} setData={setData} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Startups data={data} setData={setData} />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <Members data={data} setData={setData} />
          </TabPanel>
        </>
      }
    />
  );
}
