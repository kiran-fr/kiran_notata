import React, { useState } from "react";
import "./filter.scss";
import InputCheckBox from "../ui-kits/check-box";
import { Modal } from "../../../../Components/UI_Kits/Modal/Modal";
import Tags from "../ui-kits/tags";

export default function Filter({ close }) {
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [value, setValue] = useState([null, null]);

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
          children={<Tags></Tags>}
        ></Modal>
      )}
    </>
  );
}
