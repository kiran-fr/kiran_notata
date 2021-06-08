import React, { useState } from "react";
import { Modal } from "Components/UI_Kits";
import TagsModal from "../../../../srv_startup/pages/ui-kits/TagsModal";
import { Loader } from "../../../../../../Components/elements";
import DropDown from "../../../../srv_startup/pages/ui-kits/drop-down";
import { useMutation, useQuery } from "@apollo/client";
import { tagGroupsGet } from "../../../../../Apollo/Queries";
import { connectionTagAdd } from "../../../../../Apollo/Mutations";

export default function AddTagsModal({ close, ids }) {
  const [isLoading, setLoading] = useState(false);
  const [selectedTagGroup, setSelectedTagGroup] = useState(false);
  const [selectedTag, setSelectedTag] = useState(false);

  const [addTagMutation] = useMutation(connectionTagAdd);

  const { data, loading, error } = useQuery(tagGroupsGet);

  let tagGroups = data?.tagGroupsGet || [];

  async function addTag() {
    if (isLoading) return;
    if (!selectedTag) return;
    setLoading(true);

    if (!selectedTag) {
      return;
    }

    let promises = ids.map(connectionId => {
      let variables = {
        tagId: selectedTag.id,
        connectionId,
      };
      return addTagMutation({ variables });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.log("error", error);
    }

    setLoading(false);
    setSelectedTagGroup(false);
    close();
  }

  return (
    <Modal
      title="Add tags"
      loading={isLoading}
      submit={addTag}
      close={close}
      submitTxt="Add tag"
      closeTxt="Cancel"
      children={
        <div className="delete-group-modal-container">
          {!data && loading && <Loader />}

          <div className="row">
            <div className="col-sm-12 col-xs-12">
              <div className="drop-down-heading">Tag groups</div>
              <DropDown
                title=""
                items={tagGroups}
                setSelectedItem={setSelectedTagGroup}
              />
            </div>
          </div>

          {selectedTagGroup && (
            <div className="row" style={{ marginTop: "10px" }}>
              <div className="col-sm-12 col-xs-12">
                <div className="drop-down-heading">Tags</div>
                <DropDown
                  title=""
                  items={selectedTagGroup.tags || []}
                  setSelectedItem={setSelectedTag}
                />
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
