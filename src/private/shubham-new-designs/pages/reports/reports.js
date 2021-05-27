import React, { useState } from "react";
import "./reports.scss";
import group from "../../../../assets/images/group.png";
import business from "../../../../assets/images/business.png";
import SubjectiveScoreEvaluations from "./subjective-scores-evaluation";
import ChartTile from "./chart-tile";
import { REPORTCHARTS, ICONPOSITION } from "../constants";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import Filter from "./filter";

export default function Reports() {
  const [isFilterVisible, setFilterVisible] = useState(false);
  let data = [
    { name: "Business", type: REPORTCHARTS.COLUMN, isDropDown: false },
    { name: "Market", type: REPORTCHARTS.PIE, isDropDown: false },
    { name: "Phase", type: REPORTCHARTS.BAR, isDropDown: false },
    { name: "Source of lead", type: REPORTCHARTS.COLUMN, isDropDown: true },
    { name: "HQ Country", type: REPORTCHARTS.PIE, isDropDown: true },
    { name: "HQ Country", type: REPORTCHARTS.PIE, isDropDown: true },
  ];
  const [chartData, setChartData] = useState(data);
  return (
    <div className="report-container">
      <div className="row">
        <div className="col-sm-12 text-right">
          <ButtonWithIcon
            iconName="filter_alt"
            className="fillter-btn"
            text="Filter"
            iconPosition={ICONPOSITION.START}
            onClick={() => setFilterVisible(true)}
          ></ButtonWithIcon>
        </div>
        <div className="col-md-12 col-lg-6 col-xs-12 nopadding-right">
          <div className="card">
            <div className="card-heading">Funnels</div>
            <div className="row">
              <div className="col-sm-10 col-lg-6 col-md-7 funnels-container">
                <div className="funnels-container__filter">
                  <div className="funnels-container__filter__stages">
                    STAGES
                  </div>
                  <div className="funnels-container__filter__icons">
                    <i class="fa fa-filter" aria-hidden="true"></i>
                    <i class="fa fa-signal" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="funnels-container__funnels">
                  <div className="funnels-container__funnels__funnel">
                    <div className="score">58</div>
                    <div className="funnel-chart">
                      <div className="red"></div>
                    </div>
                    <div className="funnel-type">Reviewed</div>
                  </div>
                  <div className="funnels-container__funnels__funnel">
                    <div className="score">20</div>
                    <div className="funnel-chart">
                      <div className="blue"></div>
                    </div>
                    <div className="funnel-type">Met</div>
                  </div>
                  <div className="funnels-container__funnels__funnel">
                    <div className="score">20</div>
                    <div className="funnel-chart">
                      <div className="purple"></div>
                    </div>
                    <div className="funnel-type">Analyzed</div>
                  </div>
                  <div className="funnels-container__funnels__funnel">
                    <div className="score">20</div>
                    <div className="funnel-chart">
                      <div className="orange"></div>
                    </div>
                    <div className="funnel-type">IC</div>
                  </div>
                  <div className="funnels-container__funnels__funnel">
                    <div className="score">20</div>
                    <div className="funnel-chart">
                      <div className="green"></div>
                    </div>
                    <div className="funnel-type">Invested</div>
                  </div>
                </div>
              </div>
              <div className="col-sm-10 col-lg-6 col-md-5 funnels-container__data-container">
                <div className="row funnels-container__data-container__data-summary">
                  <div className="col-sm-6 col-xs-6 reviewed">Reviewed</div>
                  <div className="col-sm-6 col-xs-6 no-of-records">
                    10 of 250
                  </div>
                </div>
                <div className="funnels-container__data-container__data-headers">
                  <div className="row">
                    <div className="col-sm-6 col-xs-6 name">Name</div>
                    <div className="col-sm-6 col-xs-6 added">Added</div>
                  </div>
                  {[...Array(8)].map((elementInArray, index) => {
                    return (
                      <div key={`data-record-id-${index}`}>
                        <div className="row funnels-container__data-container__data-record">
                          <div className="col-sm-6 col-xs-6 funnel-name">
                            Sanity Corp
                          </div>
                          <div className="col-sm-6 col-xs-6 funnel-date">
                            Feb 16, 2021
                          </div>
                        </div>
                        <div className="separator"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-6 col-xs-12">
          <div className="row">
            <div className="col-sm-6 col-xs-12 col-md-6 nopadding-right col-lg-6 my-groups-container">
              <div className="card">
                <div className="card-heading">My Groups</div>
                <div className="my-groups-container__noOfRecords">10</div>
                <div className="my-groups-container__last-week-comparison">
                  <span className="performance green">+2</span>
                  <span class="material-icons green">north </span>
                  <span className="since-last-month">Since last month</span>
                </div>
                <img src={group} />
                <div className="my-groups-container__footer-link">
                  <div className="go-to-my-groups">Go to my groups</div>
                  <span class="material-icons green">
                    keyboard_arrow_right{" "}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xs-12 col-md-6 col-lg-6 my-groups-container">
              <div className="card">
                <div className="card-heading">All Startups</div>
                <div className="my-groups-container__noOfRecords">1526</div>
                <div className="my-groups-container__last-week-comparison">
                  <span className="performance green">+2</span>
                  <span class="material-icons green">north </span>
                  <span className="since-last-month">Since last month</span>
                </div>
                <img src={business} />
                <div className="my-groups-container__footer-link">
                  <div className="go-to-my-groups">Go to my startups</div>
                  <span class="material-icons green">
                    keyboard_arrow_right{" "}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xs-12 col-md-6 nopadding-right col-lg-6 my-groups-container">
              <div className="card">
                <div className="card-heading">People in your network</div>
                <div className="my-groups-container__noOfRecords">987</div>
                <div className="my-groups-container__last-week-comparison">
                  <span className="performance red">-24</span>
                  <span class="material-icons red">south </span>
                  <span className="since-last-month">Since last month</span>
                </div>
                <img src={group} />
              </div>
            </div>
            <div className="col-sm-6 col-xs-12 col-md-6 col-lg-6 my-groups-container">
              <div className="card">
                <div className="card-heading">Group startups</div>
                <div className="my-groups-container__noOfRecords">1890</div>
                <div className="my-groups-container__last-week-comparison">
                  <span className="performance green">+82</span>
                  <span class="material-icons green">north </span>
                  <span className="since-last-month">Since last month</span>
                </div>
                <img src={business} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12">
          <SubjectiveScoreEvaluations></SubjectiveScoreEvaluations>
        </div>
        <div className="col-sm-12 tags-container-heading">Tags</div>
        {chartData.map((chart, index) => {
          return (
            <div
              className="col-sm-6 col-md-6 col-lg-4"
              key={`chart-id-${index}`}
            >
              <ChartTile
                tileHeading={chart.name}
                selectedChartType={chart.type}
                isDropDownOption={chart.isDropDown}
              />
            </div>
          );
        })}
        {isFilterVisible && <Filter close={setFilterVisible} />}
        <div className="col-sm-12 report-container__add-icon-container">
          <div>
            <i
              className="fa fa-plus report-container__add-icon-container__add-icon"
              onClick={() => {
                let charts = [...chartData];
                console.log(",,,", charts);
                charts.push(charts[charts.length - 1]);
                setChartData(charts);
              }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
}
