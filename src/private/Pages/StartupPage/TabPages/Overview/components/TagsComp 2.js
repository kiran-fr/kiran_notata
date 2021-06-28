import React, { useState } from "react";
import More from "assets/images/more.svg";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import TagsModal from "../../../../../../Components/UI_Kits/from_srv/TagsModal";

export default function TagsComp({ connection }) {
  const [showTagsModal, setShowTagsModal] = useState(false);

  return (
    <>
      <div className="row tags-container overview-tags">
        <div className="tags-container__heading">Tags</div>
        <div className="tags-container__sub-heading">Write or choose tags</div>
        <div className="tags-container__placeholder">
          {connection?.tags?.length > 0
            ? connection?.tags?.slice(0, 2).map(el => (
                <span
                  style={{
                    height: "100%",
                    color: "white",
                    padding: "2px 10px",
                    backgroundColor: "#555",
                    borderRadius: 15,
                    fontSize: 10,
                    marginTop: 1,
                    marginRight: 7,
                    marginBottom: 4,
                  }}
                  key={el.id}
                >
                  {el.group.name} : {el.name}
                </span>
              ))
            : ""}
          {connection?.tags?.length > 2 ? (
            <img src={More} alt="" onClick={() => setShowTagsModal(true)} />
          ) : null}
          <i
            className="fa fa-plus"
            aria-hidden="true"
            onClick={() => setShowTagsModal(true)}
          />
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
          disableFoot={true}
          closeTxt="Cancel"
          children={<TagsModal connection={connection} />}
        />
      )}
    </>
  );
}
