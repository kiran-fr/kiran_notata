import React, { useState, useEffect } from "react";
import "./add-new-section.scss";
import TextBox from "../../ui-kits/text-box";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { ICONPOSITION } from "../../constants";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SingleAndMultiPleAnswer from "./single-answer";
import MultiPleAnswer from "./Multiple-answers";
import TrafficLights from "./traffic-lights";
import FreeText from "./free-text";
import TextLines from "./text-lines";
import { Modal } from "../../../../../../Components/UI_Kits/Modal/Modal";
import ImportSection from "./import-section-modal";
import { useQuery, useMutation } from "@apollo/client";
import { evaluationTemplateSectionGet } from "private/Apollo/Queries";
import {
  evaluationTemplateSectionCreate,
  evaluationTemplateSectionUpdate,
} from "private/Apollo/Mutations";
import { GhostLoader } from "Components/elements";
import { useForm } from "react-hook-form";
import { InputForm } from "Components/UI_Kits/InputForm/InputForm";
// import {Questions} from './question-comp';
// import {NewQuestion} from "./new-question";
import { evaluation_template_profile } from "../../../../../../definitions";
import Question from "../../../../../pages/Templates/EvaluationTemplateSection/QuestionComp";
import EvaluationTemplateSection from "../../../../../pages/Templates/EvaluationTemplateSection/index";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

// export default function AddSection() {
export const TemplateSection = props => {
  const {
    match: {
      params: { id, sectionId },
    },
  } = props;
  // Form
  console.log("props", props);
  const { register, handleSubmit, formState, errors, setValue } = useForm();
  const { isSubmitting } = formState;

  const { data: evaluationTemplateSectionGetData, loading, error } = useQuery(
    evaluationTemplateSectionGet,
    {
      variables: {
        id: sectionId,
      },
    }
  );
  console.log(
    "evaluationTemplateSectionGetData",
    evaluationTemplateSectionGetData
  );
  const evaluationTemplateSectionAPIResp =
    evaluationTemplateSectionGetData?.evaluationTemplateSectionGet;

  const [mutateEvaluationTemplateSectionUpdate] = useMutation(
    evaluationTemplateSectionUpdate
  );

  const [tabValue, setTabValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const [dropDown, setDropDown] = useState(false);
  const [importSectionModal, setImportSectionModal] = useState(false);
  const [questionOption, setQuestionOption] = useState(true);
  const [sectionDetails, setSectionDetails] = useState(true);
  const [addSectionModal, setAddSectionModal] = useState(false);
  const noOfRows = 4;
  const [browseDropDownStates, setBrowseDropDownStates] = useState(
    new Array(noOfRows).fill(false)
  );
  const [noOfQuestions, setNoOfQuestions] = useState(1);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  // const [sectionName, setSectionName] = useState(null);
  const [saveLoader, setSaveLoader] = useState(false);
  const [evaluationTemplateData, setEvaluationTemplateData] = useState(null);

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

  // const saveSection = async () => {
  //   setSaveLoader(true);
  //   let createResponse = await mutateEvaluationTemplateSectionCreate({
  //     variables: {
  //       templateId: evaluationTemplateData?.id,
  //       input: {
  //         name: sectionName,
  //       },
  //     },
  //   });
  //   let savedLog = createResponse?.data?.evaluationTemplateSectionCreate;
  //   console.log(savedLog);
  //   if (savedLog) {
  //     setSaveLoader(false);
  //     setAddSectionModal(false);
  //     setQuestionOption(true);
  //     let templateData = evaluationTemplateData;
  //     let sections = [...templateData.sections, savedLog];
  //     templateData = { ...templateData, sections };
  //     setEvaluationTemplateData(templateData);
  //     // setSectionDetails(true);
  //   }
  // };

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
            {/* <Questions setDropDown={setDropDown}  
            setNoOfQuestions={setNoOfQuestions}
            dropDown={dropDown}
            noOfQuestions={noOfQuestions}
            tabValue={tabValue}
            handleChange={handleChange}
            a11yProps={a11yProps}
            /> */}

            <Question templateId={id} sectionId={sectionId} question={[]} />
            {/* <EvaluationTemplateSection match={props.match}/> */}

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

        {/* {sectionDetails && (
          <div className="evaluation-templates-container__data-container">
            {[...Array(noOfRows)].map((elementInArray, index) => {
              return (
                <div
                  className="row evaluation-templates-container__data-container__data"
                  key={`row-id-${index}`}
                >
                  <div className="col-sm-4 col-xs-10 template-name">
                    Problem
                  </div>
                  <div className="col-sm-3 col-xs-10 sections">6 sections</div>
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
        )} */}
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
      {/* {addSectionModal && (
        <Modal
          title="New Section"
          submit={() => {
            saveSection();
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
            ></TextBox>
          }
        ></Modal>
      )} */}
    </>
  );
};
