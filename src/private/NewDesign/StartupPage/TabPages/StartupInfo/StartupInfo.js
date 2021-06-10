import React, { useState } from "react";
import "./StartupInfo.scss";
import EditStartupInfo from "./subPages/EditStartupInfo";
import InviteStartupModal from "./modals/InviteStartupModal";

function HeaderCard({
  getAnswer,
  creative,
  setInviteStartUpModal,
  setShareStartup,
}) {
  return (
    <div className="card">
      {/*HEADER SECTION*/}

      <div className="row">
        {/* LOGO */}
        <div className="col-1 col-xs-1">
          <div className={`name-icon ${creative?.logo && "with-logo"}`}>
            {(!creative?.logo && (
              <span>{creative?.name[0].toString()}</span>
            )) || (
              <img
                src={creative.logo}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            )}
          </div>
        </div>
        {/* ... end logo */}

        {/* ACTION BUTTONS */}
        {creative?.canEdit && (
          <>
            <div className="share-btn" onClick={() => setShareStartup(true)}>
              <i className="fas fa-pen" />
              <span>Edit info</span>
            </div>

            <div
              className="share-btn second-btn"
              onClick={() => setInviteStartUpModal(true)}
            >
              <i className="fas fa-share-alt" />
              <span>Invite startup</span>
            </div>
          </>
        )}
        {/* ... end action buttons */}

        {/* COMPANY NAME */}
        <div className="col-11 col-sm-10 col-xs-10">
          <div className="startup-info-container__details">
            <div className="startup-info-container__heading">
              {creative?.name}
              <span className="material-icons">star</span>
            </div>

            <div className="personalia">
              {getAnswer(creative, "q04_section_info") && (
                <div className="startup-info-container__location">
                  <span className="material-icons">place</span>
                  <span className="name">
                    {getAnswer(creative, "q04_section_info")}
                  </span>
                </div>
              )}

              {getAnswer(creative, "q05_section_info") && (
                <div className="startup-info-container__location">
                  <span className="material-icons">person</span>
                  <span className="name">
                    {getAnswer(creative, "q05_section_info")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ... end company name */}
      </div>

      {/* ... end header section */}

      <div className="row">
        <div className="col-sm-12">
          {/*<div className="startup-info-container__startup-official">*/}
          {/*  <div>*/}
          {/*    contact person:*/}
          {/*  </div>*/}
          {/*  {getAnswer(creative, "q05_section_info") || 'n/a'}*/}
          {/*</div>*/}

          <div className="row startup-info-notata-info">
            <div className="slideDeckContainer">
              {getAnswer(creative, "q01_section_materials") && (
                <div className="slideDeckButton">
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
                </div>
              )}

              {getAnswer(creative, "q06_section_info") && (
                <div className="overviewWebsite">
                  <a
                    href={getAnswer(creative, "q06_section_info")}
                    target="_blank"
                  >
                    {getAnswer(creative, "q06_section_info")}
                  </a>
                </div>
              )}
            </div>

            {/*{ // WEBSITE*/}
            {/*  getAnswer(creative, "q06_section_info") && (*/}
            {/*    <div className="col-6 col-xs-6 startup-info-notata-info__web">*/}

            {/*      <span*/}
            {/*        className="handCursor"*/}
            {/*        onClick={() =>*/}
            {/*          handleLink(*/}
            {/*            getAnswer(creative, "q06_section_info")*/}
            {/*          )*/}
            {/*        }*/}
            {/*      >*/}
            {/*        {*/}
            {/*          getAnswer(creative, "q06_section_info")*/}
            {/*        }*/}
            {/*      </span>*/}

            {/*    </div>*/}
            {/*  )*/}
            {/*}*/}

            {/*{  // SLIDE DECK*/}
            {/*  getAnswer(creative, "q01_section_materials") && (*/}
            {/*    <div className="col-6 col-xs-6 startup-info-notata-info__slidedeck">*/}
            {/*      <span*/}
            {/*        className="handCursor"*/}
            {/*        onClick={() =>*/}
            {/*          handleLink(*/}
            {/*            getAnswer(creative, "q01_section_materials")*/}
            {/*          )*/}
            {/*        }*/}
            {/*        >*/}
            {/*        {*/}
            {/*          getAnswer(creative, "q01_section_materials")*/}
            {/*        }*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*  )*/}
            {/*}*/}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ getAnswer, creative }) {
  return (
    <div className="card">
      <div className="startup-help-container">
        <div className="col-sm-12">
          <div className="startup-help-container__heading">One-Liner</div>
          <p>{getAnswer(creative, "q01_section_info") || "n/a"}</p>
          <div className="startup-help-container__heading">Problem</div>
          <p>{getAnswer(creative, "q02_section_info") || "n/a"}</p>
          <div className="startup-help-container__heading">Solution</div>
          <p>{getAnswer(creative, "q03_section_info") || "n/a"}</p>
          <div className="startup-help-container__heading">
            Terms and conditions
          </div>
          <p>
            {getAnswer(creative, "q01_section_terms")
              ? "Terms and conditions has been accepted."
              : "n/a"}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ getAnswer, creative }) {
  return (
    <div className="card">
      <div className="startup-info-demo-container__heading">Product Demo</div>

      <div className="startup-info-demo-container__video">
        <div className="coming-soon">
          <div className="block-out" />
          <div className="message-content">Coming soon 🚀</div>
        </div>

        <img src="/images/startupinfo-demo.png" />
        <div className="startup-info-demo-container__video-info">
          <div className="startup-info-demo-container__video-name">
            {creative?.name}
          </div>
          <div className="startup-info-demo-container__video-source">
            youtube.com
          </div>
        </div>
      </div>

      <div className="startup-info-demo-container__sub-heading">Business</div>

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">Business Model:</div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q01_section_business") || "n/a"}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">Pricing:</div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q02_section_business") || "n/a"}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">Product:</div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q03_section_business") || "n/a"}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">Kind of business:</div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q04_section_business") || "n/a"}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">Currently in these markets:</div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q05_section_business") || "n/a"}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">Number of founders:</div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q06_section_business") || "n/a"}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">
          Diversity of the founding team:
        </div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q07_section_business") || "n/a"}
        </div>
      </div>

      <div className="startup-info-demo-container__sub-heading">Money</div>

      {/*<div className="row">*/}
      {/*  <div className="col-sm-5 col-xs-5 key">Seeking:</div>*/}
      {/*  <div className="col-sm-5 col-xs-5 value">*/}
      {/*    {getAnswer(creative, "q00_section_money") || "n/a"}*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">Raised soft money:</div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q01_section_money") || "n/a"}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">Raised hard money:</div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q02_section_money") || "n/a"}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">Seeking this round:</div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q03_section_money") || "n/a"}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-5 col-xs-5 key">Pre-money valuation:</div>
        <div className="col-sm-5 col-xs-5 value">
          {getAnswer(creative, "q04_section_money") || "n/a"}
        </div>
      </div>
    </div>
  );
}

export default function StartupInfo({ connection }) {
  const [inviteStartUpModal, setInviteStartUpModal] = useState(false);
  const [shareStartup, setShareStartup] = useState(false);

  function getAnswer(creative, questionId) {
    let items = creative.answers.filter(answer => {
      return answer.questionId === questionId;
    });
    if (!items.length) {
      return;
    }
    let results = items.map(({ val }) => val);

    return results.join(",\n");
  }

  if (shareStartup) {
    return (
      <EditStartupInfo
        backToInfoPage={() => setShareStartup(false)}
        connection={connection}
      />
    );
  }

  return (
    <>
      <div className="row tab-panel-container startup-info-container">
        <div className="col-sm-7">
          <HeaderCard
            getAnswer={getAnswer}
            creative={connection?.creative || {}}
            setInviteStartUpModal={setInviteStartUpModal}
            setShareStartup={setShareStartup}
          />

          <InfoCard
            creative={connection?.creative || {}}
            getAnswer={getAnswer}
          />
        </div>

        <div className="col-sm-5 startup-info-demo-container">
          <DetailCard
            creative={connection.creative || {}}
            getAnswer={getAnswer}
          />
        </div>
      </div>

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
