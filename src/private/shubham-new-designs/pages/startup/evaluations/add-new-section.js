import React, { useState } from "react";
import "./add-new-section.scss";
import TextBox from "../../ui-kits/text-box";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { ICONPOSITION } from "../../constants";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SingleAndMultiPleAnswer from "./single-answer";
import TrafficLights from "./traffic-lights";
import FreeText from "./free-text";
import TextLines from "./text-lines";

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

export default function AddSection() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [dropDown, setDropDown] = useState(false);
  return (
    <div className="add-section-conatiner">
      <div className="row">
        <div className="col-sm-8 text-container">
          <TextBox></TextBox>
          <textarea rows="4" cols="50" />
        </div>
        <div className="col-sm-4">
          <div className="row">
            <div className="col-sm-12 col-xs-6">
              <ButtonWithIcon
                iconName="add"
                className="add-new-section-btn"
                text="ADD NEW SECTION"
                iconPosition={ICONPOSITION.START}
                onClick={() => null}
              ></ButtonWithIcon>
            </div>
            <div className="col-sm-12 col-xs-6">
              <ButtonWithIcon
                className="import-section-btn"
                text="Import section"
                onClick={() => null}
              ></ButtonWithIcon>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="row">
          <div className="col-sm-12 text-center">
            <span class="material-icons drag-indicator">drag_indicator</span>
            <span
              class="material-icons browse"
              onClick={() => setDropDown(!dropDown)}
            >
              more_horiz
            </span>
            {dropDown && (
              <div className="browse__drop-dwon">
                <div className="browse__drop-dwon__item" onClick={() => null}>
                  <span class="material-icons settings">content_copy</span>
                  <span className="text">DUPLICATE</span>
                </div>
                <div
                  className="browse__drop-dwon__item leave"
                  onClick={() => null}
                >
                  <span class="material-icons leave">delete</span>
                  <span className="delete-text">DELETE</span>
                </div>
              </div>
            )}
          </div>
          <div className="action-container">
            <span class="material-icons copy">content_copy</span>
            <i class="fa fa-trash-o delete" aria-hidden="true"></i>
            <span class="material-icons north">north</span>
            <span class="material-icons south">south</span>
          </div>
        </div>
        <div className="question-container row">
          <div className="col-sm-12">
            <TextBox placeholder="Question"></TextBox>
          </div>
          <div className="col-sm-12">
            <TextBox placeholder="Tagline"></TextBox>
          </div>
          <div className="col-sm-12 question-container__tabs">
            <Tabs
              value={value}
              onChange={handleChange}
              scrollButtons="on"
              variant="scrollable"
            >
              <Tab label="SINGLE ANSWER" {...a11yProps(0)} />
              <Tab label="multiply choice" {...a11yProps(1)} />
              <Tab label="traffic lights" {...a11yProps(2)} />
              <Tab label="free text" {...a11yProps(3)} />
              <Tab label="text lines" {...a11yProps(4)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <SingleAndMultiPleAnswer></SingleAndMultiPleAnswer>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <SingleAndMultiPleAnswer></SingleAndMultiPleAnswer>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <TrafficLights></TrafficLights>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <FreeText></FreeText>
            </TabPanel>
            <TabPanel value={value} index={4}>
              <TextLines></TextLines>
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
