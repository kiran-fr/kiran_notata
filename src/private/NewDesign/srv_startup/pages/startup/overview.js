import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import "./overview.scss";
import images from "./Images/";
import { ICONPOSITION, OVERVIEWPAGESTATE } from "../constants";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import ShareTemplate from "./share-template";
import TagsModal from "../ui-kits/TagsModal";
import { Modal } from "../../../../../Components/UI_Kits/Modal/Modal";
import Funels from "./funels";
import SubjectiveScoreModal from "../../../Startup/Modal/SubjectiveScoreModal";
import { Dropdown } from "../../../../../Components/UI_Kits/Dropdown";
import DeleteStartup from "./delete-startup";
import ArchiveList from "./archive-list";
import CreateNewGroup from "../startup/groups-individuals/create-new-group/create-new-group";
import { useQuery, useMutation } from "@apollo/client";
import { connectionsGet } from "private/Apollo/Queries";
import { connectionPut, connectionDelete } from "private/Apollo/Mutations";
import TextBox from "../ui-kits/text-box";
import { logCreate, logDelete, logUpdate } from "private/Apollo/Mutations";
import More from "assets/images/more.svg";

function CommentBox() {
  return "THIS IS A COMMENT BOX!";
}

export default function Overview(props) {
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [mutationlogCreate] = useMutation(logCreate);
  const [mutationlogUpdate] = useMutation(logUpdate);
  const [mutationlogDelete] = useMutation(logDelete);
  const [comments, setComments] = useState([]);
  const [mutateConnectionPut] = useMutation(connectionPut);
  const [mutateConnectionDelete] = useMutation(connectionDelete);
  const [editChat, setEditChat] = useState(false);
  const [hidden, setHidden] = useState({});

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
      log,
    },
  } = props;
  const { answers, name } = creative;

  useEffect(() => {
    let comments = log?.filter(l => l.logType === "COMMENT");
    setComments(comments);
  }, [log]);

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
  const [message, setMessage] = useState(null);
  const [updatemessage, setUpdateMessage] = useState(null);

  const connectionData = { id: id, subjectiveScores: subjectiveScores };
  const { data: connectionsGetData, loading, error } = useQuery(
    connectionsGet,
    {
      variables: {
        filters: {
          similarTo: id,
        },
      },
    }
  );
  let similarConnections = connectionsGetData?.connectionsGet;
  const getCompAvg = subjectiveScores => {
    if (subjectiveScores) {
      return (
        getTotalScore(subjectiveScores) / subjectiveScores.length || 0
      ).toFixed(1);
    }
    return 0;
  };

  const handleMessageChange = e => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleUpdateMessageChange = e => {
    const { value } = e.target;
    setUpdateMessage(value);
  };

  const saveComment = async () => {
    if (message) {
      let variables = {
        connectionId: id,
        input: {
          logType: "COMMENT",
          dataPairs: {
            val: message,
            key: "TEXT",
          },
        },
      };
      let logConnection = await mutationlogCreate({ variables });
      let savedLog = logConnection?.data?.logCreate;
      setMessage("");
      if (savedLog) {
        setComments([...comments, savedLog]);
      }
    }
  };

  const UpdateChat = async (CommentID, INTVAL, index) => {
    let variables = {
      id: CommentID,
      input: {
        logType: "COMMENT",
        dataPairs: [
          {
            key: "TEXT",
            val: INTVAL,
          },
        ],
      },
    };
    let logConnection = await mutationlogUpdate({ variables });
    let savedLog = logConnection?.data?.logUpdate;
    setMessage("");
    if (savedLog) {
      let updatedComments = comments?.filter(l => l.logType === "COMMENT");
      setComments(updatedComments);
      setEditComment(index);
    }
  };

  const setEditComment = async index => {
    setHidden({ [index]: !hidden[index] });
    setEditChat(true);
  };

  const archiveConnection = async (connectionId, archive) => {
    console.log(id, archive);
    let variables = {
      id: connectionId,
      input: {
        archived: archive,
      },
    };
    let res_connection = await mutateConnectionPut({ variables });
    let connection = res_connection?.data?.connectionCreate;
    setPageState(OVERVIEWPAGESTATE.ARCHIVElIST);
  };

  const deleteConnection = async connectionId => {
    let deleteConnection = await mutateConnectionDelete({
      variables: { id: connectionId },
    });
    let message = deleteConnection?.data?.message;
    setPageState(OVERVIEWPAGESTATE.ARCHIVElIST);
  };

  const deleteComment = async logId => {
    if (logId) {
      let logConnection = await mutationlogDelete({ variables: { id: logId } });
      let msg = logConnection?.data?.logDelete?.message;
      if (msg) {
        let updatedComments = comments?.filter(comment => comment.id !== logId);
        setComments(updatedComments);
      }
    }
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
                {/* <div className="col-sm-6 col-md-4 col-xs-6 overview-container__scores__label">
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
                </div> */}
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
                    class="fa fa-plus"
                    aria-hidden="true"
                    onClick={() => setShowTagsModal(true)}
                  ></i>
                </div>
              </div>
              <div className="row funnel-summary-container">
                <div className="overview-container__scores__heading">
                  Funnels
                </div>
                <Funels></Funels>
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
                        class="fa fa-plus"
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
                            {
                              ("SS",
                              console.log(getCompAvg(company.subjectiveScores)))
                            }
                            {console.log(
                              typeof getCompAvg(company.subjectiveScores)
                            )}
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
                          {/* <td>
                            <div>
                              {company?.evaluationSummaries
                                ?.slice(0)
                                ?.map(summary => (
                                  <>
                                    <span className="last-evaluation">
                                      {summary.averagePercentageScore || 0}%
                                    </span>
                                    <span className="last-eval-description">
                                      {summary?.templateName &&
                                        summary?.templateName
                                          ?.split(" ")
                                          ?.map(name => (
                                            <>
                                              {name}
                                              <br />
                                            </>
                                          ))}
                                    </span>
                                  </>
                                ))}
                            </div>
                          </td> */}
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
                  text="ARCHIEVE STARTUP"
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
                {/* <CommentBox comments={}></CommentBox> */}
                <div className="commentBox">
                  <div className="comments">
                    {comments?.map((comment, index) => (
                      <div className="comment">
                        <div className="commentHead">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0)">
                              <path
                                d="M21.9208 17.2663L20.6431 13.5476C21.259 12.2885 21.5845 10.8883 21.5866 9.47935C21.5904 7.02957 20.6426 4.71325 18.9178 2.95711C17.1926 1.20063 14.8936 0.211878 12.4444 0.173077C9.90475 0.132944 7.51757 1.09897 5.7229 2.89361C3.99237 4.62409 3.03253 6.90543 3.00215 9.34331C1.29655 10.6275 0.28983 12.6296 0.293139 14.7681C0.294729 15.7689 0.519971 16.7636 0.946781 17.6632L0.0666502 20.2245C-0.0846431 20.6648 0.0258727 21.1429 0.3551 21.4721C0.586788 21.7038 0.892253 21.8272 1.2064 21.8272C1.33857 21.8272 1.47229 21.8054 1.6027 21.7605L4.16403 20.8804C5.06358 21.3072 6.05835 21.5325 7.0591 21.534C7.06271 21.534 7.06614 21.534 7.06975 21.534C9.24011 21.534 11.2575 20.5013 12.537 18.7539C13.8685 18.7188 15.1858 18.3965 16.3768 17.8139L20.0955 19.0917C20.2504 19.1449 20.4093 19.1709 20.5664 19.1709C20.9397 19.1709 21.3027 19.0243 21.5781 18.7488C21.9693 18.3576 22.1006 17.7895 21.9208 17.2663ZM7.06967 20.2245C7.06687 20.2245 7.06391 20.2245 7.06112 20.2245C6.17536 20.2232 5.29574 20.0048 4.51753 19.5931C4.35752 19.5085 4.16966 19.4938 3.99856 19.5526L1.37217 20.4551L2.27465 17.8288C2.33343 17.6576 2.31882 17.4698 2.23417 17.3098C1.82244 16.5315 1.60407 15.652 1.6027 14.7662C1.60051 13.3413 2.15476 11.9909 3.12401 10.9797C3.44061 12.9096 4.36044 14.6881 5.78623 16.0886C7.2015 17.4786 8.98049 18.3637 10.9 18.6531C9.88645 19.6521 8.52021 20.2245 7.06967 20.2245ZM20.652 17.8229C20.6148 17.8601 20.5706 17.8703 20.5209 17.8532L16.54 16.4852C16.4708 16.4614 16.3989 16.4497 16.3272 16.4497C16.2216 16.4497 16.1163 16.4752 16.021 16.5257C14.8844 17.127 13.5999 17.4459 12.3065 17.4479C12.3022 17.4479 12.2984 17.4479 12.2941 17.4479C7.96015 17.4479 4.38029 13.9273 4.31163 9.59434C4.27704 7.41217 5.10711 5.36131 6.64887 3.81954C8.19064 2.27778 10.2418 1.44801 12.4237 1.48238C16.7608 1.55117 20.2838 5.13765 20.2771 9.47729C20.2751 10.7707 19.9562 12.0552 19.355 13.1918C19.2703 13.3517 19.2557 13.5396 19.3145 13.7108L20.6824 17.6917C20.6995 17.7416 20.6892 17.7857 20.652 17.8229Z"
                                fill="#53CAB2"
                              />
                              <path
                                d="M16.1945 5.99609H8.39304C8.03141 5.99609 7.73828 6.28927 7.73828 6.65085C7.73828 7.01248 8.03146 7.30561 8.39304 7.30561H16.1945C16.5561 7.30561 16.8492 7.01244 16.8492 6.65085C16.8492 6.28927 16.5561 5.99609 16.1945 5.99609Z"
                                fill="#53CAB2"
                              />
                              <path
                                d="M16.1945 8.6875H8.39304C8.03141 8.6875 7.73828 8.98068 7.73828 9.34226C7.73828 9.70384 8.03146 9.99702 8.39304 9.99702H16.1945C16.5561 9.99702 16.8492 9.70384 16.8492 9.34226C16.8492 8.98068 16.5561 8.6875 16.1945 8.6875Z"
                                fill="#53CAB2"
                              />
                              <path
                                d="M13.1915 11.3789H8.39304C8.03141 11.3789 7.73828 11.6721 7.73828 12.0337C7.73828 12.3953 8.03146 12.6884 8.39304 12.6884H13.1915C13.5531 12.6884 13.8462 12.3952 13.8462 12.0337C13.8462 11.6721 13.5531 11.3789 13.1915 11.3789Z"
                                fill="#53CAB2"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0">
                                <rect width="22" height="22" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <div className="commentUserName">
                            {comment?.isMe
                              ? "You"
                              : `${comment?.createdByUser?.given_name} ${comment?.createdByUser?.family_name}`}
                          </div>
                          {comment?.isMe ? (
                            <div className="commentHeadEditDeleteIcon">
                              <i
                                onClick={() => setEditComment(index)}
                                className="fas fa-pen editIcon"
                              ></i>
                              <i
                                onClick={() => deleteComment(comment.id)}
                                class="fas fa-trash-o deleteIcon"
                              ></i>
                            </div>
                          ) : null}
                        </div>

                        <div>
                          <div className="commentText">
                            {!hidden[index]
                              ? comment?.dataPairs?.length > 0 &&
                                comment?.dataPairs[0].val
                              : ""}
                          </div>
                          {hidden[index] && editChat ? (
                            <div className="editBox">
                              <div>
                                <TextBox
                                  inputval={
                                    comment?.dataPairs?.length > 0 &&
                                    comment?.dataPairs[0].val
                                  }
                                  onChange={handleUpdateMessageChange}
                                />
                              </div>
                              <div className="editBoxButtons">
                                <button
                                  className="editCancel"
                                  onClick={() => setEditComment(index)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="editSave"
                                  onClick={() =>
                                    UpdateChat(comment.id, updatemessage, index)
                                  }
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        {!hidden[index] ? (
                          <div className="commentTime">
                            {moment(comment.createdAt).format("lll")}{" "}
                            {comment.createdAt !== comment.updatedAt && (
                              <span>(edited)</span>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="commentInput">
                    <input
                      type="input"
                      name="message"
                      placeholder="Enter Your Comment"
                      autoComplete="off"
                      value={message}
                      onChange={handleMessageChange}
                    />
                    <button type="button" onClick={saveComment}>
                      <i class="fa fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
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
        ></Modal>
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
        ></Modal>
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
        ></Modal>
      )}
    </>
  );
}
