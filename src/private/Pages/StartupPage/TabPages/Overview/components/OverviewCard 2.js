import React from "react";
import moment from "moment";

export default function OverviewCard({ connection }) {
  let answers = connection?.creative?.answers || [];

  let section = answers?.find(i => i.questionId === "q01_section_info");
  let website = answers?.find(i => i.questionId === "q06_section_info");
  let slideDeck = answers?.find(i => i.questionId === "q01_section_materials");

  return (
    <div className="card overviewContainer">
      <div className="companyOverview">
        <div className="companyIcon">
          <div className="icon">
            <span>
              {connection?.creative?.name?.substr(0, 1)?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="companyDetails">
          <div className="companyNameContainer">
            <div className="companyName">{connection?.creative?.name}</div>
            <div className="companyLastUpdated">
              Last updated:
              <span>{moment(connection?.updatedAt, "x").fromNow()}</span>
            </div>
          </div>
          <div className="companyOneLiner">
            <p>{section?.val}</p>
            <div className="slideDeckContainer">
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
        <div className="overviewWebsite">
          <a href={website?.val} target="_blank">
            {website?.val}
          </a>
        </div>
      </div>
    </div>
  );
}
