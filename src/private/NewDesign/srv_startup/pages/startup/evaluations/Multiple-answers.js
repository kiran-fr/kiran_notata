import React, { useState } from "react";
import InputCheckBox from "../../ui-kits/check-box";

function SingleRow(props) {
  const [count, setCount] = useState(0);

  return (
    <>
      <div class="row single-answer-option">
        <div class="col-sm-1 col-xs-1">
          <InputCheckBox
            name="single-answer-option"
            id="option-1"
          ></InputCheckBox>
        </div>
        <div class="col-sm-7 col-xs-10">
          <input type="text" placeholder="Option 1" class="text-box" value="" />
        </div>
        <div class="col-sm-1 points-text col-xs-5">
          <span class="points">Points</span>
        </div>
        <div class="col-sm-2 col-xs-6 incre-decre-icons">
          <span
            class="material-icons remove"
            onClick={() => setCount(count - 1)}
          >
            remove_circle
          </span>
          <span class="no-of-points numbers" style={{ marginLeft: 0 }}>
            {count}
          </span>
          <span class="material-icons add" onClick={() => setCount(count + 1)}>
            add_circle
          </span>
          <span class="material-icons cancel" onClick={props.removeRow}>
            cancel
          </span>
        </div>
      </div>
    </>
  );
}

export default function MultiPleAnswer() {
  const [rows, setRows] = useState(1);

  const removeRows = () => {
    setRows(rows - 1);
  };

  return (
    <>
      {[...Array(rows)].map((elementInArray, index) => {
        return <SingleRow removeRow={removeRows}></SingleRow>;
      })}
      <div className="row single-answer-option add-option-container">
        <div className="col-sm-1 col-xs-1 d-none"></div>
        <div className="col-sm-10 col-xs-10">
          <div className="add-option-text">
            <span className="add-other" onClick={() => setRows(rows + 1)}>
              Add Other
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
