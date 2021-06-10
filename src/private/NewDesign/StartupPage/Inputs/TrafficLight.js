import React, { useState } from "react";
// import "./TrafficLights.scss";

export default function TrafficLights({
  templateId,
  section,
  question,
  answers,
  setAnswers,
}) {
  // Get current answer from array of answers
  const answer = answers.find(
    ({ inputType, questionId }) =>
      inputType === question.inputType && questionId === question.id
  );

  function handleSubmit(points) {
    console.log("handleSubmit", points);

    // Skip if answer don't exist, and text field is empty
    // (if it does exist we need to be able to save an empty field)
    // if (!answer) {
    //   return;
    // }

    // Create answer object
    let answerObject = {
      sectionId: section.id,
      questionId: question.id,
      sectionName: section.name,
      questionName: question.name,
      inputType: question.inputType,
      sid: "",
      val: points?.toString(),
    };

    // Remove current answer from list of answers
    let otherAnswers = answers.filter(
      ({ inputType, questionId }) =>
        !(inputType === question.inputType && questionId === question.id)
    );

    console.log("answerObject", answerObject);

    // Join the data
    let newAnswers = [...otherAnswers, answerObject];

    // Set data
    setAnswers(newAnswers);
  }

  return (
    <div className="row traffic-lights-container">
      <div
        className="col-sm-4 col-xs-12 option-container text-center"
        onClick={() => handleSubmit(1)}
      >
        <div className="col-sm-12 col-xs-6">
          <div
            className={`traffic-light ${
              answer?.val === 1 ? "active" : "inactive"
            }`}
          >
            <div className="highlighter red">
              <div className="text">RED</div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="col-sm-4 col-xs-12 option-container text-center"
        onClick={() => handleSubmit(2)}
      >
        <div className="col-sm-12 col-xs-6">
          <div
            className={`traffic-light ${
              answer?.val === 2 ? "active" : "inactive"
            }`}
          >
            <div className="highlighter yellow">
              <div className="text">YELLOW</div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="col-sm-4 col-xs-12 option-container text-center"
        onClick={() => handleSubmit(3)}
      >
        <div className="col-sm-12 col-xs-6">
          <div
            className={`traffic-light ${
              answer?.val === 3 ? "active" : "inactive"
            }`}
          >
            <div className="highlighter green">
              <div className="text">GREEN</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
