import React, { useState } from "react";
import "./funnels.scss";
import {
  ICONPOSITION,
  SETTINGSMENU,
} from "../../NewDesign/srv_startup/pages/constants";
import ButtonWithIcon from "../../NewDesign/srv_startup/pages/ui-kits/button-with-icon";
import { Modal } from "../../../Components/UI_Kits/Modal/Modal";

export default function Funnels({ setMenuSelected }) {
  const [createModal, setCreateModal] = useState(false);
  const [isFunnelDropDown, setIsFunnelDropDown] = useState(false);
  const [noOfFunnels, setNoOfFunnels] = useState(1);
  const [newFunnel, setNewFunnel] = useState("");
  const [selectedColorPallet, setSelectedColorPallet] = useState("red");
  const [newLevelText, setNewLevelText] = useState("");
  const [newFunnelLevels, setNewFunnelLevels] = useState([]);
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
          {[...Array(noOfFunnels)].map((elementInArray, index) => {
            return (
              <div
                className="funnels-container__funnels__funnel"
                key={`funnel-record-id-${index}`}
              >
                <div className="funnels-container__funnels__funnel__heading">
                  STAGE
                  <span
                    class="material-icons tags-container__tag__heading__more"
                    onClick={() => setIsFunnelDropDown(!isFunnelDropDown)}
                  >
                    {" "}
                    more_horiz{" "}
                    {isFunnelDropDown && (
                      <div className="funnels-container__funnels__funnel__heading__dropdown">
                        <div
                          className="drop-down-item"
                          onClick={() => setIsFunnelDropDown(false)}
                        >
                          <span class="material-icons">edit</span>
                          <span className="text">EDIT</span>
                        </div>
                        <div
                          className="drop-down-item leave"
                          onClick={() => setIsFunnelDropDown(false)}
                        >
                          <span class="material-icons leave">delete</span>
                          <span className="text">DELETE FUNNEL</span>
                        </div>
                      </div>
                    )}
                  </span>
                </div>
                <div className="parts">
                  <div className="parts__part">
                    <div className="parts__part__heading">Reviewed</div>
                    <div className="parts__part__funnel red"></div>
                  </div>
                  <div className="parts__part">
                    <div className="parts__part__heading">Met</div>
                    <div className="parts__part__funnel blue"></div>
                  </div>
                  <div className="parts__part">
                    <div className="parts__part__heading">Analyzed</div>
                    <div className="parts__part__funnel purple"></div>
                  </div>
                  <div className="parts__part">
                    <div className="parts__part__heading">IC</div>
                    <div className="parts__part__funnel orange"></div>
                  </div>
                  <div className="parts__part">
                    <div className="parts__part__heading">Invested</div>
                    <div className="parts__part__funnel green"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {newFunnel && (
          <div className="funnels-container__new-funnel">
            <div className="funnels-container__new-funnel__text">
              {newFunnel}
              <ButtonWithIcon
                className="funnels-container__new-funnel__save"
                text="Save"
                iconPosition={ICONPOSITION.NONE}
                onClick={() => {
                  setNoOfFunnels(noOfFunnels + 1);
                  setNewFunnelLevels([]);
                  setNewLevelText("");
                  setNewFunnel("");
                }}
              ></ButtonWithIcon>
            </div>
            <div className="groups">
              {newFunnelLevels.map((item, index) => {
                return (
                  <div className="groups__group">
                    <div className="groups__group__heading-text">
                      {item.levelName}
                    </div>
                    <div
                      className={`groups__group__funnel ${item.selectedColor}`}
                    ></div>
                    <i
                      class="fa fa-times-circle"
                      aria-hidden="true"
                      onClick={() => {
                        let newFunnels = [...newFunnelLevels];
                        newFunnels.splice(index, 1);
                        setNewFunnelLevels(newFunnels);
                      }}
                    ></i>
                  </div>
                );
              })}
              <div className="groups__group">
                <div className="groups__group__heading">
                  <input
                    type="text"
                    maxLength={10}
                    value={newLevelText}
                    onChange={e => setNewLevelText(e.target.value)}
                  />
                </div>
                <div
                  className={`groups__group__funnel ${selectedColorPallet}`}
                ></div>
                <div className="groups__group__color-pallets">
                  <div
                    className={`color-pallet red ${
                      selectedColorPallet === "red" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedColorPallet("red")}
                  ></div>
                  <div
                    className={`color-pallet blue ${
                      selectedColorPallet === "blue" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedColorPallet("blue")}
                  ></div>
                  <div
                    className={`color-pallet purple ${
                      selectedColorPallet === "purple" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedColorPallet("purple")}
                  ></div>
                  <div
                    className={`color-pallet orange ${
                      selectedColorPallet === "orange" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedColorPallet("orange")}
                  ></div>
                  <div
                    className={`color-pallet green ${
                      selectedColorPallet === "green" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedColorPallet("green")}
                  ></div>
                </div>
                <i
                  class="fa fa-plus-circle"
                  aria-hidden="true"
                  onClick={() => {
                    if (newLevelText) {
                      let newFunnels = [...newFunnelLevels];
                      newFunnels.push({
                        levelName: newLevelText,
                        selectedColor: selectedColorPallet,
                      });
                      setNewFunnelLevels(newFunnels);
                      setNewLevelText("");
                      setSelectedColorPallet("red");
                    }
                  }}
                ></i>
              </div>
            </div>
          </div>
        )}
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
          submit={() => {
            if (newFunnel) {
              setCreateModal(false);
            }
          }}
          close={() => {
            setNewFunnel("");
            setCreateModal(false);
          }}
          submitTxt="Create"
          closeTxt="Cancel"
          children={
            <input
              className="funnels-container__create-new-funnel-text"
              type="text"
              value={newFunnel}
              onChange={e => setNewFunnel(e.target.value)}
            ></input>
          }
        ></Modal>
      )}
    </div>
  );
}
