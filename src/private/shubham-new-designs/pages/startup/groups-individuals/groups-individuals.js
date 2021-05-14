import React from "react";
import "./groups-individuals.scss";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { ICONPOSITION } from "../../constants";

export default function GroupsIndividuals() {
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
  ];
  return (
    <div className="row tab-panel-container group-individual-container">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-heading">Groups</div>
          {data.map((item, index) => {
            return (
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
                    Evaluation templates:
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
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
