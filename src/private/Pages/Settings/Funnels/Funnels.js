import React, { useState, useEffect } from "react";
import "./Funnels.scss";
import { ICONPOSITION } from "../../constants";
import ButtonWithIcon from "../../../../Components/UI_Kits/from_srv/button-with-icon";

import { Modal } from "Components/UI_Kits/Modal/Modal";
import { useMutation, useQuery } from "@apollo/client";
import { accountGet } from "../../../Apollo/Queries";
import {
  funnelTagCreate,
  funnelTagUpdate,
  funnelTagDelete,
  funnelGroupCreate,
  funnelGroupUpdate,
  funnelGroupDelete,
} from "../../../Apollo/Mutations";
import { settings } from "../../../../definitions";
import { GhostLoader } from "../../../../Components/elements";

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

  const mutOption = {
    refetchQueries: [{ query: accountGet }],
  };

  const [isSaving, setIsSaving] = useState(false);
  const [updateModal, setUpdateModal] = useState(undefined);

  const [createGroup] = useMutation(funnelGroupCreate);
  const [updateTagMutation] = useMutation(funnelTagUpdate);
  const [createTagMutation] = useMutation(funnelTagCreate, mutOption);
  const [deleteTagMutation] = useMutation(funnelTagDelete, mutOption);

  const [updateGroup, updateGroupRes] = useMutation(funnelGroupUpdate);

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
    <>
      <div className="funnels-container__new-funnel">
        <div className="funnels-container__new-funnel__text">
          {funnel.name}{" "}
          <span
            className="material-icons"
            style={{
              fontSize: "16px",
              position: "relative",
              paddingLeft: "4px",
              color: "var(--ui-color-primary-green-dark2)",
              cursor: "pointer",
            }}
            onClick={() => setUpdateModal(true)}
          >
            edit
          </span>
          <ButtonWithIcon
            className="funnels-container__new-funnel__save"
            text={
              isSaving === (funnelGroup?.id || "tmp") ? "...saving" : "Save"
            }
            iconPosition={ICONPOSITION.NONE}
            onClick={async () => {
              if (isSaving === (funnelGroup?.id || "tmp")) {
                return;
              }

              let funnelGroupId = funnelGroup.id;
              setIsSaving(funnelGroup?.id || "tmp");

              // CREATE NEW GROUP
              if (funnelGroup.isNew) {
                try {
                  let variables = {
                    input: {
                      name: funnelGroup.name,
                    },
                  };
                  let res = await createGroup({ variables });
                  funnelGroupId = res?.data?.funnelGroupCreate?.id;
                } catch (error) {
                  return console.log("error", error);
                }
              }

              // UPDATE
              let updateItems = funnel.funnelTags?.filter(
                ({ isNew }) => !isNew
              );
              if (updateItems.length) {
                let promises = updateItems.map((it, index) => {
                  let variables = {
                    id: it.id,
                    input: {
                      name: it.name,
                      index,
                    },
                  };
                  return updateTagMutation({ variables });
                });
                try {
                  let res = await Promise.all(promises);
                  console.log("res", res);
                } catch (error) {
                  console.log("error", error);
                }
              }

              // CREATE
              let createItems = funnel.funnelTags?.filter(({ isNew }) => isNew);
              if (newFunnel.name?.length) {
                createItems.push(newFunnel);
              }
              if (createItems.length) {
                let promises = createItems.map((it, index) => {
                  let variables = {
                    funnelGroupId: funnelGroupId,
                    input: {
                      name: it.name,
                      index,
                    },
                  };
                  return createTagMutation({ variables });
                });
                try {
                  let res = await Promise.all(promises);
                  console.log("res", res);
                } catch (error) {
                  console.log("error", error);
                }
              }

              // DELETE
              let deleteItems = funnelGroup?.funnelTags?.filter(
                ({ id }) => !funnel.funnelTags?.find(t => t.id === id)
              );
              if (deleteItems.length) {
                let promises = deleteItems.map(it => {
                  let variables = {
                    id: it.id,
                  };
                  return deleteTagMutation({ variables });
                });
                try {
                  await Promise.all(promises);
                } catch (error) {
                  console.log("error", error);
                }
              }

              setIsSaving(false);

              save();
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
                    autoComplete="off"
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
                autoComplete="off"
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

      {updateModal && (
        <Modal
          title="Update funnel group name"
          loading={updateGroupRes.loading}
          submit={async () => {
            if (funnel.name) {
              let variables = {
                id: funnelGroup.id,
                input: {
                  name: funnel.name,
                },
              };
              try {
                await updateGroup({ variables });
              } catch (error) {
                console.log("error");
              }
            }
            setUpdateModal(false);
          }}
          close={() => {
            setUpdateModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={
            <input
              className="funnels-container__create-new-funnel-text"
              type="text"
              value={funnel.name}
              autoComplete="off"
              onChange={e =>
                setFunnel({
                  ...funnel,
                  name: e.target.value,
                })
              }
            />
          }
        />
      )}
    </>
  );
}

function Funnel({ funnelGroup, setEdit }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [deleteModal, setDeleteModal] = useState(undefined);

  const [deleteGroup, deleteGroupRes] = useMutation(funnelGroupDelete, {
    refetchQueries: [{ query: accountGet }],
  });

  return (
    <>
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
                  onClick={() => {
                    setEdit(funnelGroup.id);
                    setOpenDropdown(false);
                  }}
                >
                  <span className="material-icons">edit</span>
                  <span className="text">EDIT</span>
                </div>

                <div
                  className="drop-down-item leave"
                  onClick={() => {
                    setDeleteModal(funnelGroup.id);
                    setOpenDropdown(false);
                  }}
                >
                  <span className="material-icons leave">delete</span>
                  <span className="text">DELETE FUNNEL</span>
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

                <div className="parts__part__color_block">
                  <div
                    className={`parts__part__funnel ${
                      tag.color || colorArray[index] || "red"
                    }`}
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {deleteModal && (
        <Modal
          title="Delete funnel"
          loading={deleteGroupRes.loading}
          submit={async () => {
            let variables = {
              id: funnelGroup.id,
            };
            try {
              await deleteGroup({ variables });
            } catch (error) {
              console.log("error", error);
            }
            setDeleteModal(false);
          }}
          close={() => {
            setDeleteModal(false);
          }}
          submitTxt="Delete"
          closeTxt="Cancel"
          children={
            <div className="delete-group-modal-container">
              <div className="description">
                Are you sure you want to delete this group permanently?
              </div>
              <div className="remember">Remember:</div>
              <div className="options">
                - All funnel stages will be removed from startups
                <br />
                - There is not undo function <br />
              </div>
            </div>
            // <input
            //   className="funnels-container__create-new-funnel-text"
            //   type="text"
            //   value={newFunnelVal}
            //   onChange={e => setNewFunnelVal(e.target.value)}
            // />
          }
        />
      )}
    </>
  );
}

export default function Funnels1({ history }) {
  // States
  const [createModal, setCreateModal] = useState(false);
  const [newFunnel, setNewFunnel] = useState("");
  const [newFunnelVal, setNewFunnelVal] = useState("");
  const [isEditing, setIsEditing] = useState({});
  const [funnels, setFunnels] = useState([]);

  // Queries
  const { data, loading } = useQuery(accountGet);
  let funnelGroups = data?.accountGet?.funnelGroups;

  useEffect(() => {
    if (funnelGroups) {
      setFunnels(funnelGroups);
    }
  }, [funnelGroups]);

  if (!data && loading) {
    return <GhostLoader />;
  }

  return (
    <>
      <div className="funnels-container">
        <div className="card funnels-container__card">
          {/* NAVIGATION */}
          <div className="card-heading funnels-container__heading">
            <i
              className="fa fa-chevron-left"
              aria-hidden="true"
              onClick={() => history.push(settings)}
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
                      setNewFunnelVal("");
                      setNewFunnel("");
                    }}
                  />
                );
              }
            })}
          </div>

          {/* NEW FUNNEL */}
          {newFunnel && (
            <EditFunnel
              funnelGroup={{
                name: newFunnel,
                funnelTags: [],
                isNew: true,
              }}
              save={() => {
                setIsEditing({});
                setNewFunnelVal("");
                setNewFunnel("");
              }}
            />
          )}

          <ButtonWithIcon
            className={`funnels-container__create-new-funnel ${
              newFunnel && "disabled"
            }`}
            iconName="add"
            text="CREATE NEW GROUP"
            iconPosition={ICONPOSITION.START}
            onClick={() => {
              if (newFunnel) {
                return;
              }
              setCreateModal(true);
            }}
          />
        </div>
      </div>

      {createModal && (
        <Modal
          title="Create new funnel"
          submit={() => {
            if (newFunnelVal?.length) {
              setNewFunnel(newFunnelVal);
            }
            setNewFunnelVal("");
            setCreateModal(false);
          }}
          close={() => {
            setNewFunnelVal("");
            setNewFunnel("");
            setCreateModal(false);
          }}
          submitTxt="Create"
          closeTxt="Cancel"
          children={
            <input
              className="funnels-container__create-new-funnel-text"
              type="text"
              value={newFunnelVal}
              onChange={e => setNewFunnelVal(e.target.value)}
              autoComplete="off"
            />
          }
        />
      )}
    </>
  );
}
