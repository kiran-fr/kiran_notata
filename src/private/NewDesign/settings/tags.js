import React, { useState } from "react";
import "./tags.scss";
import {
  ICONPOSITION,
  SETTINGSMENU,
} from "../../NewDesign/srv_startup/pages/constants";
import ButtonWithIcon from "../../NewDesign/srv_startup/pages/ui-kits/button-with-icon";
import { Modal } from "../../../Components/UI_Kits/Modal/Modal";
import { useMutation, useQuery } from "@apollo/client";
import { tagGroupsGet } from "../../Apollo/Queries";
import {
  tagCreate,
  tagDelete,
  tagGroupCreate,
  tagGroupDelete,
  tagGroupUpdate,
  tagUpdate,
} from "../../Apollo/Mutations";
import { settings } from "../../../definitions";
import { group as group_page } from "../../../definitions";
import DeleteGroup from "../srv_startup/pages/GroupV2/delete-group-modal";
import { Loader } from "../../../Components/elements";

function DeleteTagGroupModal({ tagGroup, setDeleteTagGroupModal }) {
  const [deleteTagGroup, deleteTagGroupRes] = useMutation(tagGroupDelete, {
    refetchQueries: [{ query: tagGroupsGet }],
  });

  return (
    <Modal
      title="Delete tag group"
      loading={deleteTagGroupRes.loading}
      submit={async () => {
        if (deleteTagGroupRes.loading) {
          return;
        }

        let variables = {
          id: tagGroup.id,
        };
        try {
          await deleteTagGroup({ variables });
        } catch (error) {
          console.log("error", error);
        }
        setDeleteTagGroupModal(undefined);
      }}
      close={() => {
        setDeleteTagGroupModal(undefined);
      }}
      loading={deleteTagGroupRes.loading}
      submitTxt="Delete"
      closeTxt="Cancel"
      submitButtonStyle="secondary"
      children={
        <div className="delete-group-modal-container">
          <div className="description">
            Are you sure you want to delete this tag group permanently?
          </div>
        </div>
      }
    />
  );
}

function DeleteTagModal({ tag, setDeleteTagModal }) {
  const [deleteTag, deleteTagRes] = useMutation(tagDelete, {
    refetchQueries: [{ query: tagGroupsGet }],
  });

  return (
    <Modal
      title="Delete tag"
      loading={deleteTagRes.loading}
      submit={async () => {
        if (deleteTagRes.loading) {
          return;
        }

        let variables = {
          id: tag.id,
        };
        try {
          await deleteTag({ variables });
        } catch (error) {
          console.log("error", error);
        }
        setDeleteTagModal(undefined);
      }}
      close={() => {
        setDeleteTagModal(undefined);
      }}
      submitTxt="Delete"
      closeTxt="Cancel"
      submitButtonStyle="secondary"
      children={
        <div className="delete-group-modal-container">
          <div className="description">
            Are you sure you want to delete this tag permanently?
          </div>
          <div className="remember">Remember:</div>
          <div className="options">
            - Tag will be removed from all startups
            <br />
            - You cannot undo this change
            <br />
          </div>
        </div>
      }
    />
  );
}

function EditTagModal({ tag, setEditTagModal }) {
  const [tagName, setTagName] = useState(tag.name);
  const [updateTag, updateTagRes] = useMutation(tagUpdate, {
    refetchQueries: [{ query: tagGroupsGet }],
  });

  return (
    <Modal
      title="Delete tag"
      loading={updateTagRes.loading}
      submit={async () => {
        if (updateTagRes.loading) {
          return;
        }

        let variables = {
          id: tag.id,
          input: {
            name: tagName,
          },
        };
        try {
          await updateTag({ variables });
        } catch (error) {
          console.log("error", error);
        }
        setEditTagModal(undefined);
      }}
      close={() => {
        setEditTagModal(undefined);
      }}
      submitTxt="Save"
      closeTxt="Cancel"
      submitButtonStyle="secondary"
      children={
        <input
          className="tags-container__create-new-tag-group-text"
          type="text"
          value={tagName}
          onChange={e => setTagName(e.target.value)}
        />
      }
    />
  );
}

function EditTagGroupModal({ tagGroup, setEditTagGroupModal }) {
  const [tagName, setTagName] = useState(tagGroup.name);

  const [updateTagGroup, updateTagGroupRes] = useMutation(tagGroupUpdate, {
    refetchQueries: [{ query: tagGroupsGet }],
  });

  return (
    <Modal
      title="Delete tag"
      loading={updateTagGroupRes.loading}
      submit={async () => {
        if (updateTagGroupRes.loading) {
          return;
        }

        if (!tagName.length) {
          return;
        }

        let variables = {
          id: tagGroup.id,
          input: {
            name: tagName,
          },
        };
        try {
          await updateTagGroup({ variables });
        } catch (error) {
          console.log("error", error);
        }
        setEditTagGroupModal(undefined);
      }}
      close={() => {
        setEditTagGroupModal(undefined);
      }}
      submitTxt="Save"
      closeTxt="Cancel"
      submitButtonStyle="secondary"
      children={
        <input
          className="tags-container__create-new-tag-group-text"
          type="text"
          value={tagName}
          onChange={e => setTagName(e.target.value)}
        />
      }
    />
  );
}

function TagGroup({ tagGroup }) {
  const [deleteTagGroupModal, setDeleteTagGroupModal] = useState(false);
  const [deleteTagModal, setDeleteTagModal] = useState(undefined);
  const [editTagModal, setEditTagModal] = useState(undefined);
  const [editTagGroupModal, setEditTagGroupModal] = useState(undefined);

  const [newTag, setNewTag] = useState("");
  const [isTagDropDown, setIsTagDropDown] = useState(false);

  // Mutations
  const [createTag, createTagRes] = useMutation(tagCreate, {
    refetchQueries: [{ query: tagGroupsGet }],
  });

  return (
    <>
      <div className="tags-container__tag">
        <div className="tags-container__tag__heading">
          {tagGroup.name}
          <span
            className="material-icons tags-container__tag__heading__more"
            onClick={() => setIsTagDropDown(!isTagDropDown)}
          >
            {" "}
            more_horiz{" "}
            {isTagDropDown && (
              <div className="tags-container__tag__heading__dropdown">
                <div
                  className="drop-down-item"
                  onClick={() => setIsTagDropDown(false)}
                >
                  <span className="material-icons">edit</span>
                  <span
                    className="text"
                    onClick={() => {
                      setEditTagGroupModal(true);
                    }}
                  >
                    EDIT
                  </span>
                </div>
                <div
                  className="drop-down-item leave"
                  onClick={() => {
                    setDeleteTagGroupModal(true);
                  }}
                >
                  <span class="material-icons leave">delete</span>
                  <span className="text">DELETE TAG GROUP</span>
                </div>
              </div>
            )}
          </span>
        </div>
        <div className="tags-container__tag__available-tags">
          {tagGroup?.tags?.map(tag => {
            return (
              <div
                className="tags-container__tag__available-tags__tag-name"
                key={`available-tags-record-${tag.id}`}
              >
                <span
                  onClick={() => {
                    setEditTagModal(tag);
                  }}
                >
                  {tag.name}
                </span>
                <i
                  class="fa fa-times"
                  aria-hidden="true"
                  onClick={() => {
                    setDeleteTagModal(tag);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="tags-container__tag__add-new-tag">
          <div className="heading">Add New Tag</div>
          <div
            className="tags-container__tag__add-new-tag__input"
            style={{ opacity: createTagRes.loading ? 0.5 : 1 }}
          >
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
            />
            <i
              class="fa fa-plus-circle"
              aria-hidden="true"
              onClick={async () => {
                if (newTag === "") {
                  return;
                }
                if (createTagRes.loading) {
                  return;
                }
                let variables = {
                  tagGroupId: tagGroup.id,
                  input: {
                    name: newTag,
                  },
                };
                try {
                  await createTag({ variables });
                } catch (error) {
                  console.log("error", error);
                }
                setNewTag("");
              }}
            />
          </div>
        </div>
      </div>

      {deleteTagModal && (
        <DeleteTagModal
          tag={deleteTagModal}
          setDeleteTagModal={setDeleteTagModal}
        />
      )}

      {editTagModal && (
        <EditTagModal tag={editTagModal} setEditTagModal={setEditTagModal} />
      )}

      {editTagGroupModal && (
        <EditTagGroupModal
          tagGroup={tagGroup}
          setEditTagGroupModal={setEditTagGroupModal}
        />
      )}

      {deleteTagGroupModal && !tagGroup.tags?.length && (
        <DeleteTagGroupModal
          tagGroup={tagGroup}
          setDeleteTagGroupModal={setDeleteTagGroupModal}
        />
      )}

      {deleteTagGroupModal && !!tagGroup.tags?.length && (
        <Modal
          title="Delete tag group"
          submit={() => {
            setDeleteTagGroupModal(undefined);
          }}
          close={() => {
            setDeleteTagGroupModal(undefined);
          }}
          submitTxt="OK"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={
            <div className="delete-group-modal-container">
              <div className="description">
                All tags have to be deleted before you can delete the group
              </div>
            </div>
          }
        />
      )}
    </>
  );
}

export default function Tags({ history }) {
  // Queries
  const { data, loading, error } = useQuery(tagGroupsGet);

  // Mutations
  const [createTagGroup, createTagGroupRes] = useMutation(tagGroupCreate, {
    refetchQueries: [{ query: tagGroupsGet }],
  });

  // Data maps
  let tagGroups = data?.tagGroupsGet || [];

  const [newTagGroup, setNewTagGroup] = useState("");
  const [createModal, setCreateModal] = useState(false);

  return (
    <div className="tags-container">
      <div className="card tags-container__card">
        <div className="card-heading tags-container__heading">
          <i
            class="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => history.push(settings)}
          />
          Tags
        </div>

        {!data && loading && <Loader />}

        {tagGroups.map(tagGroup => (
          <TagGroup tagGroup={tagGroup} key={tagGroup.id} />
        ))}

        <ButtonWithIcon
          className="tags-container__create-new-tag"
          iconName="add"
          text="CREATE NEW GROUP"
          iconPosition={ICONPOSITION.START}
          onClick={() => setCreateModal(true)}
        />
      </div>

      {createModal && (
        <Modal
          title="Create new tag group"
          loading={createTagGroupRes.loading}
          submit={async () => {
            if (createTagGroupRes.loading) {
              return;
            }

            if (!newTagGroup.length) {
              return;
            }

            let variables = {
              input: {
                name: newTagGroup,
              },
            };
            try {
              await createTagGroup({ variables });
            } catch (error) {
              console.log("error", error);
            }
            setCreateModal(false);
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
            />
          }
        />
      )}
    </div>
  );
}
