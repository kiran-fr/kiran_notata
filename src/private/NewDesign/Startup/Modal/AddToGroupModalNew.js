import { useMutation } from "@apollo/client";
import { groupStartupAdd } from "../../../Apollo/Mutations";
import React, { useState } from "react";
import AddGroup from "./addGroup";
import { Modal } from "Components/UI_Kits/Modal/Modal";

export default function AddToGroupModalNew({ close, success, connection }) {
  // Mutations
  const [addStartup, addStartupRes] = useMutation(groupStartupAdd);

  const [selected, setSelect] = useState(undefined);

  return (
    <Modal
      title="Add startup to group"
      loading={addStartupRes.loading}
      submit={async () => {
        if (addStartupRes.loading) {
          return;
        }

        let variables = {
          groupId: selected.id,
          creativeId: connection?.creative?.id,
        };

        try {
          await addStartup({ variables });
        } catch (error) {
          console.log("error", error);
        }

        setSelect(undefined);

        success ? success() : close();
      }}
      close={() => {
        setSelect(undefined);
        close();
      }}
      submitTxt="ADD"
      closeTxt="CLOSE"
      children={
        <AddGroup connection={connection} select={group => setSelect(group)} />
      }
    />
  );
}
