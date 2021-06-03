import React, { useState } from "react";
import "./groups-individuals.scss";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { ICONPOSITION } from "../../constants";
import { Modal } from "../../../../../../Components/UI_Kits";
import SharingOptions from "./sharing-options";
import CreateNewGroup from "./create-new-group/create-new-group";
import { group_dashboard } from "../../../../../../definitions";

export default function GroupsIndividuals({ connection, history }) {
  const [showFullList, setShowFullList] = useState(false);
  const [sharingOptionsModal, setSharingOptionsModal] = useState(undefined);
  const [createGroupModal, setCreateGroupModal] = useState(false);

  console.log("connection", connection);

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

    console.log("\n**************");
    console.log("info.evaluations", info.evaluations);
    console.log("sharedEvaluations", sharedEvaluations);
    console.log("===============\n");

    let item = {
      group: info?.group,
      creativeId,
      creativeName,
      sharedSubjectiveScore,
      sharedEvaluations,
    };
    data.push(item);
  }

  console.log("data", data);

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
                    {/*<div className="members">{item.group.members.length} Members</div>*/}
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

            {/*<div className="row">*/}
            {/*  <div className="col-sm-12 text-right see-full-list">*/}
            {/*    See full list*/}
            {/*    <i*/}
            {/*      class={`fa ${*/}
            {/*        !showFullList ? "fa-chevron-up" : "fa-chevron-down"*/}
            {/*      }`}*/}
            {/*      aria-hidden="true"*/}
            {/*      onClick={() => setShowFullList(!showFullList)}*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>

          <div className="row">
            <div className="col-sm-12 create-new-group">
              <ButtonWithIcon
                iconPosition={ICONPOSITION.START}
                iconName={"add"}
                text="CREATE NEW GROUP"
                onClick={() => setCreateGroupModal(true)}
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
          submitTxt="Create"
          closeTxt="Cancel"
          children={<CreateNewGroup />}
        />
      )}
    </>
  );
}
