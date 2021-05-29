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
import { evaluationTemplateGet } from "private/Apollo/Queries";
import {
  evaluationTemplateUpdate,
  evaluationTemplateSectionCreate,
} from "private/Apollo/Mutations";
import { GhostLoader } from "Components/elements";
import { evaluation_template_profile } from "../../../../../../definitions";

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
  /* console.log(evaluationTemplateGetData?.evaluationTemplateGet.sections.name);
  console.log(evaluationTemplateGetData?.evaluationTemplateGet.sections[0].id); */
  const evaluationTemplateAPIResp =
    evaluationTemplateGetData?.evaluationTemplateGet;

  const [mutateEvaluationTemplateUpdate] = useMutation(
    evaluationTemplateUpdate
  );
  const [mutateEvaluationTemplateSectionCreate] = useMutation(
    evaluationTemplateSectionCreate
  );
  // const [tabValue, setTabValue] = React.useState(0);
  // const handleChange = (event, newValue) => {
  //   setTabValue(newValue);
  // };

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
  const [sectionName, setSectionName] = useState(null);
  const [saveLoader, setSaveLoader] = useState(false);
  const [evaluationTemplateData, setEvaluationTemplateData] = useState(null);
  const [questionOption, setQuestionOption] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
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
          name: data.variables?.input?.name,
          description,
        },
      },
    });
  };

  const upateTemplate = async () => {
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
    console.log("sectionName", sectionName);
    let savedLog = createResponse?.data?.evaluationTemplateSectionCreate;
    console.log(savedLog);

    if (savedLog) {
      setSaveLoader(false);
      setAddSectionModal(false);
      let templateData = evaluationTemplateData;
      let sections = [...templateData.sections, savedLog];
      templateData = { ...templateData, sections };
      setEvaluationTemplateData(templateData);
      // setSectionDetails(true);
    }
  };

  // console.log("evaluationTemplateAPIResp", evaluationTemplateGetData);
  if (!evaluationTemplateAPIResp) {
    return <GhostLoader />;
  }
  return (
    <>
      <div className={`add-section-conatiner`}>
        <div className="row">
          <div className={`col-sm-8 text-container`}>
            <form>
              <TextBox
                name="name"
                defaultValue={name}
                onChange={handleInputChange}
                onBlur={upateTemplate}
              />
              <textarea
                name="description"
                onChange={handleInputChange}
                value={description}
                rows="4"
                cols="50"
                onBlur={upateTemplate}
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
            {[...Array(noOfQuestions)].map((elementInArray, index) => {
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
                      ></i>
                      <span class="material-icons north">north</span>
                      <span class="material-icons south">south</span>
                    </div>
                  </div>
                  <div className="question-container row">
                    <div className="col-sm-12">
                      <TextBox placeholder="Question"></TextBox>
                    </div>
                    <div className="col-sm-12">
                      <TextBox placeholder="Tagline"></TextBox>
                    </div>
                    <div className="col-sm-12 question-container__tabs">
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        scrollButtons="on"
                        variant="scrollable"
                      >
                        <Tab label="SINGLE ANSWER" {...a11yProps(0)} />
                        <Tab label="multiply choice" {...a11yProps(1)} />
                        <Tab label="traffic lights" {...a11yProps(2)} />
                        <Tab label="free text" {...a11yProps(3)} />
                        <Tab label="text lines" {...a11yProps(4)} />
                      </Tabs>
                      <TabPanel value={value} index={0}>
                        <SingleAndMultiPleAnswer></SingleAndMultiPleAnswer>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <MultiPleAnswer></MultiPleAnswer>
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <TrafficLights></TrafficLights>
                      </TabPanel>
                      <TabPanel value={value} index={3}>
                        <FreeText></FreeText>
                      </TabPanel>
                      <TabPanel value={value} index={4}>
                        <TextLines></TextLines>
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
              <ButtonWithIcon
                className="save-btn"
                text="Save Changes"
                onClick={() => {
                  setQuestionOption(false);
                  setSectionDetails(true);
                }}
              ></ButtonWithIcon>
            </div>
          </>
        )}

        {sectionDetails && (
          <div className="evaluation-templates-container__data-container">
            {evaluationTemplateData?.sections.map((section, index) => {
              const { name, description } = section;
              console.log("section", section.name);
              return (
                <div
                  className="row evaluation-templates-container__data-container__data"
                  key={`row-id-${index}`}
                >
                  <div
                    className="col-sm-4 col-xs-10 template-name"
                    onClick={() =>
                      props.history.push(
                        `${evaluation_template_profile}/${id}/${section.id}`
                      )
                    }
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
        )}  */}
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
      {addSectionModal && (
        <Modal
          title="New Section"
          submit={() => {
            saveSection();
            setAddSectionModal(false);
            setQuestionOption(true);
            setSectionDetails(false);
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
      )}
    </>
  );
};
