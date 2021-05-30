import React from "react";
import TextBox from "../../ui-kits/text-box";
import RadioButton from "../../ui-kits/radio-button";

export default function SingleAndMultiPleAnswer() {
  const noOfRows = 1;
  //const [count, setCount] = useState(0);
  function handlerows() {
    //alert('Hello!');
    // var _div = document.createElement('div');
    // _div.innerHTML = '<div class="row single-answer-option"><div class="col-sm-1 col-xs-1"><label class="radio-button-container"><span class="radio-button-label"></span><input type="radio" id="option-1" name="single-answer-option" value=""><span class="checkmark"></span></label></div><div class="col-sm-7 col-xs-10"><input type="text" placeholder="Option 1" class="text-box" value=""></div><div class="col-sm-1 points-text col-xs-5"><span class="points">Points</span></div><div class="col-sm-2 col-xs-6 incre-decre-icons"><span class="material-icons remove">remove_circle</span><span class="no-of-points">1</span><span class="material-icons add">add_circle</span><span class="material-icons cancel" onclick="removeRow(this)">cancel</span></div></div>';
    // document.getElementById("questionDiv").appendChild(_div);
    document
      .querySelector("#questionDiv")
      .insertAdjacentHTML(
        "beforeend",
        `<div class="row single-answer-option"><div class="col-sm-1 col-xs-1"><label class="radio-button-container"><span class="radio-button-label"></span><input type="radio" id="option-1" name="single-answer-option" value=""><span class="checkmark"></span></label></div><div class="col-sm-7 col-xs-10"><input type="text" placeholder="Option 1" class="text-box" value=""></div><div class="col-sm-1 points-text col-xs-5"><span class="points">Points</span></div><div class="col-sm-2 col-xs-6 incre-decre-icons"><span class="material-icons remove" onclick=removePoints(this)>remove_circle</span><input class="no-of-points numbers" value="1" /><span class="material-icons add" onclick=addPoints(this)>add_circle</span><span class="material-icons cancel" onclick="removeRow(this)">cancel</span></div></div>`
      );
  }

  function addPoints() {
    var value = parseInt(document.getElementById("number").value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById("number").value = value;
  }

  function removePoints() {
    var value = parseInt(document.getElementById("number").value, 10);
    if (value != 1) {
      value = isNaN(value) ? 0 : value;
      value--;
      document.getElementById("number").value = value;
    }
  }

  return (
    <>
      <div id="questionDiv">
        {[...Array(noOfRows)].map((elementInArray, index) => {
          return (
            <div
              className="row single-answer-option"
              key={`single-option-id-${index}`}
            >
              <div className="col-sm-1 col-xs-1">
                <RadioButton
                  name="single-answer-option"
                  id="option-1"
                ></RadioButton>
              </div>
              <div className="col-sm-7 col-xs-10">
                <TextBox placeholder="Option 1"></TextBox>
              </div>
              <div className="col-sm-1 points-text col-xs-5">
                <span className="points">Points</span>
              </div>
              <div className="col-sm-2 col-xs-6 incre-decre-icons">
                <span class="material-icons remove" onClick={removePoints}>
                  remove_circle
                </span>
                <input className="no-of-points" id="number" value="1" />
                <span class="material-icons add" onClick={addPoints}>
                  add_circle
                </span>
                <span class="material-icons cancel">cancel</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="row single-answer-option add-option-container">
        <div className="col-sm-1 col-xs-1 d-none">
          {/*}
          <RadioButton name="single-answer-option" id="add-other"></RadioButton>
    {*/}
        </div>
        <div className="col-sm-10 col-xs-10">
          <div className="add-option-text">
            <span className="add-option" onClick={handlerows}>
              Add Option
            </span>
            <span className="or">or</span>
            <span className="add-other" onClick={handlerows}>
              Add “Other”
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
