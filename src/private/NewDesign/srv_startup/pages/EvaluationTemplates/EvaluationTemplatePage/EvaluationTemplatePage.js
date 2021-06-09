import React, { useState, useEffect, useRef } from "react";

// API STUFF
import { useMutation, useLazyQuery } from "@apollo/client";
import { evaluationTemplateGet } from "private/Apollo/Queries";
import { evaluationTemplateUpdate } from "private/Apollo/Mutations";

// COMPONENTS
import TextBox from "../../ui-kits/text-box";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { GhostLoader } from "Components/elements";

// STYLES
import "../SectionPage.scss";

// HELPERS

// OTHER
import { ICONPOSITION } from "../../constants";
import { evaluation_template_page } from "definitions";

import ImportSectionModal from "./modals/ImportSectionModal";
import AddSectionModal from "./modals/AddSectionModal";
import DeleteSectionModal from "./modals/DeleteSectionModal";
import CloneSectionModal from "./modals/CloneSectionModal";
import { evaluation_templates_page } from "../../../../../../definitions";

import { useHistory } from "react-router-dom";

function TemplatePopup({
  setCloneModalForSection,
  setDeleteModalForSection,
  section,
  reference,
}) {
  return (
    <div className="browse__drop-dwon" ref={reference}>
      <div
        className="browse__drop-dwon__item"
        onClick={() => {
          setCloneModalForSection(section);
        }}
      >
        <span className="material-icons settings">content_copy</span>
        <span className="text">CLONE</span>
      </div>
      <div
        className="browse__drop-dwon__item leave"
        onClick={() => {
          setDeleteModalForSection(section);
        }}
      >
        <span className="material-icons leave">delete</span>
        <span className="delete-text">DELETE</span>
      </div>
    </div>
  );
}

export const EvaluationTemplatePage = ({ match, history }) => {
  const hist = useHistory();
  const popup = useRef();

  // Constants
  const id = match?.params?.id;

  // States
  const [viewDropdown, setViewDropdown] = useState(undefined);

  const [importSectionModal, setImportSectionModal] = useState(false);
  const [addSectionModal, setAddSectionModal] = useState(false);

  const [deleteModalForSection, setDeleteModalForSection] = useState(undefined);
  const [cloneModalForSection, setCloneModalForSection] = useState(undefined);

  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);

  // Queries
  const [getTemplate, getTemplateRes] = useLazyQuery(evaluationTemplateGet);

  // Mutations
  const [updateTemplate, updateTemplateRes] = useMutation(
    evaluationTemplateUpdate
  );

  // Data maps
  const template = getTemplateRes?.data?.evaluationTemplateGet || {};

  // Effects
  useEffect(() => {
    if (id) {
      getTemplate({ variables: { id } });
    }
  }, [id]);

  useEffect(() => {
    if (template) {
      // setEvaluationTemplateData(template);
      setDescription(template?.description);
      setName(template?.name);
    }
  }, [template]);

  // Other

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

  const handleInputChange = e => {
    // const { name, value } = e.target;
    // if (name === "name") {
    //   setName(value);
    // } else if (name === "sectionName") {
    //   setSectionName(value);
    // } else if (name === "sectiondescription") {
    //   setSectionDescription(value);
    // } else {
    //   setDescription(value);
    // }
  };

  const onSubmit = async data => {
    // const resp = await updateTemplate({
    //   variables: {
    //     id: template?.id,
    //     input: {
    //       name,
    //       description,
    //     },
    //   },
    // });
  };

  const updateTemplateFn = async () => {
    // const resp = await updateTemplate({
    //   variables: {
    //     id: template?.id,
    //     input: {
    //       name: name,
    //       description,
    //     },
    //   },
    // });
  };

  const saveSection = async () => {
    // setSaveLoader(true);
    // let createResponse = await createSection({
    //   variables: {
    //     templateId: template?.id,
    //     input: {
    //       name: sectionName,
    //     },
    //   },
    // });
    //
    // let savedLog = createResponse?.data?.evaluationTemplateSectionCreate;
    //
    // if (savedLog) {
    //   setSaveLoader(false);
    //   setAddSectionModal(false);
    //   let templateData = template;
    //   let sections = [...templateData.sections, savedLog];
    //   templateData = { ...templateData, sections };
    //   setEvaluationTemplateData(templateData);
    //   setCurrentSectionId(
    //     createResponse.data.evaluationTemplateSectionCreate.id
    //   );
    //
    //   // let path = `${evaluation_template_profile}/${id}/${savedLog.id}`;
    //   // props.history.push(path);
    //
    // }
  };

  if (!getTemplateRes?.data && getTemplateRes.loading) {
    return <GhostLoader />;
  }

  return (
    <>
      <div className={`add-section-conatiner ccard`}>
        {/* HEADER */}
        <div className="row">
          <div className={`col-sm-8 text-container`}>
            <form className="templateform">
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <i
                    className="fa fa-chevron-left"
                    onClick={() => hist.goBack()}
                    style={{
                      color: "#53cab2",
                      transform: "scale(1.4)",
                      cursor: "pointer",
                    }}
                  ></i>
                </div>

                <TextBox
                  name="name"
                  defaultValue={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Template Name"
                  onBlur={e => {
                    updateTemplate({
                      variables: {
                        id: template?.id,
                        input: {
                          name: e.target.value,
                        },
                      },
                    });
                  }}
                />
              </div>
              <textarea
                name="description"
                onChange={e => setDescription(e.target.value)}
                value={description}
                rows="4"
                cols="50"
                placeholder="Template Description"
                onBlur={e => {
                  updateTemplate({
                    variables: {
                      id: template?.id,
                      input: {
                        description: e.target.value,
                      },
                    },
                  });
                }}
              />
            </form>
          </div>

          <div className="col-sm-4">
            <div className="row">
              <div className="col-sm-12 col-xs-6">
                <ButtonWithIcon
                  iconName="add"
                  className="add-new-section-btn"
                  text="ADD NEW SECTION"
                  iconPosition={ICONPOSITION.START}
                  onClick={() => {
                    onSubmit();
                    setAddSectionModal(true);
                  }}
                />
              </div>
              <div className="col-sm-12 col-xs-6">
                <ButtonWithIcon
                  className="import-section-btn"
                  text="Import section"
                  onClick={() => setImportSectionModal(true)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="evaluation-templates-container__data-container">
          {template?.sections?.map(section => {
            return (
              <div
                className="row evaluation-templates-container__data-container__data"
                key={`row-id-${section.id}`}
              >
                <div
                  className="col-sm-4 col-xs-10 template-name"
                  onClick={() => {
                    let path = `${evaluation_template_page}/${id}/section/${section.id}`;
                    history.push(path);
                  }}
                >
                  {section.name}
                </div>
                <div className="col-sm-3 col-xs-10 sections">
                  {section?.questions?.length || 0} questions
                </div>
                <div className="col-sm-3 group-name">3 Points</div>
                <div className="col-sm-2 col-xs-2 browse">
                  <span
                    class="material-icons"
                    onClick={() => {
                      setViewDropdown(
                        viewDropdown === section.id ? null : section.id
                      );
                    }}
                  >
                    more_horiz
                  </span>
                  {viewDropdown === section.id && (
                    <TemplatePopup
                      reference={popup}
                      section={section}
                      setCloneModalForSection={setCloneModalForSection}
                      setDeleteModalForSection={setDeleteModalForSection}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {importSectionModal && (
        <ImportSectionModal
          history={history}
          templateId={template.id}
          close={() => setImportSectionModal(false)}
        />
      )}

      {addSectionModal && (
        <AddSectionModal
          history={history}
          templateId={template.id}
          close={() => setAddSectionModal(false)}
        />
      )}

      {deleteModalForSection && (
        <DeleteSectionModal
          section={deleteModalForSection}
          templateId={template.id}
          history={history}
          close={() => setDeleteModalForSection(undefined)}
        />
      )}

      {cloneModalForSection && (
        <CloneSectionModal
          templateId={template.id}
          section={cloneModalForSection}
          history={history}
          close={() => setCloneModalForSection(undefined)}
        />
      )}
    </>
  );
};
