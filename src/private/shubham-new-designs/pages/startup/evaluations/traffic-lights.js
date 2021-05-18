import React from "react";
import "./traffic-lights.scss";

export default function TrafficLights() {
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
        <div className="col-sm-12 col-xs-6">
          <div className="incre-decre-icons">
            <span class="points">Points</span>
            <span class="material-icons remove">remove_circle</span>
            <span className="no-of-points">1</span>
            <span class="material-icons add">add_circle</span>
          </div>
        </div>
      </div>
      <div className="col-sm-4 col-xs-12 option-container text-center">
        <div className="col-sm-12 col-xs-6">
          <div className="traffic-light">
            <div className="highlighter yellow">
              <div className="text">YELLOW</div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xs-6">
          <div className="incre-decre-icons">
            <span class="points">Points</span>
            <span class="material-icons remove">remove_circle</span>
            <span className="no-of-points">1</span>
            <span class="material-icons add">add_circle</span>
          </div>
        </div>
      </div>
      <div className="col-sm-4 col-xs-12 option-container text-center">
        <div className="col-sm-12 col-xs-6">
          <div className="traffic-light">
            <div className="highlighter green">
              <div className="text">GREEN</div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-xs-6">
          <div className="incre-decre-icons">
            <span class="points">Points</span>
            <span class="material-icons remove">remove_circle</span>
            <span className="no-of-points">1</span>
            <span class="material-icons add">add_circle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
