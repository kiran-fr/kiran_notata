import React, { useState } from "react";
import "./Reminders.scss";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import RadioButton from "../../../Components/UI_Kits/from_srv/radio-button";
import ButtonWithIcon from "../../../Components/UI_Kits/from_srv/button-with-icon";

import { ICONPOSITION } from "../constants";

import { Modal } from "Components/UI_Kits/Modal/Modal";
import SetReminders from "./SetReminders";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export default function Reminders() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [isSetReminderModal, setReminderModal] = useState(false);
  return (
    <div className="reminders-container">
      <div className="card reminders-container__card">
        <div className="card-heading reminders-container__card__heading">
          <span className="reminders-container__card__heading__text">
            Reminders
          </span>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="planned" {...a11yProps(0)} />
            <Tab label="completed" {...a11yProps(1)} />
          </Tabs>
        </div>
        <div className="reminders-container__set-reminder">
          <ButtonWithIcon
            iconName="alarm"
            className="reminders-container__set-reminder__btn"
            text="set reminder"
            iconPosition={ICONPOSITION.END}
            onClick={() => setReminderModal(true)}
          ></ButtonWithIcon>
        </div>
        <div className="reminders-container__table">
          <div className="reminders-container__table__header">
            <div className="reminders-container__table__data__row__mobile-flex">
              <div className="col-check">
                <span class="material-icons">done</span>
              </div>
              <div className="col-reminder">reminder</div>
              <div className="col-set-by">set by</div>
              <div className="col-to-whom">to whom</div>
              <div className="col-when-to-remind">When to remind</div>
            </div>
            <div className="col-actions"></div>
          </div>
          <div className="reminders-container__table__data">
            {[...Array(5)].map((elementInArray, index) => {
              return (
                <div key={`reminder-record-${index}`}>
                  <div className="reminders-container__table__data__row">
                    <div className="reminders-container__table__data__row__mobile-flex">
                      <div className="col-check">
                        <RadioButton />
                      </div>
                      <div className="col-reminder">
                        <span className="col-reminder__text">
                          Don’t forger to re-evaluate <u>Great startup 1.</u>
                        </span>
                      </div>
                      <div className="col-set-by">
                        <div className="col-set-by__header">Set by:</div>
                        <div className="col-set-by__values">
                          <div className="col-set-by__text">Me</div>
                          <div className="col-set-by__text">
                            <u>Stephanie Wykoff</u>
                          </div>
                        </div>
                      </div>
                      <div className="col-to-whom">
                        <div className="col-to-whom__header">To:</div>
                        <div className="col-set-by__values">
                          <div className="col-to-whom__text">
                            <u>Stephanie Wykoff</u>
                          </div>
                          <div className="col-to-whom__text">
                            <u>Miranda Wykoff</u>
                          </div>
                          <div className="col-to-whom__text">
                            <u>Stephanie Doe</u>
                          </div>
                        </div>
                      </div>
                      <div className="col-when-to-remind">
                        <div className="col-when-to-remind__text">
                          Dec, 30 2021
                        </div>
                      </div>
                    </div>
                    <div className="col-actions">
                      <ButtonWithIcon
                        iconName="edit"
                        className="col-actions__edit-btn"
                        text="Edit"
                        iconPosition={ICONPOSITION.START}
                        onClick={() => null}
                      ></ButtonWithIcon>
                      <div>
                        <span class="material-icons col-actions__delete-btn">
                          cancel
                        </span>
                      </div>
                      <div>
                        <span class="material-icons col-actions__edit-mobile-btn">
                          edit
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="reminders-container__table__data__separator"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isSetReminderModal && (
        <Modal
          title="Set Reminder"
          innerClassName="set-reminder-container-inner"
          submit={() => {
            setReminderModal(false);
          }}
          close={() => {
            setReminderModal(false);
          }}
          submitTxt="Set Reminder"
          closeTxt="Cancel"
          children={<SetReminders></SetReminders>}
        ></Modal>
      )}
    </div>
  );
}
