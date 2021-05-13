import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import "./startup-info.scss";
import ShareStartup from "./share-startup";
import share from "../../../../../assets/images/share.png";

import { useParams } from "react-router-dom";

import { useQuery, gql } from "@apollo/client";
import { connectionGet } from "../../../../Apollo/Queries";
// import Faceook from "../../../../assets/images/Faceook.svg"
// import Google from "../../../../assets/images/Google.svg";
// import Linked from "../../../../assets/images/Linked.svg";
// import Twitter from "../../../../assets/images/Twitter.svg";
// import Insta from "../../../../assets/images/Insta.svg";

export default function StartupInfo() {
  const [shareStartup, setshareStartup] = useState(false);

  const [startup, setStartup] = useState({});

  const { id } = useParams();

  const query = gql`
    query connectionGet($id: ID!) {
      connectionGet(id: $id) {
        id
        creative {
          name
          answers {
            id
            val
            sectionName
            questionId
            questionName
          }
        }
      }
    }
  `;

  const { data, called, loading, error } = useQuery(query, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: {
      id,
    },
  });

  console.log(data);

  useEffect(() => {
    setStartup(data?.connectionGet);
  }, [data]);

  function getAnswer(creative, questionId) {
    let items = creative.answers.filter(answer => {
      return answer.questionId === questionId;
    });
    if (!items.length) {
      return "N/A";
    }
    let results = items.map(({ val }) => val);

    return results.join("\n");
  }

  function getSlideDeck() {
    if (getAnswer(startup.creative, "q01_section_materials") === "N/A") {
      return (
        <Button endIcon={<Icon>arrow_forward_ios</Icon>}>SLIDE DECK</Button>
      );
    }
    return <></>;
  }

  return (
    <>
      {shareStartup ? (
        <ShareStartup></ShareStartup>
      ) : (
        <div className="row tab-panel-container startup-info-container">
          <div className="col-sm-7">
            <div className="card">
              <div className="row">
                <div className="col-1 col-xs-1">
                  <div className="name-icon">
                    {startup?.creative?.name[0].toString()}
                  </div>
                </div>
                {/* <div className="col-sm-12">
                  <Button><img src={share}></img>Share Template</Button>
                </div> */}
                <div className="col-11 col-sm-10 col-xs-10">
                  <div className="startup-info-container__details">
                    <div
                      className="startup-info-container__heading"
                      onClick={() => console.log(startup)}
                    >
                      {startup?.creative?.name}
                      <span className="material-icons">star</span>
                    </div>
                    <div className="startup-info-container__location">
                      <span className="material-icons">place</span>
                      <span className="name">
                        {startup?.creative
                          ? getAnswer(startup.creative, "q04_section_info")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  {/* <img src={Faceook} />
                  <img src={Google} />
                  <img src={Linked} />
                  <img src={Twitter} />
                  <img src={Insta} /> */}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="startup-info-container__startup-official">
                    {startup?.creative
                      ? getAnswer(startup.creative, "q05_section_info")
                      : "N/A"}
                  </div>
                  <div className="row startup-info-contact-details">
                    <div className="col-6 col-xs-6 startup-info-contact-details__email">
                      <span class="material-icons">alternate_email</span>
                      <span className="name">
                        {startup?.creative
                          ? getAnswer(startup.creative, "q09_section_info")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="col-6 col-xs-6 startup-info-contact-details__linkedin">
                      <i class="fa fa-linkedin-square fa-lg"></i>
                      <span className="name">
                        {startup?.creative
                          ? getAnswer(startup.creative, "q07_section_info")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="col-6 col-xs-6 startup-info-contact-details__phone">
                      <span class="material-icons">phone_iphone</span>
                      <span className="name">N/A</span>
                    </div>
                    {/* <div className="col-6 col-xs-6 startup-info-contact-details__linkedin">
                      <i class="fa fa-linkedin-square fa-lg"></i>
                      <span className="name">ane nordahl-carlsen</span>
                    </div> */}
                  </div>
                  <div className="row startup-info-notata-info">
                    <div className="col-6 col-xs-6 startup-info-notata-info__web">
                      {startup?.creative
                        ? getAnswer(startup.creative, "q06_section_info")
                        : "N/A"}
                    </div>
                    <div className="col-6 col-xs-6 startup-info-notata-info__slidedeck">
                      {startup?.creative ? getSlideDeck() : <></>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="startup-help-container">
                <div className="col-sm-12">
                  <div className="startup-help-container__heading">
                    One-Liner
                  </div>
                  <p>
                    {startup?.creative
                      ? getAnswer(startup.creative, "q01_section_info")
                      : "N/A"}
                  </p>
                  <div className="startup-help-container__heading">Problem</div>
                  <p>
                    {startup?.creative
                      ? getAnswer(startup.creative, "q02_section_info")
                      : "N/A"}
                  </p>
                  <div className="startup-help-container__heading">
                    Solution
                  </div>
                  <p>
                    {startup?.creative
                      ? getAnswer(startup.creative, "q03_section_info")
                      : "N/A"}
                  </p>
                  <div className="startup-help-container__heading">
                    Terms and conditions
                  </div>
                  <p>
                    {startup?.creative
                      ? getAnswer(startup.creative, "q01_section_terms")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-5 startup-info-demo-container">
            <div className="card">
              <div className="startup-info-demo-container__heading">
                Product Demo
              </div>
              <div className="startup-info-demo-container__video">
                <img src="/images/startupinfo-demo.png"></img>
                <div className="startup-info-demo-container__video-info">
                  <div className="startup-info-demo-container__video-name">
                    {startup?.creative?.name}
                  </div>
                  <div className="startup-info-demo-container__video-source">
                    youtube.com
                  </div>
                </div>
              </div>
              <div className="startup-info-demo-container__sub-heading">
                Business
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Business Model:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q01_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Pricing:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q02_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Product:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q03_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Kind of business:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q04_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  Currently in these markets:
                </div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q05_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Number of founders:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q06_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  Diversity of the founding team:
                </div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q07_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="startup-info-demo-container__sub-heading">
                Money
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Seeking for:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q00_section_money")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Raised soft money:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q01_section_money")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Raised hard money:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q02_section_money")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  Raised money this round:
                </div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q03_section_money")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  Pre-money evaluation:
                </div>
                <div className="col-sm-5 col-xs-5 value">
                  {startup?.creative
                    ? getAnswer(startup.creative, "q04_section_money")
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
