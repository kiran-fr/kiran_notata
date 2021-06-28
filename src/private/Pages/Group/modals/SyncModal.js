import React, { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import { connectionCreate } from "../../../Apollo/Mutations";
import "./SyncModal.scss";
import { groupGetV2 } from "../../../Apollo/Queries";

export default function SyncModal({ startups, refetch, groupId, close }) {
  const [loading, setLoading] = useState(false);
  const [isMutating, setIsMutating] = useState({});

  const [mutate] = useMutation(connectionCreate);

  async function save() {
    setLoading(true);

    let promises = startups.map(async ({ creative }) => {
      setIsMutating({
        ...isMutating,
        [creative.id]: true,
      });
      let variables = { creativeId: creative.id };
      try {
        await mutate({ variables });
      } catch (error) {
        console.log("error", error);
      }
      setIsMutating({
        ...isMutating,
        [creative.id]: false,
      });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.log(error);
    }

    try {
      let variables = {
        id: groupId,
      };
      let res = await refetch({ variables });
      console.log("res", res);
    } catch (error) {
      console.log("error", error);
    }

    setLoading(false);

    close();
  }

  return (
    <Modal
      title="Sync with group"
      submit={save}
      loading={loading}
      close={() => {
        if (loading) {
          return;
        }
        close();
      }}
      submitTxt="Sync"
      closeTxt="Cancel"
      children={
        <div className="sync-modal">
          <div className="sync-modal__title">
            These startups are not in your dealflow yet. By clicking "sync" we
            will add them for you. (It might take a few seconds).
          </div>

          {startups.map(({ creative }) => {
            return (
              <div key={creative.id} className="sync-modal__record">
                {isMutating[creative.id] && (
                  <i className="fa fa-spinner fa-spin" />
                )}
                <span>{creative.name}</span>
              </div>
            );
          })}
        </div>
      }
    />
  );
}
