import React, { useEffect } from "react";
import TextBox from "../../../../../../Components/UI_Kits/from_srv/text-box";

export default function General({ group, data, setData }) {
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

  return (
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
  );
}
