import React, { useState, useEffect } from "react";
import "./add-new-section.scss";
import TextBox from "../../ui-kits/text-box";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { ICONPOSITION } from "../../constants";

import { Modal } from "../../../../../../Components/UI_Kits/Modal/Modal";
import ImportSection from "./import-section-modal";
import { useQuery, useMutation } from "@apollo/client";
import { evaluationTemplateSectionGet } from "private/Apollo/Queries";
import { evaluationTemplateSectionUpdate } from "private/Apollo/Mutations";
import { GhostLoader } from "Components/elements";
import { useForm } from "react-hook-form";

import Question from "../../../../../pages/Templates/EvaluationTemplateSection/QuestionComp";

export const TemplateSection = props => {
  const {
    match: {
      params: { id, sectionId },
    },
  } = props;
  // Form
  console.log("props", props);
  const { register, handleSubmit, formState, errors, setValue } = useForm();
  const { data: evaluationTemplateSectionGetData, loading, error } = useQuery(
    evaluationTemplateSectionGet,
    {
      variables: {
        id: sectionId,
      },
    }
  );

  console.log("SECTION DATA", evaluationTemplateSectionGetData);

  const evaluationTemplateSectionAPIResp =
    evaluationTemplateSectionGetData?.evaluationTemplateSectionGet;

  const [mutateEvaluationTemplateSectionUpdate] = useMutation(
    evaluationTemplateSectionUpdate
  );

  const [importSectionModal, setImportSectionModal] = useState(false);
  const [questionOption, setQuestionOption] = useState(true);
  const [sectionDetails, setSectionDetails] = useState(true);
  const [addSectionModal, setAddSectionModal] = useState(false);

  const [noOfQuestions, setNoOfQuestions] = useState(1);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [saveLoader, setSaveLoader] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else {
      setDescription(value);
    }
  };
  useEffect(() => {
    if (evaluationTemplateSectionAPIResp) {
      setDescription(evaluationTemplateSectionAPIResp?.description);
      setName(evaluationTemplateSectionAPIResp?.name);
    }
    console.log("EVALUATION DATA: ", evaluationTemplateSectionAPIResp);
  }, [evaluationTemplateSectionAPIResp]);

  const save = async () => {
    setSaveLoader(true);
    const resp = await mutateEvaluationTemplateSectionUpdate({
      variables: {
        id: sectionId,
        input: {
          name,
          description,
        },
      },
    });
    if (resp?.data?.evaluationTemplateSectionUpdate) {
      props.history.goBack();
    }
  };

  if (!evaluationTemplateSectionGetData) {
    return <GhostLoader />;
  }

  return (
    <>
      <div
        className={`add-section-conatiner ${
          questionOption ? "question-option-show" : ""
        }`}
      >
        <div className="row">
          <div
            className={`${
              questionOption ? "col-sm-12" : "col-sm-8"
            } text-container`}
          >
            <form>
              <TextBox
                name="name"
                defaultValue={name}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                onChange={handleInputChange}
                value={description}
                rows="4"
                cols="50"
              ></textarea>
            </form>
          </div>
          {!questionOption && (
            <div className="col-sm-4">
              <div className="row">
                <div className="col-sm-12 col-xs-6">
                  <ButtonWithIcon
                    iconName="add"
                    className="add-new-section-btn"
                    text="ADD NEW SECTION"
                    iconPosition={ICONPOSITION.START}
                    onClick={() => setAddSectionModal(true)}
                  ></ButtonWithIcon>
                </div>
                <div className="col-sm-12 col-xs-6">
                  <ButtonWithIcon
                    className="import-section-btn"
                    text="Import section"
                    onClick={() => null}
                    onClick={() => setImportSectionModal(true)}
                  ></ButtonWithIcon>
                </div>
              </div>
            </div>
          )}
        </div>
        {questionOption && (
          <>
            <Question templateId={id} sectionId={sectionId} question={[]} />
            <div className="row">
              <div className="col-sm-4">
                <ButtonWithIcon
                  className="new-question-btn"
                  text="New Question"
                  onClick={() => setNoOfQuestions(noOfQuestions + 1)}
                ></ButtonWithIcon>
              </div>
            </div>
            <div className="btn-container">
              <ButtonWithIcon
                className="cancel-btn"
                text="Cancel"
                onClick={() => null}
              ></ButtonWithIcon>
              {saveLoader ? (
                <i className={"fa fa-spinner fa-spin"} />
              ) : (
                <ButtonWithIcon
                  className="save-btn"
                  text="Save Changes"
                  onClick={() => {
                    setQuestionOption(true);
                    setSectionDetails(true);
                    save();
                  }}
                ></ButtonWithIcon>
              )}
            </div>
          </>
        )}
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
          children={<ImportSection></ImportSection>}
        ></Modal>
      )}
    </>
  );
};
