import React, { useState } from "react";
import { group_dashboard } from "../../../../../../definitions";
import AddToGroupModalNew from "../../../../Startup/Modal/AddToGroupModalNew";

export default function GroupsComp({ refetch, connection, goToPath }) {
  const [addToGroupModal, setAddToGroupModal] = useState(false);

  return (
    <>
      <div className="row groups-container">
        <div className="overview-container__scores__heading">Groups</div>
        {/*<div className="tags-container__sub-heading">*/}
        {/*  Adding tags makes it easier to filter, find similar startups, and*/}
        {/*  makes great analytics*/}
        {/*</div>*/}
        <div className="col-sm-12 col-xs-12" />
        {connection?.groupSharingInfo?.map(info => (
          <div
            className="group-name"
            key={info?.group?.id}
            onClick={() => {
              goToPath(`${group_dashboard}/${info?.group?.id}`);
            }}
          >
            {info?.group?.name}
          </div>
        ))}

        <div className="groups-container__add-button">
          <i
            className="fa fa-plus"
            aria-hidden="true"
            onClick={() => setAddToGroupModal(true)}
          />
        </div>
      </div>

      {addToGroupModal && (
        <AddToGroupModalNew
          connection={connection}
          close={() => setAddToGroupModal(false)}
          success={() => {
            refetch();
            setAddToGroupModal(false);
          }}
        />
      )}
    </>
  );
}
