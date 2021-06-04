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

import { useQuery, useMutation, useLazyQuery } from "@apollo/client";

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

export const SectionPage = props => {
  const { match } = props;
  const {
    params: { id, sectionId },
  } = match;

  // Queries
  const [getSection, { data, loading }] = useLazyQuery(
    evaluationTemplateSectionGet
  );

  useEffect(() => {
    if (sectionId) {
      getSection({ variables: { id: sectionId } });
    }
  }, [sectionId]);

  // Sections
  const section = data?.evaluationTemplateSectionGet || {};

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

  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!section) {
      setQuestions(questionFormat);
      setOptions(optionFormat);
      return;
    }

    setQuestions(section?.questions || [questionFormat]);
    setOptions(
      section?.questons?.map(q =>
        q?.options?.map(o => ({ ...o, questionId: q.id }))
      ) || [optionFormat]
    );
  }, [section]);

  console.log("questions", questions);

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

  // useEffect(() => {
  //   if (evaluationTemplateAPIResp) {
  //     setEvaluationTemplateData(evaluationTemplateAPIResp);
  //     setDescription(evaluationTemplateAPIResp?.description);
  //     setName(evaluationTemplateAPIResp?.name);
  //   }
  // }, [evaluationTemplateAPIResp]);

  const onSubmit = async data => {
    // const resp = await mutateEvaluationTemplateUpdate({
    //   variables: {
    //     id: evaluationTemplateData?.id,
    //     input: {
    //       name,
    //       description,
    //     },
    //   },
    // });
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

  if (loading) {
    return <GhostLoader />;
  }

  return (
    <>
      <div className={`add-section-conatiner ssss`}>
        <div className="row">
          <div className={`col-sm-8 text-container`}>
            <form className="sectionform">
              <TextBox
                name="sectionName"
                defaultValue={section?.name || ""}
                onChange={handleInputChange}
                placeholder="Section Name"
              />
              <textarea
                name="sectionDescription"
                onChange={e => setSectionDescription(e.target.value)}
                value={sectionDescription}
                rows="4"
                cols="50"
                placeholder="Section Description"
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
          {questions?.map((question, index) => {
            return (
              <div className="card" key={`question-id-${index}`}>
                <div className="row">
                  <div className="col-sm-12 text-center">
                    <span class="material-icons drag-indicator">
                      drag_indicator
                    </span>
                    <span
                      class="material-icons browse-card"
                      onClick={() => setDropDown(!dropDown)}
                    >
                      more_horiz
                    </span>
                    {dropDown && (
                      <div className="browse-card__drop-dwon">
                        <div
                          className="browse-card__drop-dwon__item"
                          onClick={() => null}
                        >
                          <span class="material-icons settings">
                            content_copy
                          </span>
                          <span className="text">DUPLICATE</span>
                        </div>
                        <div
                          className="browse-card__drop-dwon__item leave"
                          onClick={() => null}
                        >
                          <span class="material-icons leave">delete</span>
                          <span className="delete-text">DELETE</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="action-container">
                    <span class="material-icons copy">content_copy</span>
                    <i
                      class="fa fa-trash-o delete"
                      onClick={() => setNoOfQuestions(noOfQuestions - 1)}
                      aria-hidden="true"
                    />
                    <span class="material-icons north">north</span>
                    <span class="material-icons south">south</span>
                  </div>
                </div>
                <div className="question-container row">
                  <div className="col-sm-12">
                    <TextBox
                      placeholder="Question"
                      value={question.name}
                      onChange={e =>
                        setQuestions(
                          questions.map(q =>
                            q.id === question.id
                              ? { ...q, name: e.target.value }
                              : q
                          )
                        )
                      }
                    />
                  </div>
                  <div className="col-sm-12">
                    <TextBox
                      placeholder="Tagline"
                      value={question.description}
                      onChange={e =>
                        setQuestions(
                          questions.map(q =>
                            q.id === question.id
                              ? { ...q, description: e.target.value }
                              : q
                          )
                        )
                      }
                    />
                  </div>
                  <div className="col-sm-12 question-container__tabs">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      scrollButtons="on"
                      variant="scrollable"
                    >
                      <Tab label="SINGLE ANSWER" {...a11yProps(0)} />
                      <Tab label="multiple choice" {...a11yProps(1)} />
                      <Tab label="traffic lights" {...a11yProps(2)} />
                      <Tab label="free text" {...a11yProps(3)} />
                      <Tab label="text lines" {...a11yProps(4)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                      <SingleAndMultiPleAnswer
                        options={options}
                        questionId={question.id}
                        setOptions={setOptions}
                      />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <MultiPleAnswer />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <TrafficLights />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                      <FreeText />
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                      <TextLines />
                    </TabPanel>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="row">
            <div className="col-sm-4">
              <ButtonWithIcon
                className="new-question-btn"
                text="New Question"
                onClick={() =>
                  setQuestions([
                    ...questions,
                    {
                      id: Math.round(Math.random() * 10000).toString(),
                      name: "",
                      description: "",
                      options: [{ val: "", score: 0 }],
                      inputType: "RADIO",
                    },
                  ])
                }
              />
            </div>
          </div>
          <div className="btn-container">
            <ButtonWithIcon
              className="cancel-btn"
              text="Cancel"
              onClick={() => null}
            />
            <ButtonWithIcon
              className="save-btn"
              text="Save Changes"
              onClick={() => {
                // setQuestionOption(false);
                // setSectionDetails(true);
                updateSection();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
