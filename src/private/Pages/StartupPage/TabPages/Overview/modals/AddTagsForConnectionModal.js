import React from "react";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import TagsModal from "Components/UI_Kits/from_srv/TagsModal";
import {
  connectionTagAdd,
  connectionTagRemove,
} from "private/Apollo/Mutations";
import { useMutation } from "@apollo/client";

export default function AddTagsForConnectionModal({ connection, close }) {
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
    <Modal
      title="Add Tags"
      submit={close}
      close={close}
      submitTxt="Save"
      disableFoot={true}
      closeTxt="Cancel"
      children={
        <TagsModal
          preSelectedTags={connection?.tags || []}
          removeTag={removeTag}
          addTag={addTag}
        />
      }
    />
  );
}
