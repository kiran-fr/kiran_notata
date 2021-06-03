import React, { useState } from "react";
import "./groups-individuals.scss";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { ICONPOSITION } from "../../constants";
import { Modal } from "../../../../../../Components/UI_Kits";
import SharingOptions from "./sharing-options";
import CreateNewGroup from "./create-new-group/create-new-group";

export default function GroupsIndividuals() {
  const [showFullList, setShowFullList] = useState(false);
  const [sharingOptionsModal, setSharingOptionsModal] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(false);

  const data = [
    {
      name: "Group 1",
      member: 11,
      evaluation_templates: [
        "First impression",
        "Before pitching",
        "After pitching",
      ],
      subjective_score: "Shared",
    },
    {
      name: "Group 1",
      member: 11,
      evaluation_templates: [
        "First impression",
        "Before pitching",
        "After pitching",
      ],
      subjective_score: "Shared",
    },
    {
      name: "Group 1",
      member: 11,
      evaluation_templates: [
        "First impression",
        "Before pitching",
        "After pitching",
      ],
      subjective_score: "Shared",
    },
    {
      name: "Group 1",
      member: 11,
      evaluation_templates: [
        "First impression",
        "Before pitching",
        "After pitching",
      ],
      subjective_score: "Shared",
    },
    {
      name: "Group 1",
      member: 11,
      evaluation_templates: [
        "First impression",
        "Before pitching",
        "After pitching",
      ],
      subjective_score: "Shared",
    },
    {
      name: "Group 1",
      member: 11,
      evaluation_templates: [
        "First impression",
        "Before pitching",
        "After pitching",
      ],
      subjective_score: "Shared",
    },
  ];
  return (
    <>
      <div className="row tab-panel-container group-individual-container">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-heading">Groups</div>
            {data.map((item, index) => {
              return !showFullList && index >= 2 ? (
                <></>
              ) : (
                <div
                  className="row group-container"
                  key={`group-${item.name}-${index}`}
                >
                  <div className="col-sm-3 col-xs-6">
                    <div className="group-name">{item.name}</div>
                    <div className="members">{`${item.member} Members`}</div>
                  </div>
                  <div className="col-sm-3 col-xs-6 evaluations">
                    <div className="evaluation-template">
                      Evaluations you share:
                    </div>
                    <div className="templates">
                      {item.evaluation_templates.map((template, groupIndex) => {
                        return (
                          <div
                            className="template"
                            key={`template-${item.name}-${template}-${groupIndex}`}
                          >
                            {template}
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
                      <div className="share">{item.subjective_score}</div>
                    </div>
                  </div>
                  <div className="col-sm-4 sharing-options">
                    <ButtonWithIcon
                      iconPosition={ICONPOSITION.START}
                      iconName={"share"}
                      text="Sharing options"
                      onClick={() => setSharingOptionsModal(true)}
                    />
                  </div>
                </div>
              );
            })}

            <div className="row">
              <div className="col-sm-12 text-right see-full-list">
                See full list
                <i
                  class={`fa ${
                    !showFullList ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                  aria-hidden="true"
                  onClick={() => setShowFullList(!showFullList)}
                ></i>
              </div>
            </div>
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
            setSharingOptionsModal(false);
          }}
          close={() => {
            setSharingOptionsModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={<SharingOptions></SharingOptions>}
        ></Modal>
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
          children={<CreateNewGroup></CreateNewGroup>}
        ></Modal>
      )}
    </>
  );
}
