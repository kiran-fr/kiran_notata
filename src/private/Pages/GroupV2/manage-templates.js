import React, { useState } from "react";
import "./manage-templates.scss";
import { Dropdown } from "Components/UI_Kits/Dropdown";
import { useQuery, useMutation } from "@apollo/client";

import { evaluationTemplatesGet, userGet } from "../../Apollo/Queries";
import { groupTemplateAdd, groupTemplateRemove } from "../../Apollo/Mutations";

import { Loader } from "Components/elements";

function EachTemplate({ template, groupId, canRemoveTemplate }) {
  let [mutate, { loading }] = useMutation(groupTemplateRemove);

  return (
    <div className="group-template">
      {canRemoveTemplate && (
        <i
          className={loading ? "fa fa-spinner fa-spin" : "fa fa-times"}
          aria-hidden="true"
          onClick={() => {
            if (loading) {
              return;
            }
            mutate({
              variables: {
                groupId,
                templateId: template.id,
              },
            });
          }}
        />
      )}

      {template.name}
    </div>
  );
}

export default function ManageTemplates({ group }) {
  // Queries
  let { data, loading } = useQuery(evaluationTemplatesGet);

  // Mutations
  let [templateAdd, addRes] = useMutation(groupTemplateAdd);

  let groupTemplates = group?.evaluationTemplates || [];
  let myTemplates = data?.accountGet?.evaluationTemplates || [];

  // Remove already added templates from array
  myTemplates = myTemplates.filter(
    ({ id }) => !groupTemplates.some(g => g.id === id)
  );

  // TODO: use settings
  let canAddTemplate = group.iAmAdmin;
  let canRemoveTemplate = group.iAmAdmin;

  if (!data && loading) {
    return <Loader />;
  }

  return (
    <div className="row manage-template-container">
      {addRes.loading && <Loader />}

      <div className="col-sm-6 col-xs-12 selected-templates">
        <div className="heading">Group templates</div>
        {groupTemplates.map(template => {
          return (
            <EachTemplate
              key={template.id}
              template={template}
              groupId={group.id}
              canRemoveTemplate={canRemoveTemplate}
            />
          );
        })}
      </div>

      {canAddTemplate && (
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
      )}
    </div>
  );
}
