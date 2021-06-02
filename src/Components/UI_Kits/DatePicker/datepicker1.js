import React, { useState } from "react";
import "./datepicker.scss";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";



export const  Datepicker1 = ({ isCalendarVisible, dateRange, setCalendarVisible, selected, onChange, startDate, endDate, formatWeekDay }) => {
  
  const [daterange, setDaterange] = useState([null, null]);

  const setRange = (range) => {
    if (range[1]) {
      range[1] = moment(range[1]).endOf("day").toDate();
    }
    setDaterange(range);
    dateRange("dateRange", range);
  };

  const presetDateValues = () => {

  

    const toDate = moment().endOf("day").toDate();
    const lastYear = new Date()
    var pastYear = lastYear.getFullYear() - 1;
    lastYear.setFullYear(pastYear);
    
    const selectDateRange = [
      {
        label: "Last 7 Days",
        range: [moment().subtract(7, "day").startOf("day").toDate(), toDate],
      },
      {
        label: "Last 14 Days",
        range: [moment().subtract(14, "day").startOf("day").toDate(), toDate],
      },
      {
        label: "Last 30 Days",
        range: [moment().subtract(30, "day").startOf("day").toDate(), toDate],
      },
      {
        label: "Last 90 Days",
        range: [moment().subtract(90, "day").startOf("day").toDate(), toDate],
      },
      {
        label: "Last Year",
        range: [lastYear, toDate],
      },
    ];
    return selectDateRange.map((value, index) => {
      return (
        <div key={index}
          onClick={() => setRange(value.range)}
          className="datepicker-container__last-day-container__last-day"
        >
          {value.label}
        </div>
      );
    });
  }
  
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
          {presetDateValues()}
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
