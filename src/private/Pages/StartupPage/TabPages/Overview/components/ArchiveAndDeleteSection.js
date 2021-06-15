import ButtonWithIcon from "../../../../srv_startup/pages/ui-kits/button-with-icon";
import { ICONPOSITION } from "../../../../srv_startup/pages/constants";
import React, { useState } from "react";
import ArchiveModal from "../modals/ArchiveModal";
import DeleteModal from "../modals/DeleteModal";
import { archive_page } from "definitions";

export default function ArchiveAndDeleteSection({ connection, history }) {
  const [archiveModal, setArchiveModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <>
      <div className="row">
        <div className="col-xs-6 col-sm-6">
          <ButtonWithIcon
            iconName="add"
            className="text-center archive-btn"
            text="ARCHIVE STARTUP"
            iconPosition={ICONPOSITION.NONE}
            onClick={() => setArchiveModal(true)}
          />
          <div
            className="open-archive"
            onClick={() => {
              history.push(archive_page);
            }}
          >
            Open Archive
          </div>
        </div>
        <div className="col-xs-6 col-sm-6">
          <ButtonWithIcon
            iconName="add"
            className="text-center delete-btn"
            text="DELETE STARTUP PERMANENTLY"
            iconPosition={ICONPOSITION.NONE}
            onClick={() => setDeleteModal(true)}
          />
        </div>
      </div>

      {archiveModal && (
        <ArchiveModal
          connection={connection}
          history={history}
          close={() => {
            setArchiveModal(false);
          }}
        />
      )}

      {deleteModal && (
        <DeleteModal
          connection={connection}
          history={history}
          close={() => {
            setDeleteModal(false);
          }}
        />
      )}
    </>
  );
}
