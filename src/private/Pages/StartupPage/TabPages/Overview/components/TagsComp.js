import React, { useState } from "react";
import More from "assets/images/more.svg";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import TagsModal from "../../../../../../Components/UI_Kits/from_srv/TagsModal";
import {
  connectionTagAdd,
  connectionTagRemove,
} from "private/Apollo/Mutations";
import { useMutation } from "@apollo/client";
import AddTagsForConnectionModal from "../modals/AddTagsForConnectionModal";

export default function TagsComp({ connection }) {
  const [showTagsModal, setShowTagsModal] = useState(false);

  // Mutations
  const [addTagMutation] = useMutation(connectionTagAdd);
  const [removeTagMutation] = useMutation(connectionTagRemove);

  async function removeTag(tagId) {
    let variables = {
      connectionId: connection.id,
      tagId: tagId,
    };
    let optimisticResponse = {
      __typename: "Mutation",
      connectionTagRemove: {
        ...connection,
        tags: [
          ...connection.tags
            .filter(({ id }) => id !== tagId)
            .map(t => ({
              ...t,
              index: null,
              description: null,
              createdBy: "tmp",
              createdAt: 0,
            })),
        ],
        __typename: "Connection",
      },
    };
    removeTagMutation({ variables, optimisticResponse });
  }

  async function addTag(tag) {
    let variables = {
      connectionId: connection.id,
      tagId: tag.id,
    };

    let optimisticResponse = {
      __typename: "Mutation",
      connectionTagAdd: {
        ...connection,
        tags: [...connection.tags, tag],
        __typename: "Connection",
      },
    };

    addTagMutation({
      variables,
      optimisticResponse,
    });
  }

  return (
    <>
      <div className="row tags-container overview-tags">
        <div className="tags-container__heading">Tags</div>
        <div className="tags-container__sub-heading">
          Adding tags makes it easier to filter, find similar startups, and
          makes great analytics
        </div>
        <div className="tags-container__placeholder">
          {connection?.tags?.map(el => (
            <span key={el.id} className="tags-container__tag-item">
              <span className="inner-tag">
                {el.group.name}: {el.name}
              </span>
            </span>
          ))}
          <i
            className="fa fa-plus"
            aria-hidden="true"
            onClick={() => setShowTagsModal(true)}
          />
        </div>
      </div>

      {showTagsModal && (
        <AddTagsForConnectionModal
          connection={connection}
          close={() => setShowTagsModal(false)}
        />
      )}
    </>
  );
}
