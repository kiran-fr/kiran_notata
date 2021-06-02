import React from "react";
import TextBox from "../../../ui-kits/text-box";

export default function General({ data, setData }) {
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
