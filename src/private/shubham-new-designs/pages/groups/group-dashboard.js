import React, { useState } from "react";
import "./group-dashboard.scss";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
export default function GroupDashboard() {
  const [dropDownState, setDropDownState] = useState(false);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const noOfSubmittions = 5;
  const [submittionState, setSubmittionState] = useState(false);
  const [subjectiveScoreState, setSubjectiveScoreState] = useState(false);
  return (
    <div className="group-dashboard-container">
      <div className="row">
        <div className="col-sm-10 col-xs-12">
          <div className="col-sm-7 col-md-7 ">
            <div className="card">
              <div className="group-dashboard-container__card-heading">
                <span class="material-icons">lock</span>Band of Angels
                <span
                  class="material-icons group-dashboard-container__browse-card"
                  onClick={() => setDropDownState(!dropDownState)}
                >
                  {" "}
                  more_horiz{" "}
                </span>
              </div>
              {dropDownState && (
                <div className="group-dashboard-container__browse-card__drop-dwon">
                  <div
                    className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                    onClick={() => null}
                  >
                    <span class="material-icons settings">content_copy</span>
                    <span className="text">SETTINGS</span>
                  </div>
                  <div
                    className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                    onClick={() => null}
                  >
                    <span class="material-icons settings">edit</span>
                    <span className="text">EDIT</span>
                  </div>
                  <div
                    className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                    onClick={() => null}
                  >
                    <span class="material-icons settings">groups</span>
                    <span className="text">CREATE NEW GROUP</span>
                  </div>
                  <div
                    className="material-icons group-dashboard-container__browse-card__drop-dwon__item leave"
                    onClick={() => null}
                  >
                    <span class="material-icons leave">delete</span>
                    <span className="text">DELETE GROUP</span>
                  </div>
                </div>
              )}
              <div>
                <p className="group-dashboard-container__group-details">
                  Band of Angels was the first high-tech angel investment group
                  in the Norway and continues today, with millions of dollars of
                  annual investment into 20+ startups each year.
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-5 col-md-5">
            <div className="card">
              <Tabs value={value} onChange={handleChange}>
                <Tab label="Admin View" {...a11yProps(0)} />
                <Tab label="Member View" {...a11yProps(1)} />
              </Tabs>
              <div className="users-container">
                <div className="users-container__user-count">
                  <div className="users-container__user-count__name">
                    10 evaluation templates
                  </div>
                  <div className="users-container__user-count__action">
                    <div className="users-container__user-count__action__btn">
                      Manage templates
                    </div>
                  </div>
                </div>
                <div className="users-container__user-count">
                  <div className="users-container__user-count__name">
                    <u>4 members</u>
                  </div>
                  <div className="users-container__user-count__action">
                    <div className="users-container__user-count__action__btn">
                      Invite members
                    </div>
                  </div>
                </div>
                <div className="users-container__user-count">
                  <div className="users-container__user-count__name">
                    2 admins
                  </div>
                  <div className="users-container__user-count__action">
                    <i
                      class={`users-container__user-count__action__icon fa fa-chevron-down`}
                      aria-hidden="true"
                      onClick={() => null}
                    ></i>
                  </div>
                </div>
                <div className="users-container__user-count">
                  <div className="users-container__user-count__name">
                    3 startups
                  </div>
                  <div className="users-container__user-count__action">
                    <div className="users-container__user-count__action__btn">
                      Manage Startups
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-10 col-xs-12">
          <div className="col-sm-12 startup-container">
            <div className="card">
              <div className="group-dashboard-container__card-heading startup-heading">
                <div className="startup-container__startup-icon">G</div>
                Great Startup Inc
              </div>
              <p className="startup-container__description">
                Great Startup Inc helps people to find a way to change their
                financial perspectives
              </p>
              <div className="row subjective-score-container">
                <div className="col-sm-4 col-md-3 col-xs-6 subjective-score-container__subjective-score">
                  <i
                    className={`subjective-score-container__heading__icon
                        ${
                          subjectiveScoreState
                            ? "fa fa-chevron-up"
                            : "fa fa-chevron-down"
                        }`}
                    aria-hidden="true"
                    onClick={() =>
                      setSubjectiveScoreState(!subjectiveScoreState)
                    }
                  ></i>
                  <div className="subjective-score-container__heading">
                    subjective score
                  </div>
                  <div className="subjective-score-container__score">8,5</div>
                  <div className="subjective-score-container__highest-lowest-score">
                    <div className="subjective-score-container__highest-lowest-score__record">
                      <span class="material-icons north">north</span>
                      <span className="subjective-score-container__highest-lowest-score__score highest">
                        9,9
                      </span>
                      <span className="subjective-score-container__highest-lowest-score__type">
                        highest
                      </span>
                    </div>
                    <div className="subjective-score-container__highest-lowest-score__record">
                      <span class="material-icons south">south</span>
                      <span className="subjective-score-container__highest-lowest-score__score lowest">
                        9,9
                      </span>
                      <span className="subjective-score-container__highest-lowest-score__type">
                        lowest
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3 col-xs-6">
                  <div className="subjective-score-container__heading subjective-score-container__evaluations-heading">
                    first impression
                  </div>
                  <div className="subjective-score-container__score">65%</div>
                  <div className="subjective-score-container__highest-lowest-score">
                    <div className="subjective-score-container__highest-lowest-score__record">
                      <span class="material-icons north">north</span>
                      <span className="subjective-score-container__highest-lowest-score__score highest">
                        9,9
                      </span>
                      <span className="subjective-score-container__highest-lowest-score__type">
                        highest
                      </span>
                    </div>
                    <div className="subjective-score-container__highest-lowest-score__record">
                      <span class="material-icons south">south</span>
                      <span className="subjective-score-container__highest-lowest-score__score lowest">
                        9,9
                      </span>
                      <span className="subjective-score-container__highest-lowest-score__type">
                        lowest
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3 col-md-3 col-xs-6">
                  <div className="subjective-score-container__heading subjective-score-container__evaluations-heading">
                    before pitching
                  </div>
                  <div className="subjective-score-container__score">65%</div>
                  <div className="subjective-score-container__highest-lowest-score">
                    <div className="subjective-score-container__highest-lowest-score__record">
                      <span class="material-icons north">north</span>
                      <span className="subjective-score-container__highest-lowest-score__score highest">
                        9,9
                      </span>
                      <span className="subjective-score-container__highest-lowest-score__type">
                        highest
                      </span>
                    </div>
                    <div className="subjective-score-container__highest-lowest-score__record">
                      <span class="material-icons south">south</span>
                      <span className="subjective-score-container__highest-lowest-score__score lowest">
                        9,9
                      </span>
                      <span className="subjective-score-container__highest-lowest-score__type">
                        lowest
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3 col-md-3 col-xs-6">
                  <div className="subjective-score-container__heading subjective-score-container__evaluations-heading">
                    after pitching
                  </div>
                  <div className="subjective-score-container__score">65%</div>
                  <div className="subjective-score-container__highest-lowest-score">
                    <div className="subjective-score-container__highest-lowest-score__record">
                      <span class="material-icons north">north</span>
                      <span className="subjective-score-container__highest-lowest-score__score highest">
                        9,9
                      </span>
                      <span className="subjective-score-container__highest-lowest-score__type">
                        highest
                      </span>
                    </div>
                    <div className="subjective-score-container__highest-lowest-score__record">
                      <span class="material-icons south">south</span>
                      <span className="subjective-score-container__highest-lowest-score__score lowest">
                        9,9
                      </span>
                      <span className="subjective-score-container__highest-lowest-score__type">
                        lowest
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {subjectiveScoreState && (
                <>
                  <div className="row subjective-score-evaluation-container">
                    <i
                      class={`subjective-score-evaluation-container__icon fa fa-chevron-down`}
                      aria-hidden="true"
                      onClick={() => null}
                    ></i>
                    <div className="col-sm-6 col-xs-9 subjective-score-evaluation-container__name">
                      Subjective Score
                    </div>
                    <div className="col-sm-3 col-xs-9 subjective-score-evaluation-container__submitions">
                      15 submitions
                    </div>
                    <div className="col-sm-3 col-xs-3 subjective-score-evaluation-container__score">
                      8,5
                    </div>
                  </div>
                  <div className="row evaluation-container">
                    <div className="col-sm-12 evaluation-container__heading">
                      EVALUATIONS
                    </div>
                  </div>
                  <div className="row evaluation-container">
                    <i
                      class={`subjective-score-evaluation-container__icon 
                            ${
                              submittionState
                                ? "fa fa-chevron-up"
                                : "fa fa-chevron-down"
                            }`}
                      aria-hidden="true"
                      onClick={() => setSubmittionState(!submittionState)}
                    ></i>
                    <div className="col-sm-6 col-xs-9 subjective-score-evaluation-container__name">
                      First Impression
                    </div>
                    <div className="col-sm-3 col-xs-9 subjective-score-evaluation-container__submitions">
                      5 submitions
                    </div>
                    <div className="col-sm-3 col-xs-3 subjective-score-evaluation-container__score">
                      65%
                    </div>
                  </div>
                  {submittionState &&
                    [...Array(noOfSubmittions)].map((elementInArray, index) => {
                      return (
                        <div
                          className="row evaluation-list-container"
                          key={`submition-id-${index}`}
                        >
                          <div className="col-sm-6 col-xs-9 subjective-score-evaluation-container__username">
                            Daria Kyselova (you)
                          </div>
                          <div className="col-sm-3 col-xs-9 subjective-score-evaluation-container__submitions">
                            03.09.2021
                          </div>
                          <div className="col-sm-3 col-xs-3 subjective-score-evaluation-container__score">
                            65% <span className="full-list">Full list</span>
                          </div>
                        </div>
                      );
                    })}
                </>
              )}
              <div className="row your-evaluations-container">
                <div className="col-sm-4 col-xs-6">
                  <i
                    class={`your-evaluations-container__icon fa fa-chevron-down`}
                    aria-hidden="true"
                    onClick={() => null}
                  ></i>
                  <div className="your-evaluations-container__heading">
                    YOUR EVALUATIONS
                  </div>
                </div>
                <div className="col-sm-2 col-xs-6">
                  <div className="your-evaluations-container__availability">
                    6 available
                  </div>
                </div>
                <div className="col-sm-6 col-xs-12 your-evaluations-container__comment-section">
                  <i
                    className="your-evaluations-container__icon fa fa-comment"
                    aria-hidden="true"
                    onClick={() => null}
                  ></i>
                  <div className="your-evaluations-container__message-count">
                    25
                  </div>
                  <div className="your-evaluations-container__show-comments">
                    Show unread (4) comments
                  </div>
                  <i
                    className="fa fa-chevron-down"
                    aria-hidden="true"
                    onClick={() => null}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
