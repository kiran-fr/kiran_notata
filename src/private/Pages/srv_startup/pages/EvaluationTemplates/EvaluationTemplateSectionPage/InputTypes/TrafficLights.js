import React, { useState } from "react";
import "./TrafficLights.scss";

export default function TrafficLights({ questions, question, setQuestions }) {
  const [redCount, setRedCount] = useState(0);
  const [yellowCount, setYellowCount] = useState(0);
  const [greenCount, setGreenCount] = useState(0);

  return (
    <div className="row traffic-lights-container">
      <div className="col-sm-4 col-xs-12 option-container text-center">
        <div className="col-sm-12 col-xs-6">
          <div className="traffic-light">
            <div className="highlighter red">
              <div className="text">RED</div>
            </div>
          </div>
        </div>
        {/*<div className="col-sm-12 col-xs-6">*/}
        {/*  <div className="incre-decre-icons">*/}
        {/*    <span class="points">Points</span>*/}
        {/*    <span*/}
        {/*      class="material-icons remove"*/}
        {/*      onClick={() => setRedCount(redCount - 1)}*/}
        {/*    >*/}
        {/*      remove_circle*/}
        {/*    </span>*/}
        {/*    <span className="no-of-points">{redCount}</span>*/}
        {/*    <span*/}
        {/*      class="material-icons add"*/}
        {/*      onClick={() => setRedCount(redCount + 1)}*/}
        {/*    >*/}
        {/*      add_circle*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
      <div className="col-sm-4 col-xs-12 option-container text-center">
        <div className="col-sm-12 col-xs-6">
          <div className="traffic-light">
            <div className="highlighter yellow">
              <div className="text">YELLOW</div>
            </div>
          </div>
        </div>
        {/*<div className="col-sm-12 col-xs-6">*/}
        {/*  <div className="incre-decre-icons">*/}
        {/*    <span class="points">Points</span>*/}
        {/*    <span*/}
        {/*      class="material-icons remove"*/}
        {/*      onClick={() => setYellowCount(yellowCount - 1)}*/}
        {/*    >*/}
        {/*      remove_circle*/}
        {/*    </span>*/}
        {/*    <span className="no-of-points">{yellowCount}</span>*/}
        {/*    <span*/}
        {/*      class="material-icons add"*/}
        {/*      onClick={() => setYellowCount(yellowCount + 1)}*/}
        {/*    >*/}
        {/*      add_circle*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
      <div className="col-sm-4 col-xs-12 option-container text-center">
        <div className="col-sm-12 col-xs-6">
          <div className="traffic-light">
            <div className="highlighter green">
              <div className="text">GREEN</div>
            </div>
          </div>
        </div>
        {/*<div className="col-sm-12 col-xs-6">*/}
        {/*  <div className="incre-decre-icons">*/}
        {/*    <span class="points">Points</span>*/}
        {/*    <span*/}
        {/*      class="material-icons remove"*/}
        {/*      onClick={() => setGreenCount(greenCount - 1)}*/}
        {/*    >*/}
        {/*      remove_circle*/}
        {/*    </span>*/}
        {/*    <span className="no-of-points">{greenCount}</span>*/}
        {/*    <span*/}
        {/*      class="material-icons add"*/}
        {/*      onClick={() => setGreenCount(greenCount + 1)}*/}
        {/*    >*/}
        {/*      add_circle*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
