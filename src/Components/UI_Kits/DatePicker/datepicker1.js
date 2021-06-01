import React, { useState } from "react";
import "./datepicker.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const  Datepicker1 = ({ isCalendarVisible, setCalendarVisible, selected, onChange, startDate, endDate, formatWeekDay }) => {
  return (
    <>
      <div className="datepicker-container ">
        <div className="datepicker-container__date-time">
          <div className="datepicker-container__from-to">
            <div className="datepicker-container__from-to__header">From</div>
            <div
              className="datepicker-container__from-to__datePicker"
              onClick={() => setCalendarVisible(true)}
            >
              <div>
                {startDate
                  ? startDate.toLocaleDateString("en-US")
                  : "mm/dd/yyyy"}
                <i class="fa fa-calendar" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          <div className="datepicker-container__from-to">
            <div className="datepicker-container__from-to__header">To</div>
            <div
              className="datepicker-container__from-to__datePicker"
              onClick={() => setCalendarVisible(true)}
            >
              <div>
                {endDate ? endDate.toLocaleDateString("en-US") : "mm/dd/yyyy"}
                <i class="fa fa-calendar" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="datepicker-container__last-day-container">
          <div className="datepicker-container__last-day-container__last-day">
            last 7 days
          </div>
          <div className="datepicker-container__last-day-container__last-day">
            last 14 days
          </div>
          <div className="datepicker-container__last-day-container__last-day">
            last 30 days
          </div>
          <div className="datepicker-container__last-day-container__last-day">
            last 90 days
          </div>
          <div className="datepicker-container__last-day-container__last-day">
            last year
          </div>
        </div>
        {isCalendarVisible && (
          <>
            <DatePicker
              selected={selected}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              formatWeekDay={formatWeekDay}
              selectsRange
              inline
            />
          </>
        )}
      </div>
    </>
  );
}
