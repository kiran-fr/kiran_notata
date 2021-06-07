import React, { useState } from "react";
import { Modal } from "Components/UI_Kits";
import DropDown from "../../../../srv_startup/pages/ui-kits/drop-down";
import { useMutation, useQuery } from "@apollo/client";
import { groupsGetV2 } from "../../../../../Apollo/Queries";
import { Loader } from "../../../../../../Components/elements";
import { groupStartupAdd } from "../../../../../Apollo/Mutations";

export default function AddToGroupModal({ close, connections }) {
  const creativeIds = connections.map(({ creative }) => creative.id);

  const [isLoading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(false);

  const { data, loading, error } = useQuery(groupsGetV2);
  const [addToGroupMutation] = useMutation(groupStartupAdd);

  let groups = data?.groupsGetV2 || [];

  groups = groups.filter(({ iAmAdmin }) => iAmAdmin);

  async function addToGroup() {
    if (isLoading) return;
    if (!selectedGroup) return;

    setLoading(true);

    let promises = creativeIds.map(creativeId => {
      let variables = {
        groupId: selectedGroup.id,
        creativeId,
      };
      return addToGroupMutation({ variables });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.log("error", error);
    }

    setLoading(false);
    setSelectedGroup(false);
    close();
  }

  return (
    <Modal
      title="Add to group"
      loading={isLoading}
      submit={addToGroup}
      close={close}
      submitTxt="Add"
      closeTxt="Cancel"
      children={
        <div className="delete-group-modal-container">
          {!data && loading && <Loader />}
          <div className="row">
            <div className="col-sm-12 col-xs-12">
              <div className="drop-down-heading">Groups</div>
              <DropDown
                title=""
                items={groups}
                setSelectedItem={setSelectedGroup}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}
