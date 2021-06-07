import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { evaluationTemplatesGet } from "../../../../../../Apollo/Queries";
import { Loader } from "../../../../../../../Components/elements";
import DropDown from "../../../ui-kits/drop-down";
import InputCheckBox from "../../../ui-kits/check-box";
import { evaluationTemplateSectionCreate } from "private/Apollo/Mutations";
import { evaluation_template_page } from "definitions";
import { Modal } from "../../../../../../../Components/UI_Kits";
import "./ImportSectionModal.scss";

export default function ImportSectionModal({ history, templateId, close }) {
  // States
  const [checkAll, setCheckAll] = useState(true);
  const [checked, setChecked] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(undefined);
  const [selectedSection, setSelectedSection] = useState(undefined);

  // Queries
  const { data, loading, error } = useQuery(evaluationTemplatesGet);

  // Mutations
  const [createSection, createSectionRes] = useMutation(
    evaluationTemplateSectionCreate
  );

  // Data maps
  let templates = data?.accountGet?.evaluationTemplates || [];

  // Other
  function clearAll() {
    setCheckAll(true);
    setChecked({});
    setSelectedTemplate(undefined);
    setSelectedSection(undefined);
  }

  return (
    <Modal
      title="Import section"
      innerClassName="max-width"
      loading={createSectionRes.loading}
      submit={async () => {
        let variables = {
          templateId,
          input: {
            name: `${selectedSection.name} - IMPORT`,
          },
        };

        // Add description
        if (selectedSection.description) {
          variables.input.description = selectedSection.description;
        }

        // Find out what questions to add
        let newQuestions = selectedSection.questions.filter(q =>
          checkAll ? true : !!checked[q.id]
        );

        // Map questions
        variables.input.questions = newQuestions.map(q => ({
          name: q.name,
          description: q.description,
          inputType: q.inputType,
          options: q.options.map(({ index, score, val }) => ({
            index,
            score,
            val,
          })),
        }));

        // Save
        let res;
        try {
          res = await createSection({ variables });
        } catch (error) {
          return console.log("error", error);
        }

        let id = res?.evaluationTemplateSectionCreate?.id;

        history.push(`${evaluation_template_page}/${templateId}/section/${id}`);

        clearAll();
        close();
      }}
      close={() => {
        clearAll();
        close();
      }}
      submitTxt="IMPORT"
      closeTxt="Cancel"
      children={
        <div className="import-section-container">
          <div className="row">
            {!data && loading && <Loader />}

            <div className="col-sm-4 col-xs-12">
              <div className="drop-down-heading">Evaluation template</div>
              <DropDown
                title=""
                items={templates}
                setSelectedItem={item => {
                  setChecked({});
                  setCheckAll(true);
                  setSelectedSection(undefined);
                  setSelectedTemplate(item);
                }}
              />
            </div>

            {selectedTemplate && (
              <div className="col-sm-2 col-xs-12">
                <div className="drop-down-heading">Sections</div>
                <div className="desktop_sections">
                  <DropDown
                    title=""
                    items={selectedTemplate?.sections}
                    setSelectedItem={item => {
                      setChecked({});
                      setCheckAll(true);
                      setSelectedSection(item);
                    }}
                  />
                </div>
              </div>
            )}

            {selectedSection && (
              <div className="col-sm-6 col-xs-12">
                <div className="drop-down-heading">Questions</div>
                <div className="question-container">
                  <InputCheckBox
                    checked={checkAll}
                    onChange={() => {
                      setChecked({});
                      setCheckAll(!checkAll);
                    }}
                  />
                  <span className="question-container__question">
                    <div className="question-container__question__select-all">
                      Select All
                    </div>
                  </span>
                </div>

                {selectedSection.questions.map(question => (
                  <div className="question-container" id={question.id}>
                    <InputCheckBox
                      checked={checkAll || !!checked[question.id]}
                      onChange={() => {
                        setCheckAll(false);
                        setChecked({
                          ...checked,
                          [question.id]: !checked[question.id],
                        });
                      }}
                    />
                    <span className="question-container__question">
                      <div className="question-container__question__text">
                        {question.name}
                      </div>
                      <div className="question-container__question__type">
                        {question.inputType}{" "}
                        {question.options?.length &&
                          `: ${question.options.length} options`}
                      </div>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
