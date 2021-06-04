import React, { useState, useEffect } from "react";
import "./add-new-section.scss";
import TextBox from "../../ui-kits/text-box";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { ICONPOSITION } from "../../constants";
import { Modal } from "../../../../../../Components/UI_Kits/Modal/Modal";
import ImportSection from "./import-section-modal";

import { useQuery, useMutation } from "@apollo/client";

import {
  evaluationTemplateGet,
  evaluationTemplateSectionGet,
} from "private/Apollo/Queries";
import {
  evaluationTemplateUpdate,
  evaluationTemplateSectionCreate,
  evaluationTemplateSectionUpdate,
} from "private/Apollo/Mutations";
import { GhostLoader } from "Components/elements";
import { evaluation_template_profile } from "../../../../../../definitions";

// export default function AddSection() {
export const AddSection = props => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const { data: evaluationTemplateGetData, loading, error } = useQuery(
    evaluationTemplateGet,
    {
      variables: {
        id,
      },
    }
  );

  // Questions Reducer

  const evaluationTemplateAPIResp =
    evaluationTemplateGetData?.evaluationTemplateGet;

  const [mutateEvaluationTemplateUpdate] = useMutation(
    evaluationTemplateUpdate
  );
  const [
    mutateEvaluationTemplateSectionCreate,
    mutateEvaluationTemplateSectionCreateRes,
  ] = useMutation(evaluationTemplateSectionCreate);

  const [importSectionModal, setImportSectionModal] = useState(false);
  const [sectionDetails, setSectionDetails] = useState(true);
  const [addSectionModal, setAddSectionModal] = useState(false);
  const noOfRows = 4;
  const [browseDropDownStates, setBrowseDropDownStates] = useState(
    new Array(noOfRows).fill(false)
  );
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [sectionDescription, setSectionDescription] = useState(null);
  const [sectionName, setSectionName] = useState(null);
  const [saveLoader, setSaveLoader] = useState(false);
  const [evaluationTemplateData, setEvaluationTemplateData] = useState(null);
  const [questionOption, setQuestionOption] = useState(false);

  const [currentSectionId, setCurrentSectionId] = useState(null);

  const firstQID = Math.round(Math.random() * 10000).toString();

  const optionFormat = {
    id: Math.round(Math.random() * 100000).toString(),
    questionId: firstQID,
    val: "",
    score: 0,
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "sectionName") {
      setSectionName(value);
    } else if (name === "sectiondescription") {
      setSectionDescription(value);
    } else {
      setDescription(value);
    }
  };

  useEffect(() => {
    if (evaluationTemplateAPIResp) {
      setEvaluationTemplateData(evaluationTemplateAPIResp);
      setDescription(evaluationTemplateAPIResp?.description);
      setName(evaluationTemplateAPIResp?.name);
    }
  }, [evaluationTemplateAPIResp]);

  const onSubmit = async data => {
    const resp = await mutateEvaluationTemplateUpdate({
      variables: {
        id: evaluationTemplateData?.id,
        input: {
          name,
          description,
        },
      },
    });
  };

  const updateTemplate = async () => {
    const resp = await mutateEvaluationTemplateUpdate({
      variables: {
        id: evaluationTemplateData?.id,
        input: {
          name: name,
          description,
        },
      },
    });
  };

  const saveSection = async () => {
    setSaveLoader(true);
    let createResponse = await mutateEvaluationTemplateSectionCreate({
      variables: {
        templateId: evaluationTemplateData?.id,
        input: {
          name: sectionName,
        },
      },
    });

    let savedLog = createResponse?.data?.evaluationTemplateSectionCreate;

    if (savedLog) {
      setSaveLoader(false);
      setAddSectionModal(false);
      let templateData = evaluationTemplateData;
      let sections = [...templateData.sections, savedLog];
      templateData = { ...templateData, sections };
      setEvaluationTemplateData(templateData);
      setCurrentSectionId(
        createResponse.data.evaluationTemplateSectionCreate.id
      );

      let path = `${evaluation_template_profile}/${id}/${savedLog.id}`;
      props.history.push(path);
    }
  };

  if (!evaluationTemplateAPIResp) {
    return <GhostLoader />;
  }

  return (
    <>
      <div className={`add-section-conatiner ssss`}>
        <div className="row">
          <div className={`col-sm-8 text-container`}>
            <form className="templateform">
              <TextBox
                name="name"
                defaultValue={name}
                onChange={e => setDescription(e.target.value)}
                placeholder="Template Name"
                onBlur={updateTemplate}
              />
              <textarea
                name="description"
                onChange={e => setDescription(e.target.value)}
                value={description}
                rows="4"
                cols="50"
                placeholder="Template Description"
                onBlur={updateTemplate}
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
                  text="Import section 1"
                  onClick={() => setImportSectionModal(true)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="evaluation-templates-container__data-container">
          {evaluationTemplateData?.sections.map((section, index) => {
            return (
              <div
                className="row evaluation-templates-container__data-container__data"
                key={`row-id-${index}`}
              >
                <div
                  className="col-sm-4 col-xs-10 template-name"
                  onClick={() => {
                    let path = `${evaluation_template_profile}/${id}/${section.id}`;
                    props.history.push(path);
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
                      let states = new Array(noOfRows).fill(false);
                      states[index] = !browseDropDownStates[index];
                      setBrowseDropDownStates(states);
                    }}
                  >
                    more_horiz
                  </span>
                  {browseDropDownStates[index] && (
                    <div className="browse__drop-dwon">
                      <div
                        className="browse__drop-dwon__item"
                        onClick={() => null}
                      >
                        <span class="material-icons settings">edit</span>
                        <span className="text">EDIT</span>
                      </div>
                      <div
                        className="browse__drop-dwon__item"
                        onClick={() => null}
                      >
                        <span class="material-icons settings">
                          content_copy
                        </span>
                        <span className="text">COPY AND EDIT</span>
                      </div>
                      <div
                        className="browse__drop-dwon__item leave"
                        onClick={() => null}
                      >
                        <span class="material-icons leave">delete</span>
                        <span className="delete-text">DELETE GROUP</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {importSectionModal && (
        <Modal
          title="Import section"
          innerClassName="max-width"
          submit={() => {
            setImportSectionModal(false);
            setSectionDetails(false);
            setQuestionOption(true);
          }}
          close={() => {
            setImportSectionModal(false);
          }}
          submitTxt="IMPORT"
          closeTxt="Cancel"
          children={<ImportSection />}
        />
      )}

      {addSectionModal && (
        <Modal
          title="New Section"
          loading={mutateEvaluationTemplateSectionCreateRes.loading}
          submit={() => {
            saveSection();
            // setAddSectionModal(false);
            // setQuestionOption(true);
            // setSectionDetails(false);
          }}
          loading={saveLoader}
          close={() => {
            setAddSectionModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={
            <TextBox
              name="sectionName"
              value={sectionName}
              onChange={handleInputChange}
              placeholder="Evaluation Section Name"
            />
          }
        />
      )}
    </>
  );
};
