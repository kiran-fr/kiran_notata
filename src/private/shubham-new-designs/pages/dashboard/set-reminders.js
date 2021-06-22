import React, { useState } from "react";
import "./set-reminder.scss";
import InputCheckBox from "../ui-kits/check-box";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown } from "../../../../Components/UI_Kits/Dropdown";

export default function SetReminder() {
  const [isMyTeam, setMyTeam] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const onChange = date => {
    setStartDate(date);
    if (date) {
      setCalendarVisible(false);
    }
  };
  const items = [
    { id: 1, name: "Days" },
    { id: 2, name: "Months" },
  ];
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  return (
    <div className="set-reminder-container">
      <div className="set-reminder-container__remind">
        <div className="set-reminder-container__header">Remind</div>
        <div className="set-reminder-container__remind__item">
          <InputCheckBox></InputCheckBox>{" "}
          <span className="set-reminder-container__remind__item__text">Me</span>
        </div>
        <div className="set-reminder-container__remind__item">
          <InputCheckBox></InputCheckBox> <span>My team</span>
          <i
            className={`fa ${isMyTeam ? "fa-chevron-up" : "fa-chevron-down"}`}
            onClick={() => setMyTeam(!isMyTeam)}
            aria-hidden="true"
          ></i>
        </div>
        {isMyTeam && (
          <div className="set-reminder-container__remind__my-teams">
            <div className="set-reminder-container__remind__item">
              <div>
                <InputCheckBox></InputCheckBox> <span>Anton Tikhonovsky</span>
              </div>
              <div className="set-reminder-container__remind__item__email">
                (anton.tikhonovsky@gmail.com)
              </div>
            </div>
            <div className="set-reminder-container__remind__item">
              <div>
                <InputCheckBox></InputCheckBox> <span>Andrey Firsov</span>
              </div>
              <div className="set-reminder-container__remind__item__email">
                (andreyfirsov@gmail.com)
              </div>
            </div>
            <div className="set-reminder-container__remind__item">
              <div>
                <InputCheckBox></InputCheckBox> <span>Andrey Firsov</span>
              </div>
              <div className="set-reminder-container__remind__item__email">
                (andreyfirsov@gmail.com)
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="set-reminder-container__to-do">
        <div className="set-reminder-container__header">To Do</div>
        <textarea></textarea>
      </div>
      <div className="set-reminder-container__when">
        <div className="set-reminder-container__header">When</div>
        <div className="set-reminder-container__when__on">
          <div className="set-reminder-container__when__on__header">On</div>
          <div
            className="set-reminder-container__when__on__datePicker"
            onClick={() => setCalendarVisible(true)}
          >
            <div className="set-reminder-container__when__on__datePicker--text">
              <div>
                {startDate
                  ? startDate.toLocaleDateString("en-US")
                  : "mm/dd/yyyy"}
              </div>
              <i class="fa fa-calendar" aria-hidden="true"></i>
            </div>
          </div>
          {isCalendarVisible && (
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              formatWeekDay={nameOfDay => nameOfDay.substr(0, 1)}
              inline
            />
          )}
        </div>
        <div className="set-reminder-container__when__or">
          <div className="set-reminder-container__when__or__header">Or</div>
          <div className="set-reminder-container__when__or__separator"></div>
        </div>
        <div className="set-reminder-container__when__in">
          <div className="set-reminder-container__when__on__header">In</div>
          <input
            type="text"
            className="set-reminder-container__when__in__no-of-days"
          ></input>
          <div className="set-reminder-container__when__in__no-of-days-dropdown">
            <Dropdown title="" items={items}></Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
