import React from "react";
import "./manage-templates.scss";
import { Dropdown } from "Components/UI_Kits/Dropdown";
import { useQuery, useMutation } from "@apollo/client";

import { evaluationTemplatesGet } from "../../../../Apollo/Queries";
import {
  groupTemplateAdd,
  groupTemplateRemove,
} from "../../../../Apollo/Mutations";

const Loader = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "rgba(255,255,255,0.5)",
        zIndex: 99999,
        left: 0,
        top: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      loader
    </div>
  );
};

export default function ManageTemplates({ group }) {
  // TODO:
  // There is something wrong with this function...
  // The group query gets hit from mother component.

  // Queries
  let { data, loading, called, error } = useQuery(evaluationTemplatesGet);

  // Mutations
  let [templateAdd, addRes] = useMutation(groupTemplateAdd);
  let [templateRemove, removeRes] = useMutation(groupTemplateRemove);

  let groupTemplates = group?.evaluationTemplates || [];
  let myTemplates = data?.accountGet?.evaluationTemplates || [];

  // Remove already added templates from array
  myTemplates = myTemplates.filter(
    ({ id }) => !groupTemplates.some(g => g.id === id)
  );

  let isLoading = loading || addRes.loading || removeRes.loading;

  if (!data && loading) {
    return <Loader />;
  }

  return (
    <div className="row manage-template-container">
      {isLoading && <Loader />}

      <div className="col-sm-6 col-xs-12 selected-templates">
        <div className="heading">Group templates</div>
        {groupTemplates.map(template => {
          return (
            <div className="group-template" key={`template-${template.id}`}>
              <i
                class="fa fa-times"
                aria-hidden="true"
                onClick={() => {
                  templateRemove({
                    variables: {
                      groupId: group.id,
                      templateId: template.id,
                    },
                  });
                }}
              />
              {template.name}
            </div>
          );
        })}
      </div>

      <div className="col-sm-6 col-xs-12 add-tenmplate">
        <div className="heading">Add Template</div>
        <Dropdown
          title="Template Name"
          items={myTemplates}
          setSelectedItem={item => {
            templateAdd({
              variables: {
                groupId: group.id,
                templateId: item.id,
              },
            });
          }}
        />
      </div>
    </div>
  );
}
