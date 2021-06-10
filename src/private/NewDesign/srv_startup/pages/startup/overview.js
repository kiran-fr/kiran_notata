import React, { useState } from "react";
import moment from "moment";
import "./overview.scss";
import images from "./Images/";
import { ICONPOSITION, OVERVIEWPAGESTATE } from "../constants";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import ShareTemplate from "./share-template";
import TagsModal from "../ui-kits/TagsModal";
import { Modal } from "../../../../../Components/UI_Kits/Modal/Modal";
import AddFunnel from "../../../../NewDesign/Startup/DealFlow/addFunnel";
import SubjectiveScoreModal from "../../../Startup/Modal/SubjectiveScoreModal";
import { Dropdown } from "../../../../../Components/UI_Kits/Dropdown";
import DeleteStartup from "./delete-startup";
import ArchiveList from "./archive-list";
import CreateNewGroup from "../startup/groups-individuals/create-new-group/create-new-group";
import { useQuery, useMutation } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";
import {
  connectionPut,
  connectionDelete,
  connectionFunnelTagAdd,
} from "private/Apollo/Mutations";
import More from "assets/images/more.svg";

import CommentBox from "../CommentBox";

export default function Overview(props) {
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [mutateConnectionPut] = useMutation(connectionPut);
  const [mutateConnectionDelete] = useMutation(connectionDelete);

  // Mutation updating funnel tag for connection
  const [mutate] = useMutation(connectionFunnelTagAdd);

  // const updateFunnelTag = async (funnelTagId, connectionId) => {
  //   const variables = {
  //     connectionId,
  //     funnelTagId,
  //   };
  //   await mutate({
  //     variables,
  //   });
  // };

  const items = [
    { id: 1, name: "First" },
    { id: 2, name: "Before" },
    { id: 3, name: "After" },
  ];
  const {
    creativity: {
      creative,
      id,
      subjectiveScores,
      updatedAt,
      evaluationSummaries,
    },
  } = props;
  const { answers, name } = creative;

  const updatedMonth = moment(new Date())
    .diff(updatedAt, "months", true)
    .toFixed(0);

  let section = answers?.find(i => i.questionId === "q01_section_info");
  let website = answers?.find(i => i.questionId === "q06_section_info");
  let slideDeck = answers?.find(i => i.questionId === "q01_section_materials");

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
  const [activeImage, setActiveImage] = useState([]);
  const [pageState, setPageState] = useState(OVERVIEWPAGESTATE.OVERVIEW);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showSubjectiveScore, setShowSubjectiveScore] = useState();

  const connectionData = { id: id, subjectiveScores: subjectiveScores };
  const { data: connectionsGetData } = useQuery(connectionsGet, {
    variables: {
      filters: {
        similarTo: id,
      },
    },
  });
  let similarConnections = connectionsGetData?.connectionsGet;
  const getCompAvg = subjectiveScores => {
    if (subjectiveScores) {
      return (
        getTotalScore(subjectiveScores) / subjectiveScores.length || 0
      ).toFixed(1);
    }
    return 0;
  };

  const archiveConnection = async (connectionId, archive) => {
    let variables = {
      id: connectionId,
      input: {
        archived: archive,
      },
    };
    let res_connection = await mutateConnectionPut({ variables });
    setPageState(OVERVIEWPAGESTATE.ARCHIVElIST);
  };

  const deleteConnection = async connectionId => {
    let deleteConnection = await mutateConnectionDelete({
      variables: { id: connectionId },
    });
    setPageState(OVERVIEWPAGESTATE.ARCHIVElIST);
  };

  if (showSubjectiveScore) {
    return (
      <SubjectiveScoreModal
        connection={connectionData}
        close={() => setShowSubjectiveScore(undefined)}
      />
    );
  }

  return (
    <>
      {pageState === OVERVIEWPAGESTATE.SHARETEMPLATE ? (
        <ShareTemplate
          companyName={name}
          setPageState={setPageState}
        ></ShareTemplate>
      ) : pageState === OVERVIEWPAGESTATE.ARCHIVElIST ? (
        <ArchiveList
          setPageState={setPageState}
          archiveConnection={archiveConnection}
          deleteConnection={deleteConnection}
        />
      ) : (
        <div className="row tab-panel-container overview-container">
          <div className="col-sm-8">
            <div className="card overviewContainer">
              <div className="companyOverview">
                <div className="companyIcon">
                  <div className="icon">
                    <span>{name?.substr(0, 1)?.toUpperCase()}</span>
                  </div>
                </div>
                <div className="companyDetails">
                  <div className="companyNameContainer">
                    <div className="companyName">{name}</div>
                    <div className="companyLastUpdated">
                      Last updated:
                      <span>More than {updatedMonth || 0} months ago</span>
                    </div>
                  </div>
                  <div className="companyOneLiner">
                    <p>{section?.val}</p>
                    <div className="slideDeckContainer">
                      <div className="slideDeckButton">
                        {/* {slideDeck && ( */}
                        <button>SLIDE DECK</button>
                        <svg
                          viewBox="0 0 6 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.540537 0.159839L0.210697 0.487403C0.107688 0.590493 0.0509398 0.727648 0.0509398 0.874234C0.0509398 1.02074 0.107688 1.15806 0.210697 1.26115L3.94747 4.99776L0.206551 8.73869C0.103542 8.84162 0.046875 8.97893 0.046875 9.12544C0.046875 9.27195 0.103542 9.40934 0.206551 9.51235L0.534359 9.84C0.747531 10.0533 1.09477 10.0533 1.30794 9.84L5.77798 5.38598C5.8809 5.28305 5.95343 5.1459 5.95343 4.99809L5.95343 4.99638C5.95343 4.8498 5.88082 4.71264 5.77798 4.60971L1.32006 0.159839C1.21713 0.0567483 1.07583 0.000163033 0.929321 -3.85729e-08C0.782734 -3.21654e-08 0.643383 0.0567484 0.540537 0.159839Z"
                            fill="white"
                          />
                        </svg>

                        {/* )} */}
                      </div>
                      <div className="overviewWebsite">
                        <a href={website?.val} target="_blank">
                          {website?.val}www.notata.io
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="companyOneLinerBig">
                <p>{section?.val}</p>
              </div>
              <div className="slideDeckContainerBig">
                <div className="slideDeckButton">
                  {/* {slideDeck && ( */}
                  <button>SLIDE DECK</button>
                  <svg
                    viewBox="0 0 6 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.540537 0.159839L0.210697 0.487403C0.107688 0.590493 0.0509398 0.727648 0.0509398 0.874234C0.0509398 1.02074 0.107688 1.15806 0.210697 1.26115L3.94747 4.99776L0.206551 8.73869C0.103542 8.84162 0.046875 8.97893 0.046875 9.12544C0.046875 9.27195 0.103542 9.40934 0.206551 9.51235L0.534359 9.84C0.747531 10.0533 1.09477 10.0533 1.30794 9.84L5.77798 5.38598C5.8809 5.28305 5.95343 5.1459 5.95343 4.99809L5.95343 4.99638C5.95343 4.8498 5.88082 4.71264 5.77798 4.60971L1.32006 0.159839C1.21713 0.0567483 1.07583 0.000163033 0.929321 -3.85729e-08C0.782734 -3.21654e-08 0.643383 0.0567484 0.540537 0.159839Z"
                      fill="white"
                    />
                  </svg>

                  {/* )} */}
                </div>
                <div className="overviewWebsite">
                  <a href={website?.val} target="_blank">
                    {website?.val}www.notata.io
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
                  <div>
                    You
                    <span className="your_updated-date-tag">
                      {updatedAt ? moment(updatedAt).format("ll") : ""}
                    </span>
                  </div>

                  <div>
                    <span className="score selected you">
                      {parseFloat(myAvgScore)}
                    </span>
                    <i
                      onClick={() => setShowSubjectiveScore(true)}
                      className=" editMarker fas fa-pen"
                    ></i>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4 col-xs-6 overview-container__scores__label">
                  <div>Your Team</div>
                  <div className="score">{parseFloat(teamAvg)}</div>
                  <div className="highest-score">
                    {teamMaxScore} <span className="highest">HIGHEST</span>
                  </div>
                  <div className="lowest-score">
                    {teamMinScore} <span className="lowest">LOWEST</span>
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
              <div className="row tags-container overview-tags">
                <div className="tags-container__heading">Tags</div>
                <div className="tags-container__sub-heading">
                  Write or choose tags
                </div>
                <div className="tags-container__placeholder">
                  {props.creativity.tags.length > 0
                    ? props.creativity.tags.slice(0, 2).map(el => (
                        <span
                          style={{
                            height: "100%",
                            color: "white",
                            padding: "2px 10px",
                            backgroundColor: "#555",
                            borderRadius: 15,
                            fontSize: 10,
                            marginTop: 1,
                            marginRight: 7,
                            marginBottom: 4,
                          }}
                          key={el.id}
                        >
                          {el.group.name} : {el.name}
                        </span>
                      ))
                    : ""}
                  {props.creativity.tags.length > 2 ? (
                    <img
                      src={More}
                      alt=""
                      onClick={() => setShowTagsModal(true)}
                    />
                  ) : null}
                  <i
                    className="fa fa-plus"
                    aria-hidden="true"
                    onClick={() => setShowTagsModal(true)}
                  ></i>
                </div>
              </div>
              <div className="row funnel-summary-container">
                <div className="overview-container__scores__heading">
                  Funnels
                </div>
                <AddFunnel
                // companyId={props.creativity.id}
                // updateFunnelTag={updateFunnelTag}
                />
              </div>
              <div className="row groups-container">
                <div className="overview-container__scores__heading">
                  Groups
                </div>
                <div className="col-sm-4 col-xs-12 group-name">
                  Group 1, Big group 2
                </div>
                <div className="col-sm-8 col-xs-12 add-startup-container">
                  <span className="add-text">Add startup to a group</span>
                  <span className="add-startup-to-group">
                    <Dropdown title="" items={items}></Dropdown>
                    <span className="green_plus">
                      <i
                        className="fa fa-plus"
                        aria-hidden="true"
                        onClick={() => setCreateGroupModal(true)}
                      ></i>
                    </span>
                  </span>
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
                      onClick={() => setActiveImage([...activeImage, item.key])}
                      className={`col-sm-4 col-md-3 col-lg-2 col-xs-4 img-col ${
                        activeImage.includes(item.key) ? "active-img-col" : ""
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
                        {/* <th>LAST EVALUATION</th> */}
                        <th>UPDATED</th>
                      </tr>
                    </thead>
                    <tbody>
                      {similarConnections?.map(company => (
                        <tr
                          className="connection-link"
                          onClick={() =>
                            props.redirectToCompanyPage(company.id)
                          }
                        >
                          <td className="company-name">
                            <span className="icon">
                              {company?.creative?.name
                                ?.substr(0, 1)
                                ?.toUpperCase()}
                            </span>
                            <span className="name">
                              {company?.creative?.name}
                            </span>
                          </td>
                          <td>
                            <div className="tag-placeholder">
                              {company?.tags?.slice(0, 2).map(tag => (
                                <span className="tag">{tag.name}</span>
                              ))}
                              {company?.tags?.length > 2 ? (
                                <img src={More} alt=""></img>
                              ) : null}
                            </div>
                          </td>
                          <td>
                            <div
                              className="subjective-score"
                              style={{
                                filter:
                                  getCompAvg(company.subjectiveScores) === "0.0"
                                    ? "grayscale(0%)"
                                    : "",
                              }}
                            >
                              {getCompAvg(company.subjectiveScores)}
                            </div>
                          </td>
                          <td>
                            <span className="updated-date">
                              {moment(company.updatedAt).format("ll")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6 col-sm-6">
                <ButtonWithIcon
                  iconName="add"
                  className="text-center archive-btn"
                  text="ARCHIVE STARTUP"
                  iconPosition={ICONPOSITION.NONE}
                  onClick={() => setArchiveModal(true)}
                ></ButtonWithIcon>
                <div
                  className="open-archive"
                  onClick={() => setPageState(OVERVIEWPAGESTATE.ARCHIVElIST)}
                >
                  Open Archive
                </div>
              </div>
              <div className="col-xs-6 col-sm-6">
                <ButtonWithIcon
                  iconName="add"
                  className="text-center delete-btn"
                  text="DELETE STARTUP PERMANENTLY"
                  iconPosition={ICONPOSITION.NONE}
                  onClick={() => setDeleteModal(true)}
                />
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
                <CommentBox connectionId={id} />
              </div>
            </div>
          </div>
        </div>
      )}
      {createGroupModal && (
        <Modal
          title="Create new group"
          submit={() => {
            setCreateGroupModal(false);
          }}
          close={() => {
            setCreateGroupModal(false);
          }}
          submitTxt="Create"
          closeTxt="Cancel"
          children={<CreateNewGroup></CreateNewGroup>}
        />
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
          disableFoot={true}
          closeTxt="Cancel"
          children={<TagsModal connection={props.creativity}></TagsModal>}
        ></Modal>
      )}
      {archiveModal && (
        <Modal
          title="Archive startup"
          submit={() => {
            setArchiveModal(false);
            archiveConnection(id, true);
          }}
          close={() => setArchiveModal(false)}
          submitTxt="Archive"
          closeTxt="CANCEL"
          children={
            <div className="archive-modal-description">
              After archiving startup still will be available in reports
              section.
            </div>
          }
        />
      )}
      {deleteModal && (
        <Modal
          title="Archive startup"
          submit={() => {
            deleteConnection(id);
            setDeleteModal(false);
          }}
          close={() => setDeleteModal(false)}
          submitTxt="Delete"
          submitButtonStyle="secondary"
          closeTxt="CANCEL"
          intermidate={() => {
            setDeleteModal(false);
            archiveConnection(id, true);
          }}
          intermidateTxt="Archive"
          children={<DeleteStartup></DeleteStartup>}
        />
      )}
    </>
  );
}
