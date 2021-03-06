import React, { useEffect, useState } from "react";

// COMPONENTS
import SubjectiveScoreEvaluations from "./subjective-scores-evaluation";
import Filter from "./filter";

// STYLES
import "./reports.scss";

// OTHERS
import group from "../../../assets/images/group.png";
import business from "../../../assets/images/business.png";
import ChartTile from "./chart-tile";
import { REPORTCHARTS, ICONPOSITION } from "../constants";
import ButtonWithIcon from "../../../Components/UI_Kits/from_srv/button-with-icon";
import { useQuery } from "@apollo/client";
import { reportsGet } from "../../Apollo/Queries";

export default function Reports() {
  let reportsQuery = useQuery(reportsGet);

  // CONST
  let data = [
    { name: "Business", type: REPORTCHARTS.COLUMN, isDropDown: false },
    { name: "Market", type: REPORTCHARTS.PIE, isDropDown: false },
    { name: "Phase", type: REPORTCHARTS.BAR, isDropDown: false },
    // { name: "Source of lead", type: REPORTCHARTS.COLUMN, isDropDown: true },
    // { name: "HQ Country", type: REPORTCHARTS.PIE, isDropDown: true },
    // { name: "HQ Country", type: REPORTCHARTS.PIE, isDropDown: true },
  ];
  // STATES
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [chartData, setChartData] = useState(data);
  return (
    <div className="report-container">
      {/*<div className="coming-soon">*/}
      {/*  <div>Coming soon 🚀</div>*/}
      {/*</div>*/}

      <div
      // className="row hide-and-blur"
      >
        <div className="col-sm-12 text-right">
          <ButtonWithIcon
            iconName="filter_alt"
            className="fillter-btn"
            text="Filter"
            iconPosition={ICONPOSITION.START}
            onClick={() => setFilterVisible(true)}
          />
        </div>
        <div className="col-md-12 col-lg-6 col-xs-12 nopadding-right">
          <div className="card">
            <div className="card-heading">Funnels</div>
            <div className="row">
              <div className="col-sm-10 col-lg-6 col-md-7 reports-funnels-container">
                <div className="reports-funnels-container__filter">
                  <div className="reports-funnels-container__filter__stages">
                    STAGES
                  </div>
                  <div className="reports-funnels-container__filter__icons">
                    <i className="fa fa-filter" aria-hidden="true" />
                    <i className="fa fa-signal" aria-hidden="true" />
                  </div>
                </div>
                <div className="reports-funnels-container__funnels">
                  <div className="reports-funnels-container__funnels__funnel">
                    <div className="score">58</div>
                    <div className="funnel-chart">
                      <div className="red" />
                    </div>
                    <div className="funnel-type">Reviewed</div>
                  </div>
                  <div className="reports-funnels-container__funnels__funnel">
                    <div className="score">20</div>
                    <div className="funnel-chart">
                      <div className="blue" />
                    </div>
                    <div className="funnel-type">Met</div>
                  </div>
                  <div className="reports-funnels-container__funnels__funnel">
                    <div className="score">20</div>
                    <div className="funnel-chart">
                      <div className="purple" />
                    </div>
                    <div className="funnel-type">Analyzed</div>
                  </div>
                  <div className="reports-funnels-container__funnels__funnel">
                    <div className="score">20</div>
                    <div className="funnel-chart">
                      <div className="orange" />
                    </div>
                    <div className="funnel-type">IC</div>
                  </div>
                  <div className="reports-funnels-container__funnels__funnel">
                    <div className="score">20</div>
                    <div className="funnel-chart">
                      <div className="green" />
                    </div>
                    <div className="funnel-type">Invested</div>
                  </div>
                </div>
              </div>
              <div className="col-sm-10 col-lg-6 col-md-5 reports-funnels-container__data-container">
                <div className="row reports-funnels-container__data-container__data-summary">
                  <div className="col-sm-6 col-xs-6 reviewed">Reviewed</div>
                  <div className="col-sm-6 col-xs-6 no-of-records">
                    10 of 250
                  </div>
                </div>
                <div className="reports-funnels-container__data-container__data-headers">
                  <div className="row">
                    <div className="col-sm-6 col-xs-6 name">Name</div>
                    <div className="col-sm-6 col-xs-6 added">Added</div>
                  </div>
                  {[...Array(8)].map((elementInArray, index) => {
                    return (
                      <div key={`data-record-id-${index}`}>
                        <div className="row reports-funnels-container__data-container__data-record">
                          <div className="col-sm-6 col-xs-6 funnel-name">
                            Sanity Corp
                          </div>
                          <div className="col-sm-6 col-xs-6 funnel-date">
                            Feb 16, 2021
                          </div>
                        </div>
                        <div className="separator" />
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
          <SubjectiveScoreEvaluations />
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
            />
          </div>
        </div>
      </div>

      {reportsQuery?.loading && <div>...loading query</div>}

      {reportsQuery?.error && (
        <div>
          ...ERROR
          <br />
          {JSON.stringify(reportsQuery.error, null, 2)}
        </div>
      )}

      <pre>{JSON.stringify(reportsQuery?.data, null, 2)}</pre>
    </div>
  );
}
