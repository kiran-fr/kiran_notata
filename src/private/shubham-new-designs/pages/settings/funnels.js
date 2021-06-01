import React, { useState } from "react";
import "./funnels.scss";
import { ICONPOSITION, SETTINGSMENU } from "../constants";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import { Modal } from "../../../../Components/UI_Kits/Modal/Modal";

export default function Funnels({ setMenuSelected }) {
  const [createModal, setCreateModal] = useState(false);
  return (
    <div className="funnels-container">
      <div className="card funnels-container__card">
        <div className="card-heading funnels-container__heading">
          <i
            class="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => setMenuSelected(SETTINGSMENU.HOME)}
          ></i>
          Funnels
        </div>
        <div className="funnels-container__funnels">
          <div className="funnels-container__funnels__funnel">
            <div className="funnels-container__funnels__funnel__heading">
              STAGE
              <span
                class="material-icons funnels-container__funnels__funnel__heading__more"
                onClick={() => setIsTagDropDown(!isTagDropDown)}
              >
                {" "}
                more_horiz{" "}
                {isTagDropDown && (
                  <div className="funnels-container__funnels__funnel__heading__dropdown">
                    <div
                      className="drop-down-item"
                      onClick={() => setIsTagDropDown(false)}
                    >
                      <span class="material-icons">edit</span>
                      <span className="text">EDIT</span>
                    </div>
                    <div className="drop-down-item leave" onClick={() => {}}>
                      <span class="material-icons leave">delete</span>
                      <span className="text">DELETE FUNNEL</span>
                    </div>
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>
        <ButtonWithIcon
          className="funnels-container__create-new-funnel"
          iconName="add"
          text="CREATE NEW GROUP"
          iconPosition={ICONPOSITION.START}
          onClick={() => setCreateModal(true)}
        ></ButtonWithIcon>
      </div>
      {createModal && (
        <Modal
          title="Create new funnel"
          submit={() => {}}
          close={() => {
            setCreateModal(false);
          }}
          submitTxt="Create"
          closeTxt="Cancel"
          children={
            <input
              className="funnels-container__create-new-funnel-text"
              type="text"
              //   value={newTagGroup}
              //   onChange={e => setNewTagGroup(e.target.value)}
            ></input>
          }
        ></Modal>
      )}
    </div>
  );
}
