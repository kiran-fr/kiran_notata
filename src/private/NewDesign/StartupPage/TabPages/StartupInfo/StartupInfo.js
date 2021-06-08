import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import "./StartupInfo.scss";
import EditStartupInfo from "./subPages/EditStartupInfo";
import share from "../../../../../assets/images/share.png";
import InviteStartupModal from "./modals/InviteStartupModal";

export default function StartupInfo({ connection }) {
  const [inviteStartUpModal, setInviteStartUpModal] = useState(false);
  const [shareStartup, setShareStartup] = useState(false);

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
    if (getAnswer(connection.creative, "q01_section_materials") === "N/A") {
      return (
        <Button endIcon={<Icon>arrow_forward_ios</Icon>}>SLIDE DECK</Button>
      );
    }
    return <></>;
  }

  const handleCompanyUrl = data => {
    window.open(data);
  };

  return (
    <>
      {shareStartup ? (
        <EditStartupInfo
          backToInfoPage={() => setShareStartup(false)}
          connection={connection}
        />
      ) : (
        <div className="row tab-panel-container startup-info-container">
          <div className="col-sm-7">
            <div className="card">
              <div className="row">
                <div className="col-1 col-xs-1">
                  <div
                    className={`name-icon ${
                      connection?.creative?.logo && "with-logo"
                    }`}
                  >
                    {(!connection?.creative?.logo && (
                      <span>{connection?.creative?.name[0].toString()}</span>
                    )) || (
                      <img
                        src={connection.creative.logo}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }}
                      />
                    )}
                  </div>
                </div>

                <div
                  className="share-btn"
                  onClick={() => setShareStartup(true)}
                >
                  {/*<img src={share} />*/}
                  <i className="fas fa-pen" />
                  <span>Edit info</span>
                </div>

                <div
                  className="share-btn"
                  style={{ top: "60px" }}
                  onClick={() => setInviteStartUpModal(true)}
                >
                  {/*<img src={share} />*/}
                  <i className="fas fa-share-alt" />
                  <span>Invite startup</span>
                </div>

                {/* <div className="col-sm-12">
                  <Button><img src={share}></img>Share Template</Button>
                </div> */}
                <div className="col-11 col-sm-10 col-xs-10">
                  <div className="startup-info-container__details">
                    <div
                      className="startup-info-container__heading"
                      onClick={() => console.log(connection)}
                    >
                      {connection?.creative?.name}
                      <span className="material-icons">star</span>
                    </div>
                    <div className="startup-info-container__location">
                      <span className="material-icons">place</span>
                      <span className="name">
                        {connection?.creative
                          ? getAnswer(connection.creative, "q04_section_info")
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
                    {connection?.creative
                      ? getAnswer(connection.creative, "q05_section_info")
                      : "N/A"}
                  </div>
                  <div className="row startup-info-contact-details">
                    <div className="col-6 col-xs-6 startup-info-contact-details__email">
                      <span class="material-icons">alternate_email</span>
                      <span className="name">
                        {connection?.creative
                          ? getAnswer(connection.creative, "q09_section_info")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="col-6 col-xs-6 startup-info-contact-details__linkedin">
                      <i class="fa fa-linkedin-square fa-lg"></i>
                      <span className="name">
                        {connection?.creative
                          ? getAnswer(connection.creative, "q07_section_info")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="col-6 col-xs-6 startup-info-contact-details__phone">
                      <span class="material-icons">phone_iphone</span>
                      <span className="name">N/A</span>
                    </div>
                    {/* <div className="col-6 col-xs-6 StartupPage-info-contact-details__linkedin">
                      <i class="fa fa-linkedin-square fa-lg"></i>
                      <span className="name">ane nordahl-carlsen</span>
                    </div> */}
                  </div>
                  <div className="row startup-info-notata-info">
                    <div className="col-6 col-xs-6 startup-info-notata-info__web">
                      {connection?.creative ? (
                        <span
                          className="handCursor"
                          onClick={() =>
                            handleCompanyUrl(
                              getAnswer(connection.creative, "q06_section_info")
                            )
                          }
                        >
                          {" "}
                          {getAnswer(
                            connection.creative,
                            "q06_section_info"
                          )}{" "}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </div>
                    <div className="col-6 col-xs-6 startup-info-notata-info__slidedeck">
                      {connection?.creative ? getSlideDeck() : <></>}
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
                    {connection?.creative
                      ? getAnswer(connection.creative, "q01_section_info")
                      : "N/A"}
                  </p>
                  <div className="startup-help-container__heading">Problem</div>
                  <p>
                    {connection?.creative
                      ? getAnswer(connection.creative, "q02_section_info")
                      : "N/A"}
                  </p>
                  <div className="startup-help-container__heading">
                    Solution
                  </div>
                  <p>
                    {connection?.creative
                      ? getAnswer(connection.creative, "q03_section_info")
                      : "N/A"}
                  </p>
                  <div className="startup-help-container__heading">
                    Terms and conditions
                  </div>
                  <p>
                    {connection?.creative
                      ? getAnswer(connection.creative, "q01_section_terms")
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
                <img src="/images/startupinfo-demo.png" />
                <div className="startup-info-demo-container__video-info">
                  <div className="startup-info-demo-container__video-name">
                    {connection?.creative?.name}
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
                  {connection?.creative
                    ? getAnswer(connection.creative, "q01_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Pricing:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q02_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Product:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q03_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Kind of business:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q04_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  Currently in these markets:
                </div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q05_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Number of founders:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q06_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  Diversity of the founding team:
                </div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q07_section_business")
                    : "N/A"}
                </div>
              </div>
              <div className="startup-info-demo-container__sub-heading">
                Money
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Seeking for:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q00_section_money")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Raised soft money:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q01_section_money")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">Raised hard money:</div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q02_section_money")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  Raised money this round:
                </div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q03_section_money")
                    : "N/A"}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  Pre-money evaluation:
                </div>
                <div className="col-sm-5 col-xs-5 value">
                  {connection?.creative
                    ? getAnswer(connection.creative, "q04_section_money")
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {inviteStartUpModal && (
        <InviteStartupModal
          connection={connection}
          close={() => {
            setInviteStartUpModal(false);
          }}
        />
      )}
    </>
  );
}
