import React from "react";
// import { MultipleChoiceInput } from "Components/Forms/FormInputs";
import { MultipleChoiceInput } from "../FormInputs";

export default function MultipleChoiceInputContainer({
  section,
  question,
  answers,
  setAnswers,
}) {
  // Get answer from array of answers
  // ————————————————————————————————
  function getAnswer({ sid }) {
    return answers.find(
      a =>
        a.questionId === question.id &&
        a.inputType === question.inputType &&
        a.sid === sid
    );
  }

  // Handle select answer
  // ————————————————————
  function handleSelect(data) {
    console.log("question", question);
    console.log("data", data);

    let { answer, sid, val } = data;

    let newAnswers =
      answer && answer.val
        ? // Remove answer
          answers.filter(a => {
            let sameSid = a.sid === sid;
            let sameQuestionId = a.questionId === question.id;
            let sameInputType = a.inputType === question.inputType;

            if (!sameQuestionId) {
              return true;
            }

            if (!sameInputType) {
              return true;
            }

            return !sameSid;
          })
        : // Add answer
          [
            ...answers,
            {
              sectionId: section.id,
              questionId: question.id,
              sectionName: section.name,
              questionName: question.name,
              inputType: question.inputType,
              sid,
              val,
            },
          ];

    // Set data
    setAnswers(newAnswers);
  }

  return (
    <MultipleChoiceInput
      options={question?.options.map(({ val, sid }) => {
        // Get answer for this option
        const answer = getAnswer({ sid });

        // Return check box properties
        return {
          val,
          key: sid,
          checked: !!answer?.val,
          handleOnClick: () => handleSelect({ answer, sid, val }),
        };
      })}
    />
  );
}
