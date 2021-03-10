import React from "react";
import { useMutation } from "@apollo/client";

import { MultipleChoiceInput } from "Components/Forms";
import { creativePut } from "private/Apollo/Mutations";

export default function MultipleChoiceInputContainer({
  templateId,
  section,
  question,
  answers,
  setAnswers,
}) {
  const { options } = question;

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
  function handleSelect({ answer, sid, val }) {
    let newAnswers =
      answer && answer.val
        ? // Remove answer
          answers.filter(a => a.sid !== sid)
        : // Add answer
          [
            ...answers,
            {
              templateId: templateId,
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
      options={options.map(({ val, sid }) => {
        // Get answer for this option
        const answer = getAnswer({ sid });

        // Return check box properties
        return {
          val,
          key: sid,
          checked: answer && answer.val,
          handleOnClick: () => handleSelect({ answer, sid, val }),
        };
      })}
    />
  );
}
