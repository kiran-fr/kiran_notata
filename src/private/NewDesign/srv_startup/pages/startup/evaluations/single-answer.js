import React, { useState, useEffect, useMemo } from "react";
import RadioButton from "../../ui-kits/radio-button";

function SingleRow({ removeRow, opt, setOpt, index }) {
  const [option, setOption] = useState(opt);

  // console.log("OPTIONS 2: ", option);

  const options = useMemo(() => {
    return opt;
  }, [opt]);

  // useEffect(() => {
  //   console.log("Changing Options: ", option);
  //   setOption(option);
  // }, [option]);
  useEffect(() => {
    console.log("Changing Options: ", options);
    setOption(options);
  }, [options]);

  return (
    <>
      <div class="row single-answer-option">
        <div class="col-sm-1 col-xs-1">
          <RadioButton name="single-answer-option"></RadioButton>
        </div>
        <div class="col-sm-7 col-xs-10">
          <input
            type="text"
            placeholder={`Option ${index}`}
            class="text-box"
            value={option?.val}
            onChange={e => {
              setOption({ ...option, val: e.target.value });
              setOpt({ ...option, val: e.target.value });
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
              setOption({ ...option, score: option?.score - 1 });
              setOpt({ ...option, score: option?.score - 1 });
            }}
          >
            remove_circle
          </span>
          <span class="no-of-points numbers" style={{ marginLeft: 0 }}>
            {option?.score}
          </span>
          <span
            class="material-icons add"
            onClick={() => {
              setOption({ ...option, score: option?.score + 1 });
              setOpt({ ...option, score: option?.score + 1 });
            }}
          >
            add_circle
          </span>
          <span class="material-icons cancel" onClick={removeRow}>
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
  const [opts, setOpts] = useState(options);

  useEffect(() => {
    setOpts(options);
    console.log("OPTIONS: ", options);
  }, [options]);

  const handleOptions = opt => {
    // console.log("OPTION OPT: ", opt);
    setOpts([
      ...opts.map((option, i) => {
        if (option.id === opt.id) {
          console.log("YEP Changing: ", { ...opt });
          // return opt;
          return { ...opt };
        } else {
          console.log("NOT Changing: ", option);
          return option;
        }
      }),
    ]);
  };

  const handleUpdate = () => {
    // console.log("Local Option", opts);
    setOpts(opts);
    setOptions(opts);
  };

  const removeRows = id => {
    setOpts([...opts.filter((opt, i) => opt.id !== id.id)]);
    setOptions([...opts.filter(f => f.id !== id.id)]);
    // handleUpdate();
  };

  return (
    <>
      <div id="questionDiv" onBlur={handleUpdate}>
        {opts.map((opt, index) => {
          return opt.questionId === questionId ? (
            <SingleRow
              removeRow={() => removeRows(opt)}
              opt={opt}
              key={index}
              setOpt={handleOptions}
              index={index + 1}
            ></SingleRow>
          ) : null;
        })}
      </div>
      <div className="row single-answer-option add-option-container">
        <div className="col-sm-1 col-xs-1 d-none"></div>
        <div className="col-sm-10 col-xs-10">
          <div className="add-option-text">
            <span
              className="add-other"
              onClick={() =>
                setOpts([
                  ...opts,
                  {
                    questionId,
                    id: Math.round(Math.random() * 10000).toString(),
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
