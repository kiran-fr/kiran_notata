import React, { useState } from "react";
import "./Groups.scss";
import ButtonWithIcon from "../../../srv_startup/pages/ui-kits/button-with-icon";
import { ICONPOSITION } from "../../../srv_startup/pages/constants";
import { Modal } from "../../../../../Components/UI_Kits";
import SharingOptions from "./sharing-options";
import CreateNewGroup from "./create-new-group/create-new-group";
import RemoveFromGroup from "./remove-from-group";
import { group_dashboard } from "../../../../../definitions";
import { useMutation, useQuery } from "@apollo/client";
import { groupStartupRemove } from "../../../../Apollo/Mutations";
import { connectionGet, groupsGetV2 } from "../../../../Apollo/Queries";
import AddGroup from "../../../Startup/Modal/addGroup";

export default function Groups({ connection, history }) {
  const [deleteModal, setDeleteModal] = useState(undefined);
  const [sharingOptionsModal, setSharingOptionsModal] = useState(undefined);
  const [createGroupModal, setCreateGroupModal] = useState(false);

  const [addToGroupModal, setAddToGroupModal] = useState(undefined);

  // Queries
  const groupsQuery = useQuery(groupsGetV2);

  const [removeStartup, removeStartupRes] = useMutation(groupStartupRemove, {
    refetchQueries: [
      {
        query: connectionGet,
        variables: { id: connection.id },
      },
    ],
  });

  let data = [];
  for (let info of connection?.groupSharingInfo || []) {
    let creativeId = connection?.creative?.id;
    let creativeName = connection?.creative?.name;
    let sharedSubjectiveScore = info?.subjectiveScores?.some(
      ({ isMe }) => isMe
    );

    let sharedEvaluations = info?.evaluations?.filter(
      ({ createdByUser }) => createdByUser.isMe
    );

    let item = {
      group: info?.group,
      creativeId,
      creativeName,
      sharedSubjectiveScore,
      sharedEvaluations,
      sharedBy: info.sharedBy,
      iAmAdmin: info.iAmAdmin,
      iAmOwner: info.iAmOwner,
    };
    data.push(item);
  }

  const getItem = groupId => data.find(({ group }) => group.id === groupId);

  return (
    <>
      <div className="row tab-panel-container group-individual-container">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-heading">Groups</div>
            {data.map(item => {
              return (
                <div
                  className="row group-container"
                  key={`group-${item.group.id}`}
                >
                  <div className="col-sm-3 col-xs-6">
                    <div
                      className="group-name"
                      onClick={() => {
                        history.push(`${group_dashboard}/${item.group.id}`);
                      }}
                    >
                      {item.group.name}
                    </div>

                    <div className="members">
                      Shared by: {item.sharedBy.given_name}{" "}
                      {item.sharedBy.family_name}{" "}
                      {item.sharedBy.isMe && " (you)"}
                    </div>

                    {item.sharedBy.isMe && (
                      <div
                        className="remove-from-group"
                        onClick={() => setDeleteModal(item.group.id)}
                      >
                        remove from group
                      </div>
                    )}
                  </div>
                  <div className="col-sm-3 col-xs-6 evaluations">
                    <div className="evaluation-template">
                      Evaluations you share:
                    </div>
                    <div className="templates">
                      {!item.sharedEvaluations.length && (
                        <div className="template" style={{ opacity: 0.5 }}>
                          you are not sharing any evaluations
                        </div>
                      )}

                      {item.sharedEvaluations.map(evaluation => {
                        return (
                          <div
                            className="template"
                            key={`template-${item.group.id}-${evaluation?.id}`}
                          >
                            {evaluation?.template?.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-sm-2 col-xs-12 subjective-score">
                    <div className="evaluation-template col-sm-12 col-xs-6">
                      Subjective score:
                    </div>
                    <div className="templates col-sm-12 col-xs-6">
                      <div className="share">
                        {item.sharedSubjectiveScore ? "shared" : "not shared"}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4 sharing-options">
                    <ButtonWithIcon
                      iconPosition={ICONPOSITION.START}
                      iconName={"share"}
                      text="Sharing options"
                      onClick={() => setSharingOptionsModal(item.group.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="row">
            <div className="col-sm-12 create-new-group">
              <ButtonWithIcon
                iconPosition={ICONPOSITION.START}
                iconName={"add"}
                text="ADD TO NEW GROUP"
                onClick={() => setAddToGroupModal(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {sharingOptionsModal && (
        <Modal
          title="Sharing options"
          submit={() => {
            setSharingOptionsModal(undefined);
          }}
          close={() => {
            setSharingOptionsModal(undefined);
          }}
          submitTxt="OK"
          closeTxt="CLOSE"
          children={
            <SharingOptions
              groupId={getItem(sharingOptionsModal).group?.id}
              creativeId={getItem(sharingOptionsModal)?.creativeId}
              connection={connection}
              sharedSubjectiveScore={
                getItem(sharingOptionsModal)?.sharedSubjectiveScore
              }
              sharedEvaluations={
                getItem(sharingOptionsModal)?.sharedEvaluations
              }
            />
          }
        />
      )}

      {createGroupModal && (
        <Modal
          title="Create new group"
          submit={() => {
            setCreateGroupModal(false);
          }}
          close={() => {
            setCreateGroupModal(false);
          }}
          submitTxt="OK"
          closeTxt="CLOSE"
          children={<CreateNewGroup />}
        />
      )}

      {addToGroupModal && (
        <Modal
          title="Add startup to group"
          submit={() => {
            setAddToGroupModal(false);
          }}
          close={() => {
            setAddToGroupModal(false);
          }}
          submitTxt="Create"
          closeTxt="Cancel"
          children={
            <AddGroup
              connection={connection}
              groups={groupsQuery?.data?.groupsGetV2}
            />
          }
        />
      )}

      {deleteModal && (
        <Modal
          title="Remove from group"
          loading={removeStartupRes.loading}
          submit={async () => {
            if (removeStartupRes.loading) {
              return;
            }

            let variables = {
              groupId: deleteModal,
              creativeId: connection.creative.id,
            };

            try {
              await removeStartup({ variables });
            } catch (error) {
              console.log("error", error);
            }

            setDeleteModal(undefined);
          }}
          close={() => {
            setDeleteModal(undefined);
          }}
          submitTxt="Remove"
          closeTxt="Cancel"
          children={<RemoveFromGroup />}
        />
      )}
    </>
  );
}
