import React from "react";
// COMPONENTS
import InputCheckBox from "../../../../../Components/UI_Kits/from_srv/check-box";

function SingleRow({ removeOption, option, setOption, index }) {
  return (
    <>
      <div className="row single-answer-option">
        <div className="col-sm-1 col-xs-1">
          <InputCheckBox name="single-answer-option" />
        </div>
        <div className="col-sm-7 col-xs-10">
          <input
            type="text"
            placeholder={`Option ${index}`}
            className="text-box"
            value={option?.val || ""}
            onChange={e => {
              setOption({ ...option, val: e.target.value });
            }}
          />
        </div>
        <div className="col-sm-1 points-text col-xs-5">
          <span className="points">Points</span>
        </div>
        <div className="col-sm-2 col-xs-6 incre-decre-icons">
          <span
            className="material-icons remove"
            onClick={() => {
              setOption({ ...option, score: option?.score - 1 });
            }}
          >
            remove_circle
          </span>
          <span className="no-of-points numbers" style={{ marginLeft: 0 }}>
            {option?.score || 0}
          </span>

          <span
            className="material-icons add"
            onClick={() => {
              setOption({ ...option, score: option?.score + 1 });
            }}
          >
            add_circle
          </span>

          <span
            className="material-icons cancel"
            onClick={() => removeOption(option)}
          >
            cancel
          </span>
        </div>
      </div>
    </>
  );
}

export default function MultipleAnswer({ questions, question, setQuestions }) {
  const setOption = updatedOption => {
    let newOptions = question.options.map(option =>
      option.sid === updatedOption.sid ? updatedOption : option
    );

    setQuestions(
      questions.map(q =>
        q.id === question.id ? { ...question, options: newOptions } : q
      )
    );
  };

  const removeOption = deleteOption => {
    let newOptions = question.options.filter(
      option => option.sid !== deleteOption.sid
    );
    setQuestions(
      questions.map(q =>
        q.id === question.id ? { ...question, options: newOptions } : q
      )
    );
  };

  const addNewOption = () => {
    let newOptions = [
      ...question.options,
      {
        questionId: question.id,
        sid: `tmp//${Math.round(Math.random() * 10000).toString()}`,
        val: "",
        score: 0,
      },
    ];
    setQuestions(
      questions.map(q =>
        q.id === question.id ? { ...question, options: newOptions } : q
      )
    );
  };

  return (
    <>
      <div id="questionDiv">
        {question.options?.map((option, index) => (
          <SingleRow
            key={index}
            removeOption={removeOption}
            setOption={setOption}
            option={option}
            index={index}
          />
        ))}
      </div>
      <div className="row single-answer-option add-option-container">
        <div className="col-sm-1 col-xs-1 d-none" />
        <div className="col-sm-10 col-xs-10">
          <div className="add-option-text">
            <span className="add-other" onClick={addNewOption}>
              Add Other
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
