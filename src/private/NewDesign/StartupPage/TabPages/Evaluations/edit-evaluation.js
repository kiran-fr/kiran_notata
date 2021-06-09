import React, { useEffect, useState, useMemo } from "react";
import Scrollspy from "react-scrollspy";
import "./edit-evaluation.scss";
import { useMutation } from "@apollo/client";
import { evaluationUpdate, evaluationCreate } from "private/Apollo/Mutations";
import { GeneralInput } from "../../Inputs/GeneralInput";
import CommentInput from "../../FormInputs/CommentInput";
import { Loader } from "Components/UI_Kits";
export default function EditEvaluation({
  setEditEvaluation,
  setSaveEvaluation,
  updateEvaluation,
  selectedTemplateToEvaluate,
  setAllAnswers,
  connectionId,
  evaluation,
  savedAnswers,
  companyName,
  setActiveEvaluation,
  props,
  setEvaluateModal,
}) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAllAnswers(answers);
  }, [answers]);

  useEffect(() => {
    if (savedAnswers) {
      setAnswers(savedAnswers);
    }
  }, [savedAnswers]);

  // Mutations
  const [mutateEvaluationUpdate] = useMutation(evaluationUpdate);
  const [mutateEvaluationCreate] = useMutation(evaluationCreate);

  let sectionNamesArr = selectedTemplateToEvaluate?.sections?.map(section => {
    return {
      name: section.name,
      id: section.id,
    };
  });

  let details = {};
  let sec = selectedTemplateToEvaluate?.sections?.map(item => {
    details[item.id] = "collapse";
  });
  const [collapseDetailList, setCollapseDetailList] = useState(details);

  const save = async () => {
    try {
      setLoading(true);
      if (evaluation?.id) {
        let updateVariables = {
          id: evaluation?.id,
          answers,
        };

        let update = await mutateEvaluationUpdate({
          variables: updateVariables,
        });
        console.log("updated", update?.data?.evaluationUpdate);
      } else {
        let variables = {
          connectionId: connectionId,
          templateId: selectedTemplateToEvaluate.id,
          answers,
        };

        let ansCreate = await mutateEvaluationCreate({ variables });

        let evaluationCreateResp = ansCreate?.data?.evaluationCreate;
        console.log("evaluationCreateResp", evaluationCreateResp);
        setActiveEvaluation(evaluationCreateResp);
      }

      setLoading(false);
      setSaveEvaluation(true);
    } catch (error) {
      setLoading(false);
      console.log("ERROR CREATING STARTUP", error);
    }
  };

  if (loading) {
    return <Loader size="medium" />;
  }

  //comment
  // const comments = answers.filter(
  //   ({ inputType, questionId: id }) =>
  //     inputType === "COMMENT" && id === questionId
  // );

  const handleBack = () => {
    setEvaluateModal(true);
    setEditEvaluation(false);
  };

  return (
    <div className="row edit-evaluation-container">
      <div className="col-sm-12">
        <span class="material-icons back-icon" onClick={() => handleBack()}>
          arrow_back_ios
        </span>
        <span className="page-heading">{companyName}</span>
      </div>
      <div className="col-sm-3 col-md-3">
        <div className="menu-container-1">
          <Scrollspy items={sectionNamesArr} currentClassName="is-current">
            {sectionNamesArr.map(link => (
              <li key={link.id}>
                <a
                  href={`#${link.name}`}
                  onClick={() => {
                    let collapseList = { ...collapseDetailList };
                    collapseList[link.id] = "";
                    setCollapseDetailList(collapseList);
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </Scrollspy>
        </div>
      </div>
      <div className="col-sm-1 col-md-1"></div>
      <div className="col-sm-8 col-md-8 edit-details">
        {selectedTemplateToEvaluate?.sections?.map(section => (
          <div className="row" id={section.name}>
            <div className="col-sm-12 heading">
              <i
                class={`fa ${
                  collapseDetailList[section?.id] === ""
                    ? "fa-chevron-up"
                    : "fa-chevron-down"
                }`}
                aria-hidden="true"
                onClick={() => {
                  let collapseList = { ...collapseDetailList };
                  collapseList[section.id] =
                    collapseList[section.id] === "" ? "collapse" : "";
                  setCollapseDetailList(collapseList);
                }}
              />
              {section.name}
            </div>
            <div className={`${collapseDetailList[section?.id]}`}>
              {section?.questions.map(question => (
                <>
                  <div className="row">
                    <div className="col-sm-12 question">{question.name}</div>
                    <div className="options">
                      <GeneralInput
                        question={question}
                        section={section}
                        answers={answers}
                        setAnswers={setAnswers}
                      />
                      <div className="row">
                        <div className="col-sm-12 col-xs-12 add-comment">
                          Add comment
                          {/* <input type="text" className="add-comment-txt" /> */}
                          <div className="textbox">
                            <textarea placeholder="Write your comment..." />
                          </div>
                        </div>
                      </div>
                      <CommentInput {...props} />
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        ))}
        <div className="col-sm-12 text-right">
          <button className="save-btn delete" onClick={save}>
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
}
