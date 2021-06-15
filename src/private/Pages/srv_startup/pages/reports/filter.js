import React, { useState } from "react";
import "./filter.scss";
import InputCheckBox from "../ui-kits/check-box";
import { Modal } from "../../../../../Components/UI_Kits/Modal/Modal";
import TagsModal from "../ui-kits/TagsModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Filter({ close }) {
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [value, setValue] = useState([null, null]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setCalendarVisible(false);
    }
  };
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  return (
    <>
      <div className="filter-container">
        <i
          className="fa fa-chevron-right"
          aria-hidden="true"
          onClick={() => close(false)}
        ></i>
        <div className="filter-container__header">funnel stage</div>
        <div className="filter-container__funnel-container">
          <div className="funnel">
            <InputCheckBox />
            <span className="funnel__name">Reviewed</span>
            <div className="funnel__funnel-bar-container">
              <div className="funnel-bar-red"></div>
            </div>
          </div>
          <div className="funnel">
            <InputCheckBox />
            <span className="funnel__name">Met</span>
            <div className="funnel__funnel-bar-container">
              <div className="funnel-bar-blue"></div>
            </div>
          </div>
          <div className="funnel">
            <InputCheckBox />
            <span className="funnel__name">Analyzed</span>
            <div className="funnel__funnel-bar-container">
              <div className="funnel-bar-purple"></div>
            </div>
          </div>
          <div className="funnel">
            <InputCheckBox />
            <span className="funnel__name">IC</span>
            <div className="funnel__funnel-bar-container">
              <div className="funnel-bar-orange"></div>
            </div>
          </div>
          <div className="funnel">
            <InputCheckBox />
            <span className="funnel__name">Invested</span>
            <div className="funnel__funnel-bar-container">
              <div className="funnel-bar-green"></div>
            </div>
          </div>
        </div>
        <div className="filter-container__header">tags</div>
        <div className="filter-container__tags-container__choose-tags">
          Write or choose tags
        </div>
        <div className="filter-container__tags-container__placeholder">
          <i className="fa fa-plus" onClick={() => setShowTagsModal(true)}></i>
        </div>
        <div className="filter-container__header">date</div>
        <div className="filter-container__date-time">
          <div className="filter-container__from-to">
            <div className="filter-container__from-to__header">From</div>
            <div
              className="filter-container__from-to__datePicker"
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
          <div className="filter-container__from-to">
            <div className="filter-container__from-to__header">To</div>
            <div
              className="filter-container__from-to__datePicker"
              onClick={() => setCalendarVisible(true)}
            >
              <div>
                {endDate ? endDate.toLocaleDateString("en-US") : "mm/dd/yyyy"}
                <i class="fa fa-calendar" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="filter-container__last-day-container">
          <div className="filter-container__last-day-container__last-day">
            last 7 days
          </div>
          <div className="filter-container__last-day-container__last-day">
            last 14 days
          </div>
          <div className="filter-container__last-day-container__last-day">
            last 30 days
          </div>
          <div className="filter-container__last-day-container__last-day">
            last 90 days
          </div>
          <div className="filter-container__last-day-container__last-day">
            last year
          </div>
        </div>
        {isCalendarVisible && (
          <>
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              formatWeekDay={nameOfDay => nameOfDay.substr(0, 1)}
              selectsRange
              inline
            />
            <div className="ghost-filter"></div>
          </>
        )}
      </div>
      <div className="ghost"></div>
      {showTagsModal && (
        <Modal
          title="Add Tags"
          submit={() => {
            setShowTagsModal(false);
          }}
          close={() => {
            setShowTagsModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={<TagsModal></TagsModal>}
        ></Modal>
      )}
    </>
  );
}
