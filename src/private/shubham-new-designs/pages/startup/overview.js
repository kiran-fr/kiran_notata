import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import "./overview.scss";
import images from "./Images/";
import { ICONPOSITION, OVERVIEWPAGESTATE } from "../constants";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import ShareTemplate from "./share-template";
import Tags from "../ui-kits/tags";
import { Modal } from "../../../../Components/UI_Kits/Modal/Modal";

export default function Overview() {
  const [pageState, setPageState] = useState(OVERVIEWPAGESTATE.OVERVIEW);
  const [showTagsModal, setShowTagsModal] = useState(false);
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
                  <div className="name-icon">G</div>
                </div>
                <div className="col-11 col-sm-10 col-xs-10">
                  <div className="row overview-container__details">
                    <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12">
                      <div className="overview-container__heading">
                        Great Startup Inc{" "}
                        <span className="material-icons">star</span>
                      </div>
                    </div>
                    <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12">
                      <span className="overview-container__last-updated">
                        Last updated:
                      </span>
                      <span className="overview-container__last-updated__date">
                        More than 3 months ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-xs-12">
                <p className="overview-container__startup-overview">
                  Great Startup is a simple tool for investors to evaluate
                  startups and engage their network.
                </p>
              </div>
              <div className="row overview-notata-info">
                <div className="col-sm-6 col-xs-6 overview-notata-info__slidedeck">
                  <Button endIcon={<Icon>arrow_forward_ios</Icon>}>
                    SLIDE DECK
                  </Button>
                </div>
                <div className="col-sm-6 col-xs-6 overview-notata-info__web">
                  WWW.NOTATA.IO
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
                  <div className="score selected you">8.5</div>
                </div>
                <div className="col-sm-6 col-md-4 col-xs-6 overview-container__scores__label">
                  <div>Your Team</div>
                  <div className="score">8.5</div>
                  <div className="highest-score">
                    10 <span className="highest">HIGHEST</span>
                  </div>
                  <div className="lowest-score">
                    5.5 <span className="lowest">LOWEST</span>
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
                <div className="col-sm-6 col-md-6 col-xs-6 overview-container__scores__label">
                  <div>First Impression</div>
                  <div className="score">65%</div>
                  <div className="highest-score">
                    35% <span className="highest">HIGHEST</span>
                  </div>
                  <div className="lowest-score">
                    80% <span className="lowest">LOWEST</span>
                  </div>
                </div>
                <div className="col-sm-6 col-md-6 col-xs-6 overview-container__scores__label">
                  <div>Before Pitching</div>
                  <div className="score">65%</div>
                  <div className="highest-score">
                    35% <span className="highest">HIGHEST</span>
                  </div>
                  <div className="lowest-score">
                    80% <span className="lowest">LOWEST</span>
                  </div>
                </div>
                <div className="col-sm-6 col-md-6 col-xs-6 overview-container__scores__label">
                  <div>After Pitching</div>
                  <div className="score">65%</div>
                  <div className="highest-score">
                    35% <span className="highest">HIGHEST</span>
                  </div>
                  <div className="lowest-score">
                    80% <span className="lowest">LOWEST</span>
                  </div>
                </div>
              </div>
              <div className="separator"></div>
              <div className="row tags-container overview-tags">
                <div className="tags-container__heading">Tags</div>
                <div className="tags-container__sub-heading">
                  Write or choose tags
                </div>
                <div className="tags-container__placeholder">
                  <i
                    class="fa fa-plus"
                    aria-hidden="true"
                    onClick={() => setShowTagsModal(true)}
                  ></i>
                </div>
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
                      className="col-sm-4 col-md-3 col-lg-2 col-xs-4 img-col"
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
      {showTagsModal && (
        <Modal
          title="Add Tags"
          submit={() => {
            setShowTagsModal(false);
          }}
          close={() => {
            setShowTagsModal(false);
          }}
          submitTxt="Save"
          closeTxt="Cancel"
          children={<Tags></Tags>}
        ></Modal>
      )}
    </>
  );
}
