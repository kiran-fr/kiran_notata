import React from "react";
import { CommentInput } from "Components/Forms/FormInputs";

export default function CommentInputContainer({
  section,
  question,
  connection,
  evaluationTemplate,
  evaluation,
  answers,
  setAnswers,
}) {
  function handleOnSubmit(data) {
    const answer = {
      inputType: "COMMENT",
      questionId: question.id,
      questionName: question.name,
      sectionId: section.id,
      sectionName: section.name,
      val: data.comment,
    };

    answers = [
      ...answers.filter(
        ({ inputType, questionId }) =>
          !(inputType === "COMMENT" && questionId === question.id)
      ),
      answer,
    ];

    setAnswers(answers);
  }

  function handleDeleteComment({ id }) {
    answers = answers.filter(
      ({ inputType, questionId }) =>
        !(inputType === "COMMENT" && questionId === question.id)
    );
    setAnswers(answers);
  }

  function handleUpdateComment({ id, val }) {
    const answer = {
      inputType: "COMMENT",
      questionId: question.id,
      questionName: question.name,
      sectionId: section.id,
      sectionName: section.name,
      val,
    };

    answers = [
      ...answers.filter(
        ({ inputType, questionId }) =>
          !(inputType === "COMMENT" && questionId === question.id)
      ),
      answer,
    ];
    setAnswers(answers);
  }

  let currentAnswers = answers || [];

  const comments = currentAnswers.filter(
    ({ inputType, questionId }) =>
      inputType === "COMMENT" && questionId === question.id
  );

  return (
    <CommentInput
      comments={comments}
      style={{ padding: "15px" }}
      handleDeleteComment={handleDeleteComment}
      handleUpdateComment={handleUpdateComment}
      handleOnSubmit={handleOnSubmit}
      singleComment
    />
  );
}
