import React, { useState, useEffect, useReducer } from "react";
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

import { InputForm } from "Components/UI_Kits/InputForm/InputForm";

import { useQuery, useMutation } from "@apollo/client";

import { omit, filter } from "lodash";

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
import { useParams } from "react-router-dom";

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

  const [mutateEvaluationTemplateSectionUpdate] = useMutation(
    evaluationTemplateSectionUpdate
  );

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [dropDown, setDropDown] = useState(false);
  const [importSectionModal, setImportSectionModal] = useState(false);
  const [sectionDetails, setSectionDetails] = useState(true);
  const [addSectionModal, setAddSectionModal] = useState(false);
  const noOfRows = 4;
  const [browseDropDownStates, setBrowseDropDownStates] = useState(
    new Array(noOfRows).fill(false)
  );
  const [noOfQuestions, setNoOfQuestions] = useState(1);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [sectionDescription, setSectionDescription] = useState(null);
  const [sectionName, setSectionName] = useState(null);
  const [saveLoader, setSaveLoader] = useState(false);
  const [evaluationTemplateData, setEvaluationTemplateData] = useState(null);
  const [questionOption, setQuestionOption] = useState(false);

  const [currentSectionId, setCurrentSectionId] = useState(null);

  // // Question Format
  // const questionModel = {
  //   name: String,
  //   id
  //   description: String,
  //   options: []
  //   inputType
  // };

  const firstQID = Math.round(Math.random() * 10000).toString();

  const questionFormat = {
    id: firstQID,
    name: "",
    description: "",
    inputType: "RADIO",
    options: [],
  };

  const optionFormat = {
    id: Math.round(Math.random() * 100000).toString(),
    questionId: firstQID,
    val: "",
    score: 0,
  };

  const [questions, setQuestions] = useState([questionFormat]);
  const [options, setOptions] = useState([optionFormat]);

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

  // Debug
  useEffect(() => {
    console.log("OPTIONS: ", options);
  }, [options]);

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

  const updateSection = async () => {
    const tempQuestion = questions.map(question => {
      let currentOptions = options?.filter(
        ({ questionId }) => questionId === question.id
      );
      return {
        ...omit(question, "id"),
        options: currentOptions.map(o => omit(o, ["id", "questionId"])),
      };
    });
    console.log("Temp Question: ", tempQuestion);
    try {
      let updateResponse = await mutateEvaluationTemplateSectionUpdate({
        variables: {
          id: currentSectionId,
          input: {
            name: sectionName,
            description: sectionDescription,
            questions: tempQuestion,
          },
        },
      });
      console.log("Updated!");
      console.log(updateResponse);
    } catch (error) {
      console.log("Error: ", error);
    }
    // console.log("UPDATED SECTION: ", updateResponse);
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

            {/*<form className="sectionform">*/}
            {/*  <TextBox*/}
            {/*    name="sectionName"*/}
            {/*    defaultValue={sectionName}*/}
            {/*    onChange={handleInputChange}*/}
            {/*    placeholder="Section Name"*/}
            {/*  />*/}
            {/*  <textarea*/}
            {/*    name="sectionDescription"*/}
            {/*    onChange={e => setSectionDescription(e.target.value)}*/}
            {/*    value={sectionDescription}*/}
            {/*    rows="4"*/}
            {/*    cols="50"*/}
            {/*    placeholder="Section Description"*/}
            {/*  />*/}
            {/*</form>*/}
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
                  {section.name} TEST
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
