import React, { useState } from "react";
import "./group-dashboard.scss";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import StartupPerformanceChart from "./startup-performance-chart";
import CommentsActivities from "./comments-activities";
import { Modal } from "../../../../Components/UI_Kits/Modal/Modal";
import AddStartup from "./add-startup";
import ManageTemplates from "./manage-templates";
import SubmissionFullList from "../startup/evaluations/submission-full-list";
import InviteMembers from "./invite-members";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import { ICONPOSITION } from "../constants";
import SharingOptions from "../startup/groups-individuals/sharing-options";
import GroupMembers from "./group-members";
import LeaveGroup from "./leave-group-modal";
import DeleteGroup from "./delete-group-modal";

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
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [yourEvaluation, setYourEvaluation] = useState(false);
  const [starttupDescription, setStarttupDescription] = useState(false);
  const [addStartupModal, setAddStartupModal] = useState(false);
  const [manageTemplateModal, setManageTemplateModal] = useState(false);
  const [inviteMembersModal, setInviteMembersModal] = useState(false);
  const [inviteMembersModal2, setInviteMembersModal2] = useState(false);
  const [groupMemberModal, setGroupMemberModal] = useState(false);
  const [leaveGroupModal, setLeaveGroupModal] = useState(false);
  const [deleteGroupModal, setDeleteGroupModal] = useState(false);

  const [fullListModal, setFullListModal] = useState(false);
  const [shareGroupModal, setShareGroupModal] = useState(false);
  const inMyDealFlow = true;
  const [fullListModalObj, setFullListModalObj] = useState({
    evalType: "First Impression",
    submittedBy: "Daria Kyselova",
    summary: "65%",
    details: [
      {
        id: "concept",
        name: "Concept",
        value: "65%",
        detail: [
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
        ],
      },
      {
        id: "market",
        name: "Market",
        value: "65%",
        detail: [
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
        ],
      },
      {
        id: "problem",
        name: "Problem",
        value: "65%",
        detail: [
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
        ],
      },
      {
        id: "team",
        name: "Team",
        value: "65%",
        detail: [
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
          {
            key: "Do you think it's easy or hard to copy the concept?",
            value: "0/1",
          },
        ],
      },
    ],
  });
  return (
    <>
      <div className="group-dashboard-container">
        <div className="row">
          <div className="col-md-9 col-sm-12 col-xs-12 nopadding-left">
            <div className="row">
              <div className="col-sm-7 col-md-7">
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
                      {value === 0 && (
                        <>
                          <div
                            className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                            onClick={() => null}
                          >
                            <span class="material-icons settings">
                              content_copy
                            </span>
                            <span className="text">SETTINGS</span>
                          </div>
                          <div
                            className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                            onClick={() => null}
                          >
                            <span class="material-icons settings">edit</span>
                            <span className="text">EDIT</span>
                          </div>
                        </>
                      )}
                      <div
                        className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                        onClick={() => null}
                      >
                        <span class="material-icons settings">groups</span>
                        <span className="text">CREATE NEW GROUP</span>
                      </div>
                      {value === 0 ? (
                        <div
                          className="material-icons group-dashboard-container__browse-card__drop-dwon__item leave"
                          onClick={() => setDeleteGroupModal(true)}
                        >
                          <span class="material-icons leave">delete</span>
                          <span className="text">DELETE GROUP</span>
                        </div>
                      ) : (
                        <div
                          className="material-icons group-dashboard-container__browse-card__drop-dwon__item leave"
                          onClick={() => setLeaveGroupModal(true)}
                        >
                          <span class="material-icons leave">delete</span>
                          <span className="text">LEAVE GROUP</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <p className="group-dashboard-container__group-details">
                      Band of Angels was the first high-tech angel investment
                      group in the Norway and continues today, with millions of
                      dollars of annual investment into 20+ startups each year.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-5 col-md-5 nopadding-left">
                <div className="card">
                  <Tabs value={value} onChange={handleChange}>
                    <Tab label="Admin View" {...a11yProps(0)} />
                    <Tab label="Member View" {...a11yProps(1)} />
                  </Tabs>
                  <div className="users-container">
                    {value === 0 && (
                      <div className="users-container__user-count">
                        <div className="users-container__user-count__name">
                          10 evaluation templates
                        </div>

                        <div className="users-container__user-count__action">
                          <div
                            className="users-container__user-count__action__btn"
                            onClick={() => setManageTemplateModal(true)}
                          >
                            Manage templates
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="users-container__user-count">
                      <div className="users-container__user-count__name">
                        <u>4 members</u>
                      </div>
                      <>
                        <div className="users-container__user-count__action">
                          <div
                            className="users-container__user-count__action__btn"
                            onClick={() => setInviteMembersModal(true)}
                          >
                            IM1
                          </div>
                          <div
                            className="users-container__user-count__action__btn"
                            onClick={() => setGroupMemberModal(true)}
                          >
                            GM
                          </div>
                          <div
                            className="users-container__user-count__action__btn"
                            onClick={() => setInviteMembersModal2(true)}
                          >
                            IM2
                          </div>
                        </div>
                      </>
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
                        <div
                          className="users-container__user-count__action__btn"
                          onClick={() => setAddStartupModal(true)}
                        >
                          {value === 0 ? "Manage Startups" : "MANAGE"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 startup-container">
                <div className="card">
                  <StartupPerformanceChart></StartupPerformanceChart>
                </div>
              </div>
              <div className="col-sm-12 col-xs-12 startup-container">
                <div className="card">
                  <div className="row">
                    <div className="group-dashboard-container__card-heading startup-heading col-md-6 col-sm-12">
                      <div className="startup-container__startup-icon">G</div>
                      <span
                        onMouseEnter={() => setStarttupDescription(true)}
                        onMouseLeave={() => setStarttupDescription(false)}
                      >
                        Great Startup Inc
                      </span>
                    </div>
                    <div className="col-md-5 col-sm-12 group-dashboard-container__in-my-deal-flow-container">
                      {inMyDealFlow ? (
                        <>
                          <span className="group-dashboard-container__in-my-deal-flow">
                            IN MY DEALFLOW
                          </span>
                          <ButtonWithIcon
                            iconName="share"
                            className="share-back"
                            text="SHARE BACK"
                            iconPosition={ICONPOSITION.START}
                            onClick={() => setShareGroupModal(true)}
                          ></ButtonWithIcon>
                        </>
                      ) : (
                        <ButtonWithIcon
                          iconName="add"
                          className="add-to-deal-flow"
                          text="ADD TO DEAL FLOW"
                          iconPosition={ICONPOSITION.START}
                        ></ButtonWithIcon>
                      )}
                    </div>
                  </div>
                  {starttupDescription && (
                    <div className="group-dashboard-container__info-window info-window">
                      <div className="group-dashboard-container__info-window__heading">
                        Great Startup Inc
                      </div>
                      <p className="group-dashboard-container__info-window__description">
                        Great Startup is a simple tool for investors to evaluate
                        startups and engage their network
                      </p>
                      <div className="group-dashboard-container__info-window__heading">
                        Problem
                      </div>
                      <p className="group-dashboard-container__info-window__description">
                        It's hard to avoid unconscious bias when investing in
                        early stage startups. A systematic approach to evaluate
                        companies has proven to increase the return of
                        investment. Most online platforms are focused on
                        startups, while tools for investors are often
                        complicated, expensive and lack sharing capabilites.
                        Entering the market as a new investor is difficult
                        without open access to a network. Notata is the only
                        tool which offers deal flow management, collaboration
                        and sharing between investors.
                      </p>
                      <div className="group-dashboard-container__info-window__heading">
                        Solution
                      </div>
                      <p className="group-dashboard-container__info-window__description">
                        A simple and sexy system to evaluate startups on the
                        fly, with sharing and collaboration at the core.
                      </p>
                    </div>
                  )}
                  <div className="row">
                    <p className="startup-container__description">
                      Great Startup Inc helps people to find a way to change
                      their financial perspectives
                    </p>
                  </div>
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
                      <div className="subjective-score-container__score">
                        8,5
                      </div>
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
                      <div className="subjective-score-container__score">
                        65%
                      </div>
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
                    <div className="col-sm-4 col-md-3 col-xs-6">
                      <div className="subjective-score-container__heading subjective-score-container__evaluations-heading">
                        before pitching
                      </div>
                      <div className="subjective-score-container__score">
                        65%
                      </div>
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
                        after pitching
                      </div>
                      <div className="subjective-score-container__score">
                        65%
                      </div>
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
                        [...Array(noOfSubmittions)].map(
                          (elementInArray, index) => {
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
                                  65%{" "}
                                  <span
                                    className="full-list"
                                    onClick={() => setFullListModal(true)}
                                  >
                                    Full list
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </>
                  )}
                  <div className="row your-evaluations-container">
                    <div className="col-md-4 col-sm-6 col-xs-7">
                      <i
                        class={`your-evaluations-container__icon fa ${
                          yourEvaluation ? "fa-chevron-up" : "fa-chevron-down"
                        }`}
                        aria-hidden="true"
                        onClick={() => setYourEvaluation(!yourEvaluation)}
                      ></i>
                      <div className="your-evaluations-container__heading">
                        YOUR EVALUATIONS
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-5">
                      <div className="your-evaluations-container__availability">
                        6 available
                      </div>
                    </div>
                    {yourEvaluation && (
                      <>
                        <div className="col-sm-12 your-evaluations-container__score">
                          <span className="your-evaluations-container__subjective">
                            Subjective Score
                          </span>
                          <span className="your-evaluations-container__option-container">
                            {[...Array(10)].map((elementInArray, index) => {
                              return (
                                <span
                                  key={`score-option-id-${index}`}
                                  className="your-evaluations-container__score-option"
                                >
                                  {index + 1}
                                </span>
                              );
                            })}
                          </span>
                          <span className="your-evaluations-container__share-with-group">
                            Share With Group
                          </span>
                        </div>
                        <div className="col-sm-12 your-evaluations-container__details-heading">
                          your evaluations
                        </div>
                        <div className="row">
                          <div className="col-sm-12 your-evaluations-container__record">
                            <div className="col-sm-5 col-xs-7 subjective-score-evaluation-container__name">
                              First Impression
                            </div>
                            <div className="col-sm-2 col-xs-6 subjective-score-evaluation-container__submitions">
                              03.09.2021
                            </div>
                            <div className="col-sm-1 col-xs-5 subjective-score-evaluation-container__score">
                              65%
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-6">
                              <div className="your-evaluations-container__record__share-with-group">
                                Share With Group
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 your-evaluations-container__details-heading">
                          requested evaluations
                        </div>
                        <div className="row">
                          <div className="col-sm-12 your-evaluations-container__record">
                            <div className="col-sm-5 col-xs-7 subjective-score-evaluation-container__name">
                              First Impression
                            </div>
                            <div className="col-sm-2 col-xs-6 subjective-score-evaluation-container__submitions">
                              03.09.2021
                            </div>
                            <div className="col-sm-1 col-xs-5 subjective-score-evaluation-container__score">
                              65%
                            </div>
                            <div className="col-md-4 col-sm-6 col-xs-6">
                              <div className="your-evaluations-container__record__share-with-group">
                                Share With Group
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div
                      className={`col-md-5 col-sm-12 col-xs-12 your-evaluations-container__comment-section ${
                        yourEvaluation ? "your-evaluation-open" : ""
                      }`}
                    >
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
                        <i
                          className={`fa ${
                            showCommentSection
                              ? "fa-chevron-up"
                              : "fa-chevron-down"
                          }`}
                          aria-hidden="true"
                          onClick={() =>
                            setShowCommentSection(!showCommentSection)
                          }
                        ></i>
                      </div>
                    </div>
                    {showCommentSection && (
                      <div className="comment-container">
                        <div className="col-sm-12 col-xs-12 comment">
                          <div>
                            <span className="comment__username">
                              Ane Nordahl Carlsen
                            </span>
                            <span className="comment__datetime">
                              Jan 28, 2021 10:53 PM{" "}
                            </span>
                          </div>
                          <div>
                            <p className="comment__comment">
                              I do not like the real potencial of this startup.
                              It's hard to avoid unconscious bias when investing
                              in early stage startups. A systematic approach to
                              evaluate companies has proven to increase the
                              return of investment. Most online platforms are
                              focused on startups, while tools for investors are
                              often complicated, expensive and lack sharing
                              capabilites.
                            </p>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 comment">
                          <div>
                            <span className="comment__username">
                              Daria Kyselova
                            </span>
                            <span className="comment__datetime">
                              Jan 28, 2021 10:53 PM
                            </span>
                          </div>
                          <div>
                            <p className="comment__comment">
                              I like their presentation a lot.
                            </p>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 comment">
                          <div>
                            <span className="comment__username">
                              Daria Kyselova
                            </span>
                            <span className="comment__datetime">
                              Jan 28, 2021 10:53 PM
                            </span>
                          </div>
                          <div>
                            <p className="comment__comment">
                              I like their presentation a lot.
                            </p>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-12 comment">
                          <div>
                            <span className="comment__username">
                              Daria Kyselova
                            </span>
                            <span className="comment__datetime">
                              Jan 28, 2021 10:53 PM
                            </span>
                          </div>
                          <div>
                            <p className="comment__comment">
                              I like their presentation a lot.
                            </p>
                          </div>
                        </div>
                        <div className="col-sm-12 col-xs-12">
                          <input
                            type="text"
                            className="comment__write-comment"
                          />
                          <i
                            className="comment__send fa fa-paper-plane"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-12 col-xs-12 comments-activities-container">
            <CommentsActivities></CommentsActivities>
          </div>
        </div>
      </div>
      {addStartupModal && (
        <Modal
          title="Add Startups"
          submit={() => setAddStartupModal(false)}
          close={() => setAddStartupModal(false)}
          submitTxt="SAVE"
          closeTxt="CANCEL"
          children={<AddStartup></AddStartup>}
        ></Modal>
      )}
      {manageTemplateModal && (
        <Modal
          title="Manage Templates"
          submit={() => setManageTemplateModal(false)}
          close={() => setManageTemplateModal(false)}
          submitTxt="SAVE"
          closeTxt="CANCEL"
          children={<ManageTemplates></ManageTemplates>}
        ></Modal>
      )}
      {fullListModal && (
        <Modal
          title={`${fullListModalObj.evalType} (${fullListModalObj.submittedBy})`}
          submit={() => {
            setFullListModal(false);
          }}
          close={() => {
            setFullListModal(false);
          }}
          submitTxt="OK"
          children={<SubmissionFullList obj={fullListModalObj} />}
        ></Modal>
      )}
      {inviteMembersModal && (
        <Modal
          title="Invite Members"
          submit={() => {
            setInviteMembersModal(false);
          }}
          close={() => {
            setInviteMembersModal(false);
          }}
          submitTxt="SEND INVITATIONS"
          closeTxt="CANCEL"
          children={<InviteMembers />}
          innerClassName="invite-member-modal"
        ></Modal>
      )}
      {groupMemberModal && (
        <Modal
          title="Group Members"
          close={() => {
            setGroupMemberModal(false);
          }}
          closeTxt="CANCEL"
          innerClassName="group-member-modal"
          children={<GroupMembers />}
        ></Modal>
      )}
      {inviteMembersModal2 && (
        <Modal
          title="Invite Members"
          submit={() => {
            setInviteMembersModal2(false);
          }}
          close={() => {
            setInviteMembersModal2(false);
          }}
          submitTxt="SEND INVITATIONS"
          closeTxt="CANCEL"
          children={<InviteMembers type={2} />}
          innerClassName="invite-member-modal"
        ></Modal>
      )}
      {shareGroupModal && (
        <Modal
          title="Sharing options"
          submit={() => {
            setShareGroupModal(false);
          }}
          close={() => {
            setShareGroupModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={<SharingOptions></SharingOptions>}
        ></Modal>
      )}
      {deleteGroupModal && (
        <Modal
          title="Delete group"
          submit={() => {
            setDeleteGroupModal(false);
          }}
          close={() => {
            setDeleteGroupModal(false);
          }}
          submitTxt="Delete"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={<DeleteGroup></DeleteGroup>}
        ></Modal>
      )}
      {leaveGroupModal && (
        <Modal
          title="Leave group"
          submit={() => {
            setLeaveGroupModal(false);
          }}
          close={() => {
            setLeaveGroupModal(false);
          }}
          submitTxt="Leave"
          closeTxt="Cancel"
          submitButtonStyle="secondary"
          children={<LeaveGroup></LeaveGroup>}
        ></Modal>
      )}
    </>
  );
}
