import React, { useState } from "react";
import "./tags.scss";
import { ICONPOSITION, SETTINGSMENU } from "../constants";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import { Modal } from "../../../../Components/UI_Kits/Modal/Modal";

export default function Tags({ setMenuSelected }) {
  let tags = ["B2C", "C2C", "Financia", "PropTech", "FinTech", "Gaming"];
  const [availableTags, setAvailableTags] = useState(tags);
  const [newTag, setNewTag] = useState("");
  const [newTagGroup, setNewTagGroup] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [tagsGroups, setTagGroups] = useState(["Market"]);
  return (
    <div className="tags-container">
      <div className="card tags-container__card">
        <div className="card-heading tags-container__heading">
          <i
            class="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => setMenuSelected(SETTINGSMENU.HOME)}
          ></i>
          Tags
        </div>
        {tagsGroups.map((tagGroup, tagIndex) => {
          return (
            <div
              className="tags-container__tag"
              key={`tag-group-record-${tagIndex}`}
            >
              <div className="tags-container__tag__heading">{tagGroup}</div>
              <div className="tags-container__tag__available-tags">
                {availableTags.map((item, index) => {
                  return (
                    <div
                      className="tags-container__tag__available-tags__tag-name"
                      key={`available-tags-record-${index}`}
                    >
                      {item}
                      <i
                        class="fa fa-times"
                        aria-hidden="true"
                        onClick={() => {
                          let available_tags = [...availableTags];
                          available_tags = available_tags.filter(
                            availableTag => {
                              return availableTag != item;
                            }
                          );
                          setAvailableTags(available_tags);
                        }}
                      ></i>
                    </div>
                  );
                })}
              </div>
              <div className="tags-container__tag__add-new-tag">
                <div className="heading">Add New Tag</div>
                <div className="tags-container__tag__add-new-tag__input">
                  <input
                    type="text"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                  />
                  <i
                    class="fa fa-plus-circle"
                    aria-hidden="true"
                    onClick={() => {
                      if (newTag != "") {
                        let available_tags = [...availableTags];
                        available_tags.push(newTag);
                        setAvailableTags(available_tags);
                        setNewTag("");
                      }
                    }}
                  ></i>
                </div>
              </div>
            </div>
          );
        })}

        <ButtonWithIcon
          className="tags-container__create-new-tag"
          iconName="add"
          text="CREATE NEW GROUP"
          iconPosition={ICONPOSITION.START}
          onClick={() => setCreateModal(true)}
        ></ButtonWithIcon>
      </div>
      {createModal && (
        <Modal
          title="Create new tag group"
          submit={() => {
            if (newTagGroup != "") {
              setCreateModal(false);
              let available_tag_groups = [...tagsGroups];
              available_tag_groups.push(newTagGroup);
              setTagGroups(available_tag_groups);
            }
            setNewTagGroup("");
          }}
          close={() => {
            setCreateModal(false);
            setNewTagGroup("");
          }}
          submitTxt="Create"
          closeTxt="Cancel"
          children={
            <input
              className="tags-container__create-new-tag-group-text"
              type="text"
              value={newTagGroup}
              onChange={e => setNewTagGroup(e.target.value)}
            ></input>
          }
        ></Modal>
      )}
    </div>
  );
}
