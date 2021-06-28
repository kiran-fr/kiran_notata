import React, { useEffect, useState } from "react";
import defaultData from "../_defaultGroupData";
import TextBox from "../../../../Components/UI_Kits/from_srv/text-box";
import { useMutation } from "@apollo/client";
import { groupUpdate } from "../../../Apollo/Mutations";
import { Modal } from "Components/UI_Kits/Modal/Modal";

export default function EditGroupModal({ group, close }) {
  const [data, setData] = useState(defaultData);
  const [updateGroup, updateGroupRes] = useMutation(groupUpdate);

  useEffect(() => {
    if (group) {
      setData({
        ...data,
        general: {
          name: group?.name,
          description: group?.description,
        },
      });
    }
  }, [group]);

  async function save() {
    let variables = {
      id: group.id,
      name: data?.general?.name || group.name || "",
      description: data?.general?.description || group?.description || "",
    };
    updateGroup({ variables });
    close();
  }

  return (
    <Modal
      title="Edit"
      submit={save}
      loading={updateGroupRes.loading}
      close={close}
      submitTxt="Save"
      closeTxt="Cancel"
      children={
        <div className="genral-contianer">
          <div className="group-name">
            Group Name<span className="asterik">*</span>
          </div>
          <div className="text">
            <TextBox
              placeholder="Group Name"
              value={data.general.name || ""}
              onChange={e =>
                setData({
                  ...data,
                  general: {
                    ...data.general,
                    name: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="group-name description">group Description</div>
          <textarea
            placeholder="Group Description"
            value={data.general.description || ""}
            onChange={e =>
              setData({
                ...data,
                general: {
                  ...data.general,
                  description: e.target.value,
                },
              })
            }
          />
        </div>
      }
    />
  );
}
