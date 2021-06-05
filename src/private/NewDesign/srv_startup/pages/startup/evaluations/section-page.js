import React, { useState, useEffect } from "react";
import "./add-new-section.scss";
import TextBox from "../../ui-kits/text-box";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SingleAndMultiPleAnswer from "./single-answer";
import MultiPleAnswer from "./Multiple-answers";
import TrafficLights from "./traffic-lights";
import FreeText from "./free-text";
import TextLines from "./text-lines";

import { useMutation, useLazyQuery } from "@apollo/client";

import { omit } from "lodash";

import { evaluationTemplateSectionGet } from "private/Apollo/Queries";
import { evaluationTemplateSectionUpdate } from "private/Apollo/Mutations";
import { GhostLoader } from "Components/elements";

// Helpers
const getId = () => Math.round(Math.random() * 10000).toString();

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

function QuestionCard({
  question,
  questions,
  setQuestions,
  options,
  setOptions,
}) {
  const [value, setValue] = React.useState(0);
  const [dropDown, setDropDown] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="card">
      {/*TOP PART*/}
      <div className="row">
        <div className="col-sm-12 text-center">
          <span className="material-icons drag-indicator">drag_indicator</span>
          <span
            className="material-icons browse-card"
            onClick={() => setDropDown(!dropDown)}
          >
            more_horiz
          </span>
        </div>
        <div className="action-container">
          <span className="material-icons copy">content_copy</span>
          <i className="fa fa-trash-o delete" aria-hidden="true" />
          <span className="material-icons north">north</span>
          <span className="material-icons south">south</span>
        </div>
      </div>
      {/*END TOP PART*/}

      <div className="question-container row">
        <div className="col-sm-12">
          <TextBox
            placeholder="Question"
            value={question.name}
            onChange={e =>
              setQuestions(
                questions.map(q =>
                  q.id === question.id ? { ...q, name: e.target.value } : q
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
}

export const SectionPage = props => {
  // CONSTANTS
  const getDefaultQuestion = () => {
    let newId = getId();
    return {
      id: newId,
      name: "",
      description: "",
      inputType: "RADIO",
      options: [
        {
          id: getId(),
          questionId: newId,
          val: "",
          score: 0,
        },
      ],
    };
  };

  const defaultQuestion = getDefaultQuestion();
  const defaultOption = defaultQuestion.options[0];

  // URL Stuff
  const { match } = props;
  const {
    params: { sectionId },
  } = match;

  // States
  const [sectionDescription, setSectionDescription] = useState(null);
  const [sectionName, setSectionName] = useState(null);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [questions, setQuestions] = useState([defaultQuestion]);
  const [options, setOptions] = useState([defaultOption]);

  // Queries
  const [getSection, { data, loading }] = useLazyQuery(
    evaluationTemplateSectionGet
  );

  // Mutations
  const [mutateEvaluationTemplateSectionUpdate] = useMutation(
    evaluationTemplateSectionUpdate
  );

  // Data maps
  const section = data?.evaluationTemplateSectionGet || {};

  // EFFECTS

  // Get section
  useEffect(() => {
    if (sectionId) {
      getSection({ variables: { id: sectionId } });
    }
  }, [sectionId]);

  // Set questions and options from server
  useEffect(() => {
    if (!section) {
      setQuestions([defaultQuestion]);
      setOptions([defaultOption]);
      return;
    }

    let questionsFromServer = section?.questions;
    if (questionsFromServer) {
      setQuestions(questionsFromServer);
    }

    let optionsFromServer = section?.questions
      ?.map(q => q?.options?.map(o => ({ ...o, questionId: q.id })))
      .flat();

    if (optionsFromServer?.length) {
      setOptions(optionsFromServer);
    }
  }, [section]);

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

  const updateSection = async () => {
    const tempQuestion = questions.map(question => {
      let currentOptions = options?.filter(
        ({ questionId }) => questionId === question.id
      );

      let finalOptions = currentOptions.map(mapped => {
        return omit(mapped, ["__typename"]);
      });

      return {
        ...omit(question, ["id", "_typename"]),
        options: finalOptions.map(o =>
          omit(o, ["id", "questionId", "__typename", "sid"])
        ),
      };
    });

    const finalQuestion = tempQuestion.map(q => omit(q, ["__typename"]));

    try {
      let updateResponse = await mutateEvaluationTemplateSectionUpdate({
        variables: {
          id: sectionId,
          input: {
            name: sectionName,
            description: sectionDescription,
            questions: finalQuestion,
          },
        },
      });
      console.log("Updated!");
      console.log(updateResponse);
    } catch (error) {
      console.log("Error: ", error);
    }

    // setQuestionOption(false);
    // setSectionDetails(true);
  };

  if (!data && loading) {
    return <GhostLoader />;
  }

  return (
    <>
      <div className={`add-section-conatiner ssss`}>
        {/* HEADER: NAME AND DESCRIPTION */}
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
        </div>

        <div className="evaluation-templates-container__data-container">
          {questions?.map((question, index) => {
            return (
              <QuestionCard
                key={question.id}
                question={question}
                options={options}
                setOptions={setOptions}
                setQuestions={setQuestions}
              />
            );
          })}

          <div className="row">
            <div className="col-sm-4">
              <ButtonWithIcon
                className="new-question-btn"
                text="New Question"
                onClick={() => {
                  let q = getDefaultQuestion();
                  setQuestions([...questions, q]);
                  setOptions([...options, ...q.options]);
                }}
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
              onClick={updateSection}
            />
          </div>
        </div>
      </div>
    </>
  );
};
