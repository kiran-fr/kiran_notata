import React, { useState } from "react";

import { inputWrapper, inputIcon } from "./MultipleTextInput.module.css";

export default function MultipleTextInput({ setAnswers, question, answers }) {
  const [newAnswer, setnewAnswer] = useState("");

  const answerAnswers = answers[question.id] || [];

  async function handleOnSubmit(value, id) {
    if (id === undefined) {
      if (!value.length) return;

      const id = answerAnswers.length
        ? answerAnswers[answerAnswers.length - 1].id + 1
        : 0;
      const answerNew = {
        inputType: question.inputType,
        questionId: question.id,
        question: question.name,
        id,
        val: value,
      };

      setAnswers({
        ...answers,
        [question.id]: [...answerAnswers, answerNew],
      });
    } else {
      // let answersIN = answerAnswers.filter(
      //   ({ sid: answersSid }) => answersSid !== id
      // );
    }
  }

  async function handleOnDelete(id) {
    let answersIN = answerAnswers.filter(
      ({ id: answersId }) => answersId !== id
    );
    setAnswers({
      ...answers,
      [question.id]: answersIN,
    });
  }

  return (
    <div className="notata_form">
      {answerAnswers.map(({ id, val }, i) => (
        <div className={inputWrapper} key={i}>
          <input
            autoComplete="off"
            type="text"
            name={id}
            value={val}
            disabled
            placeholder="Say something..."
            // onBlur={e => handleOnSubmit(e.target.value, id)}
          />
          <div
            className={inputIcon}
            onClick={() => {
              handleOnDelete(id);
            }}
          >
            <i className="fal fa-times" />
          </div>
        </div>
      ))}

      <div className={inputWrapper}>
        <input
          autoComplete="off"
          type="text"
          name="new"
          placeholder="Say something..."
          value={newAnswer}
          onChange={e => setnewAnswer(e.target.value)}
        />
        <div
          className={inputIcon}
          onClick={() => {
            handleOnSubmit(newAnswer);
            setnewAnswer("");
          }}
        >
          <i className="fal fa-plus" />
        </div>
      </div>
    </div>
  );
}
