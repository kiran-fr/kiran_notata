import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

// API STUFF
import { useQuery } from "@apollo/client";
import { accountGet } from "private/Apollo/Queries";
import { evaluation_template_page } from "definitions";

// COMPONENTS
import { GhostLoader } from "Components/elements";
import ButtonWithIcon from "../../../../Components/UI_Kits/from_srv/button-with-icon";
import CreateNewTemplateModal from "./modals/CreateNewTemplateModal";
import DeleteTemplateModal from "./modals/DeleteTemplateModal";
import EditTemplateModal from "./modals/EditTemplateModal";
import CloneTemplateModal from "./modals/CloneTemplateModal";

// STYLES
import "../evaluation-templates.scss";

// OTHER
import { ICONPOSITION } from "../../constants";

function TemplateModal({
  setEditModalForTemplate,
  setCloneModalForTemplate,
  setDeleteModalForTemplate,
  template,
  reference,
}) {
  return (
    <div className="browse__drop-dwon" ref={reference}>
      <div
        className="browse__drop-dwon__item"
        onClick={() => setEditModalForTemplate(template)}
      >
        <span className="material-icons settings">edit</span>
        <span className="text">EDIT</span>
      </div>
      <div
        className="browse__drop-dwon__item"
        onClick={() => setCloneModalForTemplate(template)}
      >
        <span className="material-icons settings">content_copy</span>
        <span className="text">CLONE</span>
      </div>
      <div
        className="browse__drop-dwon__item leave"
        onClick={() => setDeleteModalForTemplate(template)}
      >
        <span className="material-icons leave">delete</span>
        <span className="delete-text">DELETE</span>
      </div>
    </div>
  );
}

export const EvaluationTemplatesPage = ({ history }) => {
  // Constant
  const back = useHistory();
  const popup = useRef();

  // States
  const [viewDropdown, setViewDropdown] = useState(null);
  const [createNewModal, setCreateNewModal] = useState(false);

  const [deleteModalForTemplate, setDeleteModalForTemplate] = useState(
    undefined
  );
  const [editModalForTemplate, setEditModalForTemplate] = useState(undefined);
  const [cloneModalForTemplate, setCloneModalForTemplate] = useState(undefined);

  // Queries
  const { data, loading } = useQuery(accountGet);

  // Data maps
  let templates = data?.accountGet?.evaluationTemplates;

  // Effects
  useEffect(() => {
    const handleGlobalEvent = e =>
      !e.path.includes(popup.current) && viewDropdown
        ? setViewDropdown(null)
        : null;
    window.addEventListener("click", handleGlobalEvent);
    return () => {
      window.removeEventListener("click", handleGlobalEvent);
    };
  });

  if (!data && loading) {
    return <GhostLoader />;
  }

  return (
    <div>
      <div className="evaluation-templates-container">
        {/* HEADER */}
        <div className="row">
          <div className="col-sm-6 col-xs-12 evaluation-templates-container__heading">
            <i
              class="fa fa-chevron-left"
              aria-hidden="true"
              style={{ marginRight: 20, cursor: "pointer" }}
              onClick={() => back.goBack()}
            />
            Evaluation templates
          </div>
          <div className="col-sm-6 col-xs-12 evaluation-templates-container__create-template">
            <ButtonWithIcon
              iconName="add"
              className="create-template-btn"
              text="CREATE Evaluation templates"
              iconPosition={ICONPOSITION.START}
              onClick={() => setCreateNewModal(true)}
            />
          </div>
        </div>
        <div className="evaluation-templates-container__data-container">
          {templates?.map(template => (
            <div
              className="row evaluation-templates-container__data-container__data"
              key={`row-id-${template.id}`}
            >
              <div
                className="col-sm-4 col-xs-10 template-name"
                onClick={() => {
                  history.push(`${evaluation_template_page}/${template?.id}`);
                }}
              >
                {template.name}
              </div>
              <div className="col-sm-3 col-xs-10 sections">
                {template?.sections?.length || 0} sections
              </div>

              <div className="col-sm-2 col-xs-2 browse">
                <span
                  className="material-icons"
                  onClick={() => {
                    setViewDropdown(
                      viewDropdown === template.id ? null : template.id
                    );
                  }}
                >
                  more_horiz
                </span>

                {viewDropdown === template.id && (
                  <TemplateModal
                    reference={popup}
                    setCloneModalForTemplate={setCloneModalForTemplate}
                    setDeleteModalForTemplate={setDeleteModalForTemplate}
                    setEditModalForTemplate={setEditModalForTemplate}
                    template={template}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {createNewModal && (
        <CreateNewTemplateModal
          history={history}
          close={() => setCreateNewModal(false)}
        />
      )}

      {deleteModalForTemplate && (
        <DeleteTemplateModal
          history={history}
          template={deleteModalForTemplate}
          close={() => setDeleteModalForTemplate(undefined)}
        />
      )}

      {editModalForTemplate && (
        <EditTemplateModal
          history={history}
          template={editModalForTemplate}
          close={() => setEditModalForTemplate(undefined)}
        />
      )}

      {cloneModalForTemplate && (
        <CloneTemplateModal
          history={history}
          template={cloneModalForTemplate}
          close={() => setCloneModalForTemplate(undefined)}
        />
      )}
    </div>
  );
};
