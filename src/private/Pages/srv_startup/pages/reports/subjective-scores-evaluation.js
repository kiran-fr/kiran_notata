import React from "react";
// STYLES 
import "./subjective-scores-evaluation.scss";

export default function SubjectiveScoreEvaluation() {
  let array = [0, 5, 10, 15, 20];
  let months = [
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
    "JAN",
    "FEB",
    "MAR",
  ];
  return (
    <div className="card subjective-score-evaluations-container">
      <div className="col-sm-6 card-heading">
        Subjective score and evaluations
      </div>
      <div className="col-sm-3 col-xs-6">
        <div className="range-legend">
          <span className="min">-</span>
          <div className="legend">
            <div className="legend-value">0</div>
            <div className="legend-icon-0"></div>
          </div>
          <div className="legend">
            <div className="legend-value">5</div>
            <div className="legend-icon-5"></div>
          </div>
          <div className="legend">
            <div className="legend-value">10</div>
            <div className="legend-icon-10"></div>
          </div>
          <div className="legend">
            <div className="legend-value">15</div>
            <div className="legend-icon-15"></div>
          </div>
          <div className="legend">
            <div className="legend-value">20</div>
            <div className="legend-icon-20"></div>
          </div>
          <span className="min">+</span>
        </div>
        <div className="added-startups">Added startups</div>
      </div>
      <div className="col-sm-2 col-xs-6 last-year">
        <div className="txt">Last Year</div>
        <div className="date">Mar 16, 2020 - Mar 16, 2020</div>
      </div>
      <div className="subjective-score-evaluations-container__data">
        <div className="months">
          {months.map(month => {
            return <div className="month">{month}</div>;
          })}
        </div>
        <div className="subjective-score-evaluations-container__year">
          <div className="days">
            <div className="day">SUN</div>
            <div className="day">MON</div>
            <div className="day">TUE</div>
            <div className="day">WED</div>
            <div className="day">THU</div>
            <div className="day">FRI</div>
            <div className="day">SAT</div>
          </div>
          {[...Array(52)].map((elementInArray, index) => {
            return (
              <div className="week" key={`week-id-${index}`}>
                {[0, 1, 2, 3, 4, 5, 6].map(element => {
                  return (
                    <div
                      className={`day-score days-score-${
                        array[Math.floor(Math.random() * array.length)]
                      }`}
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
