import React, { useState } from "react";
import "./manage-templates.scss";
import { Dropdown } from "Components/UI_Kits/Dropdown";
import { useQuery, useMutation } from "@apollo/client";

import { evaluationTemplatesGet } from "../../../../Apollo/Queries";
import {
  groupTemplateAdd,
  groupTemplateRemove,
} from "../../../../Apollo/Mutations";

import { Loader } from "Components/elements";

export default function ManageTemplates({ group }) {
  let [isRemoving, setIsRemoving] = useState({});

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
            <div className="group-template" key={`template-${template.id}`}>
              {canRemoveTemplate && (
                <i
                  className={
                    isRemoving[template.id]
                      ? "fa fa-spinner fa-spin"
                      : "fa fa-times"
                  }
                  aria-hidden="true"
                  onClick={async () => {
                    if (isRemoving[template.id]) {
                      return;
                    }

                    setIsRemoving({
                      ...isRemoving,
                      [template.id]: true,
                    });

                    try {
                      await templateRemove({
                        variables: {
                          groupId: group.id,
                          templateId: template.id,
                        },
                      });
                    } catch (error) {
                      console.log("error", error);
                    }

                    setIsRemoving({
                      ...isRemoving,
                      [template.id]: false,
                    });
                  }}
                />
              )}

              {template.name}
            </div>
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
