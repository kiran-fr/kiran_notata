import React, { useState } from "react";
import "./evaluation-templates.scss";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { ICONPOSITION } from "../../constants";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { add_section } from "../../../../../definitions";
import { Modal } from "../../../../../Components/UI_Kits/Modal/Modal";
import TextBox from "../../ui-kits/text-box";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
export default function ElevationTemplates({ history }) {
  const [value, setValue] = React.useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const noOfRows = 3;
  const [browseDropDownStates, setBrowseDropDownStates] = useState(
    new Array(noOfRows).fill(false)
  );
  const [createNewTemplate, setCreateNewTemplate] = useState(false);
  return (
    <>
      <div className="evaluation-templates-container">
        <div className="row">
          <div className="col-sm-6 col-xs-12 evaluation-templates-container__heading">
            Evaluation templates
          </div>
          <div className="col-sm-6 col-xs-12 evaluation-templates-container__create-template">
            <ButtonWithIcon
              iconName="add"
              className="create-template-btn"
              text="CREATE Evaluation templates"
              iconPosition={ICONPOSITION.START}
              onClick={() => setCreateNewTemplate(true)}
            ></ButtonWithIcon>
          </div>
        </div>
        <div className="row evaluation-templates-container__tabs-container">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="My templates" {...a11yProps(0)} />
            <Tab label="Groups templates" {...a11yProps(1)} />
          </Tabs>
        </div>
        <div className="evaluation-templates-container__data-container">
          {[...Array(noOfRows)].map((elementInArray, index) => {
            return (
              <div
                className="row evaluation-templates-container__data-container__data"
                key={`row-id-${index}`}
              >
                <div className="col-sm-4 col-xs-10 template-name">
                  First impression
                </div>
                <div className="col-sm-3 col-xs-10 sections">6 sections</div>
                <div className="col-sm-3 group-name">Big group 1</div>
                <div className="col-sm-2 col-xs-2 browse">
                  <span
                    class="material-icons"
                    onClick={() => {
                      let states = new Array(noOfRows).fill(false);
                      states[index] = !browseDropDownStates[index];
                      setBrowseDropDownStates(states);
                    }}
                  >
                    more_horiz
                  </span>
                  {browseDropDownStates[index] && (
                    <div className="browse__drop-dwon">
                      {value === 1 && (
                        <div
                          className="browse__drop-dwon__item"
                          onClick={() => null}
                        >
                          <span class="material-icons settings">edit</span>
                          <span className="text">EDIT</span>
                        </div>
                      )}
                      <div
                        className="browse__drop-dwon__item"
                        onClick={() => null}
                      >
                        <span class="material-icons settings">
                          content_copy
                        </span>
                        <span className="text">COPY AND EDIT</span>
                      </div>
                      <div
                        className="browse__drop-dwon__item leave"
                        onClick={() => null}
                      >
                        <span class="material-icons leave">delete</span>
                        <span className="delete-text">DELETE GROUP</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {createNewTemplate && (
        <Modal
          title="New Evaluation Template"
          submit={() => {
            setCreateNewTemplate(false);
            history.push(add_section);
          }}
          close={() => {
            setCreateNewTemplate(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={<TextBox placeholder="Evaluation Template Name"></TextBox>}
        ></Modal>
      )}
    </>
  );
}
