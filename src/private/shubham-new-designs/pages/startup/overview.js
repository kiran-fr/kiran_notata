import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import "./overview.scss";
import images from "./Images/";
import { ICONPOSITION, OVERVIEWPAGESTATE } from "../constants";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import ShareTemplate from "./share-template";
import Tags from "../ui-kits/tags";
import moment from "moment";

export default function Overview(props) {
  const {
    creativity: { creative, subjectiveScores, updatedAt, evaluationSummaries },
  } = props;
  const { answers, name } = creative;

  const updatedMonth = moment(new Date())
    .diff(updatedAt, "months", true)
    .toFixed(0);

  let section = answers?.find(i => i.questionId === "q01_section_info");
  let website = answers?.find(i => i.questionId === "q06_section_info");
  let slideDeck = answers.find(i => i.questionId === "q01_section_materials");

  const getFilteredArray = (scores, isMe) => {
    return scores?.filter(i => i.isMe === isMe) || [];
  };

  const getScore = (scores, getMax) => {
    if (Array.isArray(scores) && scores.length > 0) {
      return getMax
        ? Math.max(...scores?.map(i => i.score || 0))
        : Math.min(...scores?.map(i => i.score || 0));
    }
    return 0;
  };

  const getTotalScore = arr => {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr?.reduce((acc, obj) => {
        return acc + (obj.score || 0);
      }, 0);
    }
    return 0;
  };

  let teamScoreArr = getFilteredArray(subjectiveScores, false);
  let teamMaxScore = getScore(teamScoreArr, true);
  let teamMinScore = getScore(teamScoreArr, false);
  let teamAvg = (
    getTotalScore(teamScoreArr) / teamScoreArr.length || 0
  ).toFixed(1);

  let myScoreArr = getFilteredArray(subjectiveScores, true);
  let myAvgScore = (getTotalScore(myScoreArr) / myScoreArr.length || 0).toFixed(
    1
  );

  const [pageState, setPageState] = useState(OVERVIEWPAGESTATE.OVERVIEW);
  const [activeImage, setActiveImage] = useState(null);
  return (
    <>
      {pageState === OVERVIEWPAGESTATE.SHARETEMPLATE ? (
        <ShareTemplate setPageState={setPageState}></ShareTemplate>
      ) : (
        <div className="row tab-panel-container overview-container">
          <div className="col-sm-8">
            <div className="card">
              <div className="row">
                <div className="col-1 col-xs-1">
                  <div className="name-icon">
                    {name?.substr(0, 1)?.toUpperCase()}
                  </div>
                </div>
                <div className="col-11 col-sm-10 col-xs-10">
                  <div className="row overview-container__details">
                    <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12">
                      <div className="overview-container__heading">
                        {name} <span className="material-icons">star</span>
                      </div>
                    </div>
                    <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                      <span className="overview-container__last-updated">
                        Last updated:
                      </span>
                      <span className="overview-container__last-updated__date">
                        More than {updatedMonth || 0} months ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <p className="overview-container__startup-overview">
                    {section?.val}
                  </p>
                </div>
              </div>
              <div className="row overview-notata-info">
                <div className="col-sm-6 col-xs-6 overview-notata-info__slidedeck">
                  {slideDeck && (
                    <Button endIcon={<Icon>arrow_forward_ios</Icon>}>
                      SLIDE DECK
                    </Button>
                  )}
                </div>
                <div className="col-sm-6 col-xs-6 overview-notata-info__web">
                  <a href={website?.val} target="_blank">
                    {website?.val}
                  </a>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="row overview-container__scores">
                <div className="overview-container__scores__heading">
                  Subjective Scores
                </div>
                <div className="col-sm-6 col-md-3 col-xs-12 overview-container__scores__label">
                  <div>You</div>
                  <div className="score selected you">{myAvgScore}</div>
                </div>
                <div className="col-sm-6 col-md-4 col-xs-6 overview-container__scores__label">
                  <div>Your Team</div>
                  <div className="score">{teamAvg}</div>
                  <div className="highest-score">
                    {teamMaxScore} <span className="highest">HIGHEST</span>
                  </div>
                  <div className="lowest-score">
                    {teamMinScore} <span className="lowest">LOWEST</span>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4 col-xs-6 overview-container__scores__label">
                  <div>External Experts</div>
                  <div className="score">8.5</div>
                  <div className="highest-score">
                    10 <span className="highest">HIGHEST</span>
                  </div>
                  <div className="lowest-score">
                    5.5 <span className="lowest">LOWEST</span>
                  </div>
                </div>
                <div className="col-sm-6 col-md-5 col-xs-6 overview-container__scores__label">
                  <div>Groups</div>
                  <div className="score">8.5</div>
                  <div className="highest-score">
                    10 <span className="highest">HIGHEST</span>
                  </div>
                  <div className="lowest-score">
                    5.5 <span className="lowest">LOWEST</span>
                  </div>
                </div>
              </div>
              <div className="separator"></div>
              <div className="row overview-container__scores evaluations-scores">
                <div className="overview-container__scores__heading">
                  Evaluation summaries
                </div>
                {evaluationSummaries.map(evalution => {
                  return (
                    <div
                      className="col-sm-6 col-md-6 col-xs-6 overview-container__scores__label"
                      key={evalution.templateId}
                    >
                      <div>{evalution.templateName}</div>
                      <div className="score">{`${
                        evalution.averagePercentageScore || 0
                      }%`}</div>
                      <div className="highest-score">
                        {`${evalution.highestScore || 0}%`}{" "}
                        <span className="highest">HIGHEST</span>
                      </div>
                      <div className="lowest-score">
                        {`${evalution.lowestScore || 0}%`}{" "}
                        <span className="lowest">LOWEST</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="separator"></div>
              <div className="row tags-container">
                <div className="tags-container__heading">Tags</div>
                <div className="tags-container__sub-heading">
                  Write or choose tags
                </div>
                <Tags />
              </div>
              <div className="row impact-goals-container">
                <div className="impact-goals-container__heading">
                  Impact Goals
                </div>
                <div className="impact-goals-container__sub-heading">
                  Write or choose tags
                </div>
                {images.map(item => {
                  return (
                    <div
                      key={item.key}
                      onClick={() => setActiveImage(item.key)}
                      className={`col-sm-4 col-md-3 col-lg-2 col-xs-4 img-col ${
                        activeImage === item.key ? "active-img-col" : ""
                      }`}
                    >
                      <img src={item.src}></img>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card similar-startup-card">
              <div className="row similar-startups-contianer">
                <div className="similar-startups-contianer__heading">
                  Similar Startups
                </div>
                <div className="col-sm-12 similar-startups-contianer__table-container">
                  <table>
                    <thead>
                      <tr className="grid-header">
                        <th>COMPANY NAME</th>
                        <th>TAGS</th>
                        <th>SUBJECTIVE SCORE</th>
                        <th>LAST EVALUATION</th>
                        <th>UPDATED</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="company-name">
                          <span className="icon">G</span>
                          <span className="name">Great Startup Inc</span>
                        </td>
                        <td>
                          <div className="tags-container__placeholder">
                            <div className="tag">Hardware</div>
                            <div className="tag">Hardware</div>
                          </div>
                        </td>
                        <td>
                          <div className="subjective-score">8,5</div>
                        </td>
                        <td>
                          <span className="last-evaluation">65%</span>
                          <span className="last-eval-description">
                            First
                            <br />
                            Impression
                          </span>
                        </td>
                        <td>
                          <span className="updated-date">Jan 25, 2020</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="company-name">
                          <span className="icon">G</span>
                          <span className="name">Great Startup Inc</span>
                        </td>
                        <td>
                          <div className="tags-container__placeholder">
                            <div className="tag">Hardware</div>
                            <div className="tag">Hardware</div>
                          </div>
                        </td>
                        <td>
                          <div className="subjective-score">8,5</div>
                        </td>
                        <td>
                          <span className="last-evaluation">65%</span>
                          <span className="last-eval-description">
                            First
                            <br />
                            Impression
                          </span>
                        </td>
                        <td>
                          <div className="updated-date-tag updated-date">
                            Older than 2 month
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="card similar-startup-card">
              <div className="row similar-startups-contianer">
                <div className="similar-startups-contianer__heading">
                  Sharing startup template
                </div>
                <div className="similar-startups-contianer__sub-heading">
                  Do you want to share info about startup with a network outside
                  Notata?
                </div>
                <div className="col-sm-12 similar-startups-contianer__table-container">
                  <table>
                    <thead>
                      <tr className="grid-header">
                        <th>SHARED WITH</th>
                        <th>SENT</th>
                        <th>LASST OPENED</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="email">daria@leverageux.com</td>
                        <td className="sent">Jan 25, 2020</td>
                        <td className="sent">Jan 25, 2020</td>
                        <td>
                          <div
                            className="share-same-template"
                            onClick={() =>
                              setPageState(OVERVIEWPAGESTATE.SHARETEMPLATE)
                            }
                          >
                            <i class="fa fa-clone" aria-hidden="true"></i>
                            <span className="text">Share same template</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="email">daria@leverageux.com</td>
                        <td className="sent">Jan 25, 2020</td>
                        <td className="sent">Jan 25, 2020</td>
                        <td>
                          <div
                            className="share-same-template"
                            onClick={() =>
                              setPageState(OVERVIEWPAGESTATE.SHARETEMPLATE)
                            }
                          >
                            <i class="fa fa-clone" aria-hidden="true"></i>
                            <span className="text">Share same template</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="email">daria@leverageux.com</td>
                        <td className="sent">Jan 25, 2020</td>
                        <td className="sent">Jan 25, 2020</td>
                        <td>
                          <div
                            className="share-same-template"
                            onClick={() =>
                              setPageState(OVERVIEWPAGESTATE.SHARETEMPLATE)
                            }
                          >
                            <i class="fa fa-clone" aria-hidden="true"></i>
                            <span className="text">Share same template</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="email">daria@leverageux.com</td>
                        <td className="sent">Jan 25, 2020</td>
                        <td className="sent">Jan 25, 2020</td>
                        <td>
                          <div
                            className="share-same-template"
                            onClick={() =>
                              setPageState(OVERVIEWPAGESTATE.SHARETEMPLATE)
                            }
                          >
                            <i class="fa fa-clone" aria-hidden="true"></i>
                            <span className="text">Share same template</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <ButtonWithIcon
                    iconName="add"
                    className="add-btn"
                    text="ADD"
                    iconPosition={ICONPOSITION.START}
                  ></ButtonWithIcon>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6">
                <ButtonWithIcon
                  iconName="add"
                  className="text-center archive-btn"
                  text="ARCHIEVE STARTUP"
                  iconPosition={ICONPOSITION.NONE}
                ></ButtonWithIcon>
              </div>
              <div className="col-xs-6 col-sm-6">
                <ButtonWithIcon
                  iconName="add"
                  className="text-center delete-btn"
                  text="DELETE STARTUP PERMANENTLY"
                  iconPosition={ICONPOSITION.NONE}
                ></ButtonWithIcon>
              </div>
            </div>
          </div>
          <div className="col-sm-4 col-xs-12 col-md-4 ">
            <div className="card discussion-card">
              <div className="row discussions-contianer">
                <div className="discussions-contianer__heading">
                  Discussion about startup
                </div>
                <div className="discussions-contianer__sub-heading">
                  Notes from you and your team
                </div>
                <div className="row discussions-contianer__disucssions">
                  <div className="discussions-contianer__disucssions__discussion">
                    <div>
                      <i class="fa fa-comments-o" aria-hidden="true"></i>
                      <span className="discussions-contianer__disucssions__sender">
                        Stephanie Wykoff
                      </span>
                    </div>
                    <div className="discussions-contianer__disucssions__message">
                      This startup is really well!
                    </div>
                    <div className="discussions-contianer__disucssions__date">
                      Jan 28, 2021 10:53 PM
                    </div>
                  </div>
                  <div className="separator"></div>
                  <div className="discussions-contianer__disucssions__discussion">
                    <div>
                      <i class="fa fa-comments-o" aria-hidden="true"></i>
                      <span className="discussions-contianer__disucssions__sender">
                        You
                      </span>
                    </div>
                    <div className="discussions-contianer__disucssions__message">
                      This startup is really well!
                    </div>
                    <div className="discussions-contianer__disucssions__date">
                      Jan 28, 2021 10:53 PM
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12">
                    <input
                      className="discussions-contianer__disucssions__text"
                      type="search"
                    />
                    <span class="discussions-contianer__disucssions__send-icon">
                      <button class="btn btn-outline-secondary" type="button">
                        <i class="fa fa-paper-plane"></i>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
