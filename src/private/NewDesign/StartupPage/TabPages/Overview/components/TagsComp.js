import React, { useState } from "react";
import More from "assets/images/more.svg";
import { Modal } from "Components/UI_Kits/Modal/Modal";
import TagsModal from "../../../../srv_startup/pages/ui-kits/TagsModal";

export default function TagsComp({ connection }) {
  const [showTagsModal, setShowTagsModal] = useState(false);

  return (
    <>
      <div className="row tags-container overview-tags">
        <div className="tags-container__heading">Tags</div>
        <div className="tags-container__sub-heading">
          Adding tags makes it easier to filter, find similar startups, and
          makes great analytics
        </div>
        <div className="tags-container__placeholder">
          {connection?.tags?.map(el => (
            <span key={el.id} className="tags-container__tag-item">
              <span className="inner-tag">
                {el.group.name}: {el.name}
              </span>
            </span>
          ))}
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
