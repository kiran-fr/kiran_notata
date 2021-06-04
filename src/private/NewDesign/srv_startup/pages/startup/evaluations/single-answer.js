import React, { useState, useEffect, useMemo } from "react";
import RadioButton from "../../ui-kits/radio-button";

function SingleRow({ removeRow, opt, setOpt, index }) {
  // const [option, setOption] = useState(opt);

  // console.log("OPTIONS 2: ", option);

  // const options = useMemo(() => {
  //   return opt;
  // }, [opt]);

  // useEffect(() => {
  //   console.log("Changing Options: ", option);
  //   setOption(option);
  // }, [option]);
  // useEffect(() => {
  //   console.log("Changing Options: ", options);
  //   setOption(options);
  // }, [options]);

  return (
    <>
      <div class="row single-answer-option">
        <div class="col-sm-1 col-xs-1">
          <RadioButton name="single-answer-option" />
        </div>
        <div class="col-sm-7 col-xs-10">
          <input
            type="text"
            placeholder={`Option ${index}`}
            class="text-box"
            value={opt?.val || ""}
            onChange={e => {
              // setOption({ ...option, val: e.target.value });

              setOpt({ ...opt, val: e.target.value });
            }}
          />
        </div>
        <div class="col-sm-1 points-text col-xs-5">
          <span class="points">Points</span>
        </div>
        <div class="col-sm-2 col-xs-6 incre-decre-icons">
          <span
            class="material-icons remove"
            onClick={() => {
              setOpt({ ...opt, score: opt?.score - 1 });
            }}
          >
            remove_circle
          </span>
          <span class="no-of-points numbers" style={{ marginLeft: 0 }}>
            {opt?.score}
          </span>

          <span
            class="material-icons add"
            onClick={() => {
              setOpt({ ...opt, score: opt?.score + 1 });
            }}
          >
            add_circle
          </span>

          <span class="material-icons cancel" onClick={() => removeRow(opt)}>
            cancel
          </span>
        </div>
      </div>
    </>
  );
}

export default function SingleAndMultiPleAnswer({
  setOptions,
  questionId,
  options,
}) {
  const handleOptions = opt => {
    let newOptions = options.map(option => {
      let hit = option.sid === opt.sid;

      if (hit) {
        // update
        return opt;
      }

      if (!hit) {
        // do not update
        return option;
      }
    });

    setOptions(newOptions);
  };

  const handleUpdate = () => {
    setOptions(options);
  };

  const removeRow = ({ sid }) => {
    setOptions([...options.filter(f => f.sid !== sid)]);
  };

  return (
    <>
      <div id="questionDiv" onBlur={handleUpdate}>
        {options.map((opt, index) => {
          return opt.questionId === questionId ? (
            <SingleRow
              removeRow={() => removeRow(opt)}
              opt={opt}
              key={index}
              setOpt={handleOptions}
              index={index + 1}
            />
          ) : null;
        })}
      </div>
      <div className="row single-answer-option add-option-container">
        <div className="col-sm-1 col-xs-1 d-none" />
        <div className="col-sm-10 col-xs-10">
          <div className="add-option-text">
            <span
              className="add-other"
              onClick={() =>
                setOptions([
                  ...options,
                  {
                    questionId,
                    sid: Math.round(Math.random() * 10000).toString(),
                    val: "",
                    score: 0,
                  },
                ])
              }
            >
              Add Other
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
