import React, { useState, useEffect } from "react";
import "../SectionPage.scss";
import TextBox from "../../ui-kits/text-box";
import ButtonWithIcon from "../../ui-kits/button-with-icon";
import { useMutation, useLazyQuery } from "@apollo/client";
import { omit } from "lodash";
import QuestionCard from "./QuestionCard";

import { evaluationTemplateSectionGet } from "private/Apollo/Queries";
import { evaluationTemplateSectionUpdate } from "private/Apollo/Mutations";
import { GhostLoader } from "Components/elements";
import { evaluation_template_page } from "../../../../../../definitions";
import { useHistory } from "react-router-dom";

// Helpers
const getId = () => Math.round(Math.random() * 10000).toString();

export const EvaluationTemplateSectionPage = ({ match, history }) => {
  const hist = useHistory();

  // URL Stuff
  const templateId = match?.params?.id;
  const sectionId = match?.params?.sectionId;

  // CONSTANTS
  const getDefaultQuestion = () => {
    let newId = `tmp//${getId()}`;
    return {
      id: newId,
      name: "",
      description: "",
      inputType: "RADIO",
      options: [
        {
          questionId: newId,
          sid: `tmp//${getId()}`,
          val: "",
          score: 0,
        },
      ],
    };
  };
  const defaultQuestion = getDefaultQuestion();
  const defaultOption = defaultQuestion.options[0];

  // States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([defaultQuestion]);
  const [options, setOptions] = useState([defaultOption]);

  // Queries
  const [getSection, { data, loading }] = useLazyQuery(
    evaluationTemplateSectionGet
  );

  // Mutations
  const [updateSectionMutation, updateSectionMutationRes] = useMutation(
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
    if (!section) return;

    // Set name and description after getting response from server
    setName(section.name || "");
    setDescription(section.description || "");

    // Set questions
    section?.questions && setQuestions(section.questions || []);
  }, [section]);

  const updateSection = async () => {
    let updatedQuestions = questions?.map(question => {
      // Get if it's a temporary question or not
      const questionTmpId = question.id.substring(0, 3) === "tmp";

      // Default omit typename
      let omitForQuestion = ["__typename"];

      // If it's temporary, get rid of temp id
      if (questionTmpId) {
        omitForQuestion.push("id");
      }

      // Define new options
      let updatedOptions = question?.options?.map(option => {
        // Get if option is temporary
        const optionTmpId = option?.sid?.substring(0, 3) === "tmp";

        // Default omit typename
        let omitForOption = ["__typename"];

        // If it's temporary, get rid of temp id
        if (optionTmpId) {
          omitForOption.push("sid");
          omitForOption.push("questionId");
        }

        return omit(option, omitForOption);
      });

      // Define new question
      let updatedQuestion = {
        ...omit(question, omitForQuestion),
        options: updatedOptions,
      };

      return updatedQuestion;
    });
    let updatedSection = {
      ...omit(section, ["id", "__typename"]),
      name,
      description,
      questions: updatedQuestions,
    };

    try {
      let variables = {
        id: sectionId,
        input: updatedSection,
      };
      await updateSectionMutation({ variables });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  if (!data && loading) {
    return <GhostLoader />;
  }

  return (
    <>
   
      <div className={`add-section-conatiner `}>
        {/* HEADER: NAME AND DESCRIPTION */}
        <div className="row">
          <div className={`col-sm-8 text-container`}>
            <form className="sectionform">
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    marginRight: 10,
                    marginTop: 36,
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
                <div>
                  <TextBox
                    name="sectionName"
                    defaultValue={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Section Name"
                  />
                  <textarea
                    name="sectionDescription"
                    onChange={e => setDescription(e.target.value)}
                    value={description}
                    rows="4"
                    cols="50"
                    placeholder="Section Description"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="evaluation-templates-container__data-container">
          {questions?.map(question => {
            return (
              <QuestionCard
                key={question.id}
                section={section}
                questions={questions}
                question={question}
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
              onClick={() => {
                history.push(`${evaluation_template_page}/${templateId}`);
              }}
            />
            <ButtonWithIcon
              className="save-btn"
              text={
                updateSectionMutationRes.loading ? "...saving" : "Save Changes"
              }
              onClick={updateSection}
            />
          </div>

          <div className="btn-container">
            {updateSectionMutationRes.data &&
              !updateSectionMutationRes.loading && (
                <div className="success-message">Successfully saved</div>
              )}
          </div>
        </div>
      </div>
      
    </>
  );
};
