import React, { useState } from "react";
import Tags from "../../srv_startup/pages/ui-kits/tags";
import { Modal } from "../../../../Components/UI_Kits/Modal/Modal";

// API STUFF
import { useQuery, useMutation } from "@apollo/client";

import { tagGroupsGet } from "private/Apollo/Queries";

import styles from "./modal.module.css";

import {
  connectionTagAdd,
  connectionTagRemove,
} from "private/Apollo/Mutations";

// COMPONENTS
import TagSelector from "Components/TagSelector/TagSelector";

// Definitions
import mutationOptions from "../mutationOptions";

export default function SelectTagsForStartup({ connection, close }) {
  // Queries
  const tagGroupsQuery = useQuery(tagGroupsGet);
  const tagGroups = tagGroupsQuery?.data?.tagGroupsGet || [];

  // Mutations
  const [addTagMutation] = useMutation(connectionTagAdd);
  const [deleteTagMutation] = useMutation(connectionTagRemove);
  const [showTagsModal, setShowTagsModal] = useState(false);

  // Add tag function
  function addTag(tag) {
    addTagMutation(mutationOptions.addTag(tag, connection));
  }

  // Remove tag function
  async function deleteTag(tag) {
    try {
      let res = await deleteTagMutation(
        mutationOptions.deleteTag(tag, connection)
      );
      console.log("res", res);
    } catch (error) {
      console.log("deleteTagMutation", error);
    }
  }

  return (
    <>
      <div className="row tags-container overview-tags">
        <div className="tags-container__heading">Tags</div>
        <div className="tags-container__sub-heading">Write or choose tags</div>
        <div className={styles.tagsPlaceholder}>
          <i
            class="fa fa-plus"
            aria-hidden="true"
            onClick={() => setShowTagsModal(true)}
          ></i>
        </div>
      </div>

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
