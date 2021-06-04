import React, { useState, useEffect } from "react";
import "./funnels.scss";
import {
  ICONPOSITION,
  SETTINGSMENU,
} from "../../NewDesign/srv_startup/pages/constants";
import ButtonWithIcon from "../../NewDesign/srv_startup/pages/ui-kits/button-with-icon";
import { Modal } from "../../../Components/UI_Kits/Modal/Modal";
import { useQuery } from "@apollo/client";
import { accountGet } from "../../Apollo/Queries";

let colorArray = ["red", "blue", "purple", "orange", "green"];

function getDefaultFunnel() {
  return {
    id: `${Math.floor(Math.random() * 1000).toString()}`,
    name: "",
    color: "red",
    isNew: true,
  };
}

function EditFunnel({ funnelGroup, save }) {
  let [funnel, setFunnel] = useState({});
  let [newFunnel, setNewFunnel] = useState(getDefaultFunnel());

  useEffect(() => {
    if (funnelGroup) {
      setFunnel(funnelGroup);
    }
  }, [funnelGroup]);

  function updateTag(tag) {
    setFunnel({
      ...funnel,
      funnelTags: funnel.funnelTags.map(ft => (ft.id === tag.id ? tag : ft)),
    });
  }

  return (
    <div className="funnels-container__new-funnel">
      <div className="funnels-container__new-funnel__text">
        {funnel.name}
        <ButtonWithIcon
          className="funnels-container__new-funnel__save"
          text="Save"
          iconPosition={ICONPOSITION.NONE}
          onClick={() => {
            let saveObj = funnel;

            if (newFunnel.name?.length) {
              saveObj = {
                ...funnel,
                funnelTags: [...funnel.funnelTags, newFunnel],
              };
            }

            console.log("save\n", JSON.stringify(saveObj, null, 2));
          }}
        />
      </div>

      <div className="groups">
        {funnel.funnelTags?.map((tag, index) => {
          return (
            <div className="groups__group" key={tag.id}>
              <div className="groups__group__heading">
                <input
                  type="text"
                  maxLength={20}
                  value={tag.name}
                  onChange={e => {
                    updateTag({ ...tag, name: e.target.value });
                  }}
                />
              </div>
              <div
                className={`groups__group__funnel ${
                  tag.color || colorArray[index] || "red"
                }`}
              />

              <div className="groups__group__color-pallets">
                {colorArray.map(color => (
                  <div
                    key={color}
                    className={`color-pallet ${color} ${
                      tag.color === color ? "selected" : ""
                    }`}
                    onClick={() => updateTag({ ...tag, color })}
                  />
                ))}
              </div>

              <i
                className="fa fa-times-circle"
                aria-hidden="true"
                onClick={() => {
                  setFunnel({
                    ...funnel,
                    funnelTags: funnel.funnelTags.filter(
                      ({ id }) => id !== tag.id
                    ),
                  });
                }}
              />
            </div>
          );
        })}

        <div className="groups__group">
          <div className="groups__group__heading">
            <input
              type="text"
              maxLength={20}
              value={newFunnel.name}
              onChange={e => {
                setNewFunnel({
                  ...newFunnel,
                  name: e.target.value,
                });
              }}
            />
          </div>
          <div
            className={`groups__group__funnel ${newFunnel.color || "red"}`}
          />

          <div className="groups__group__color-pallets">
            {colorArray.map(color => (
              <div
                key={color}
                className={`color-pallet ${color} ${
                  newFunnel.color === color ? "selected" : ""
                }`}
                onClick={() => {
                  setNewFunnel({
                    ...newFunnel,
                    color,
                  });
                }}
              />
            ))}
          </div>

          <i
            className="fa fa-plus-circle"
            aria-hidden="true"
            onClick={() => {
              if (!newFunnel.name.length) {
                return;
              }
              setFunnel({
                ...funnel,
                funnelTags: [...funnel.funnelTags, newFunnel],
              });
              setNewFunnel(getDefaultFunnel());
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Funnel({ funnelGroup, setEdit }) {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="funnels-container__funnels__funnel">
      <div className="funnels-container__funnels__funnel__heading">
        {funnelGroup.name}
        <span
          className="material-icons tags-container__tag__heading__more"
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          {" "}
          more_horiz{" "}
          {openDropdown && (
            <div className="funnels-container__funnels__funnel__heading__dropdown">
              <div
                className="drop-down-item"
                onClick={() => setOpenDropdown(false)}
              >
                <span className="material-icons">edit</span>
                <span
                  className="text"
                  onClick={() => {
                    setEdit(funnelGroup.id);
                  }}
                >
                  EDIT
                </span>
              </div>
              <div
                className="drop-down-item leave"
                onClick={() => setOpenDropdown(false)}
              >
                <span className="material-icons leave">delete</span>
                <span
                  className="text"
                  onClick={() => {
                    console.log("delete funnel group");
                  }}
                >
                  DELETE FUNNEL
                </span>
              </div>
            </div>
          )}
        </span>
      </div>

      <div className="parts">
        {funnelGroup.funnelTags?.map((tag, index) => {
          // Max width of bar
          let max = 180;

          // Min width of bar
          let min = 20;

          // Difference
          let diff = max - min;

          // Increments
          let inc = Math.round(diff / funnelGroup.funnelTags.length);

          // Max with - increment multiplied by index
          let width = `${max - inc * index}px`;

          return (
            <div className="parts__part" key={tag.id}>
              <div className="parts__part__heading">{tag.name}</div>
              <div
                className={`parts__part__funnel ${
                  tag.color || colorArray[index] || "red"
                }`}
                style={{ width }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Funnels({ setMenuSelected }) {
  // States
  const [createModal, setCreateModal] = useState(false);
  // const [isFunnelDropDown, setIsFunnelDropDown] = useState(false);
  const [noOfFunnels, setNoOfFunnels] = useState(1);
  const [newFunnel, setNewFunnel] = useState("");
  const [selectedColorPallet, setSelectedColorPallet] = useState("red");
  const [newLevelText, setNewLevelText] = useState("");
  const [newFunnelLevels, setNewFunnelLevels] = useState([]);

  const [isEditing, setIsEditing] = useState({});

  const [funnels, setFunnels] = useState([]);

  // Queries
  const { data } = useQuery(accountGet);
  let funnelGroups = data?.accountGet?.funnelGroups;

  useEffect(() => {
    if (funnelGroups) {
      setFunnels(funnelGroups);
    }
  }, [funnelGroups]);

  return (
    <div className="funnels-container">
      <div className="card funnels-container__card">
        {/* NAVIGATION */}
        <div className="card-heading funnels-container__heading">
          <i
            className="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => setMenuSelected(SETTINGSMENU.HOME)}
          />
          Funnels
        </div>

        {/* FUNNELS */}
        <div className="funnels-container__funnels">
          {funnels.map(funnelGroup => {
            if (!isEditing[funnelGroup.id]) {
              return (
                <Funnel
                  key={funnelGroup.id}
                  funnelGroup={funnelGroup}
                  setEdit={() => {
                    setIsEditing({
                      ...isEditing,
                      [funnelGroup.id]: true,
                    });
                  }}
                />
              );
            }

            if (isEditing[funnelGroup.id]) {
              return (
                <EditFunnel
                  key={funnelGroup.id}
                  funnelGroup={funnelGroup}
                  save={() => {
                    setIsEditing({
                      ...isEditing,
                      [funnelGroup.id]: false,
                    });
                  }}
                />
              );
            }
          })}
        </div>

        {/* NEW FUNNEL */}
        {newFunnel && <EditFunnel />}

        <ButtonWithIcon
          className="funnels-container__create-new-funnel"
          iconName="add"
          text="CREATE NEW GROUP"
          iconPosition={ICONPOSITION.START}
          onClick={() => setCreateModal(true)}
        />
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
            />
          }
        />
      )}
    </div>
  );
}
