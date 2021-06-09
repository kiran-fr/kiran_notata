import React from "react";
import "./dashboard.scss";
import notificationProfile from "../../../../assets/images/dashboard-notifictaion-profile.png";
import notificationConversation from "../../../../assets/images/dashboard-notifictaion-converstation.png";
import ReportAnalyticChart from "./report-analytics-chart";
import ReportAnalyticFunnel from "./report-analytics-funnel";

export default function DashboardNew() {
  return (
    <>
      <div className="header-routing">
        <span className="header-routing__name">Dashboard</span>
        <i className="fal fa-chevron-right header-routing__stilt"></i>
        <span className="header-routing__name">Startup Name</span>
      </div>
      <div className="dashboard-container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
            <div className="card dashboard-container__recently-added-card">
              <div className="card-heading-designer">
                Recently added startups
              </div>
              <div className="dashboard-container__recently-added-card__data-container">
                <div className="dashboard-container__recently-added-card__data-container__data-entry">
                  <div className="startup-name">Startup 1</div>
                  <div className="group-name">Group name</div>
                  <div className="evaluate">Evaluate</div>
                </div>
                <div className="dashboard-container__recently-added-card__data-container__data-entry">
                  <div className="startup-name">Startup 1</div>
                  <div className="group-name">Web form</div>
                  <div className="evaluate">Evaluate</div>
                </div>
                <div className="dashboard-container__recently-added-card__data-container__data-entry">
                  <div className="startup-name">Startup 1</div>
                  <div className="group-name">Group name</div>
                  <div className="evaluate">Evaluate</div>
                </div>
                <div className="dashboard-container__recently-added-card__data-container__data-entry">
                  <div className="startup-name">Startup 1</div>
                  <div className="group-name">Web form</div>
                  <div className="evaluate">Evaluate</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6  col-sm-12 col-xs-12">
            <div className="card dashboard-container__invited-to-groups-card">
              <div className="card-heading-designer">
                Suggested/invited to groups
              </div>
              <div className="dashboard-container__invited-to-groups-card__data-container">
                <div className="dashboard-container__invited-to-groups-card__data-container__header">
                  <div className="group-heading">GROUP</div>
                  <div className="admin-heading">Admin</div>
                </div>
                <div className="dashboard-container__invited-to-groups-card__data-container__data-entry">
                  <div className="group-name">
                    <span class="material-icons">add_circle</span>
                    Group name
                  </div>
                  <div className="admin">Ane Nordahl Carlsen</div>
                </div>
                <div className="dashboard-container__invited-to-groups-card__data-container__data-entry">
                  <div className="group-name">
                    <span class="material-icons">add_circle</span>
                    Group name
                  </div>
                  <div className="admin">Jørgen Ekvoll</div>
                </div>
              </div>
              <div className="dashboard-container__invited-to-groups-card__invite-container">
                <div className="dashboard-container__invited-to-groups-card__invite-container__invite">
                  <div className="invite-member">
                    <span className="invitation-name">Jørgen Ekvoll</span>
                    <span className="invitation-text">
                      {" "}
                      invite you to join (as a member):
                    </span>
                  </div>
                  <div className="dashboard-container__invited-to-groups-card__data-container__data-entry">
                    <div className="group-name">
                      <span class="material-icons">add_circle</span>
                      Group name
                    </div>
                    <div className="admin">Jørgen Ekvoll</div>
                  </div>
                </div>
                <div className="dashboard-container__invited-to-groups-card__invite-container__close">
                  <span class="material-icons">close</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12">
            <div className="card dashboard-container__my-startups">
              <div className="dashboard-container__my-startups__heading">
                My startups
              </div>
              <div className="dashboard-container__my-startups__data-container">
                <div className="dashboard-container__my-startups__data-container__data-entry data-entry-heading">
                  <div className="dashboard-container__my-startups__data-container__data-entry__heading">
                    Name
                  </div>
                  <div className="dashboard-container__my-startups__data-container__data-entry__heading">
                    Stage
                  </div>
                  <div className="dashboard-container__my-startups__data-container__data-entry__heading">
                    Subjective Score
                  </div>
                </div>
                <div className="dashboard-container__my-startups__data-container__data-entry">
                  <div className="dashboard-container__my-startups__data-container__data-entry__startup-name">
                    Startup Name 1
                  </div>
                  <div className="dashboard-container__my-startups__data-container__data-entry__funnels">
                    <div className="dashboard-container__my-startups__data-container__data-entry__funnels__funnel">
                      <div className="red-100"></div>
                      <div className="gray-80"></div>
                      <div className="gray-60"></div>
                      <div className="gray-40"></div>
                      <div className="gray-20"></div>
                    </div>
                    <div className="dashboard-container__my-startups__data-container__data-entry__funnels__funnel-type">
                      Reviewed
                    </div>
                  </div>
                  <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score">
                    <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__score">
                      8.1
                    </div>
                    <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__change">
                      <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__change__btn">
                        Change
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dashboard-container__my-startups__data-container__data-entry">
                  <div className="dashboard-container__my-startups__data-container__data-entry__startup-name">
                    Startup Name 2
                  </div>
                  <div className="dashboard-container__my-startups__data-container__data-entry__funnels">
                    <div className="dashboard-container__my-startups__data-container__data-entry__funnels__funnel">
                      <div className="purple-100"></div>
                      <div className="gray-80"></div>
                      <div className="gray-60"></div>
                      <div className="gray-40"></div>
                      <div className="gray-20"></div>
                    </div>
                    <div className="dashboard-container__my-startups__data-container__data-entry__funnels__funnel-type">
                      Analized
                    </div>
                  </div>
                  <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score">
                    <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__score">
                      7
                    </div>
                    <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__change">
                      <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__change__btn">
                        Change
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dashboard-container__my-startups__data-container__data-entry">
                  <div className="dashboard-container__my-startups__data-container__data-entry__startup-name">
                    Startup Name 3
                  </div>
                  <div className="dashboard-container__my-startups__data-container__data-entry__funnels">
                    <div className="dashboard-container__my-startups__data-container__data-entry__funnels__funnel">
                      <div className="green-100"></div>
                      <div className="gray-80"></div>
                      <div className="gray-60"></div>
                      <div className="gray-40"></div>
                      <div className="gray-20"></div>
                    </div>
                    <div className="dashboard-container__my-startups__data-container__data-entry__funnels__funnel-type">
                      Met
                    </div>
                  </div>
                  <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score">
                    <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__score">
                      8.1
                    </div>
                    <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__change">
                      <div className="dashboard-container__my-startups__data-container__data-entry__subjective-score__change__btn">
                        Change
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-container__my-startups__more-startups">
                MORE STARTUPS <i className="fa fa-chevron-down"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
            <div className="card dashboard-container__news">
              <div className="dashboard-container__news__card-heading">
                News
              </div>
              <div className="dashboard-container__news__date">
                Jan 25, 2020
              </div>
              <div className="dashboard-container__news__news">
                <div className="dashboard-container__news__news__heading">
                  Justworks’ Series B pitch deck may be the most wonderfully
                  simple deck I’ve ever seen
                </div>
                <div className="dashboard-container__news__news__detail">
                  It may be tough to remember, but there was a time long ago
                  when Justworks wasn’t a household name...
                </div>
              </div>
              <div className="dashboard-container__news__footer">
                <div className="dashboard-container__news__footer__name">
                  Jørgen Ekvoll
                </div>
                <div className="dashboard-container__news__footer__learn-more">
                  Learn more
                  <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </div>
              </div>
              <div className="dashboard-container__news__date">
                Jan 25, 2020
              </div>
              <div className="dashboard-container__news__news">
                <div className="dashboard-container__news__news__heading">
                  Justworks’ Series B pitch deck may be the most wonderfully
                  simple deck I’ve ever seen
                </div>
                <div className="dashboard-container__news__news__detail">
                  It may be tough to remember, but there was a time long ago
                  when Justworks wasn’t a household name...
                </div>
              </div>
              <div className="dashboard-container__news__footer">
                <div className="dashboard-container__news__footer__name">
                  Jørgen Ekvoll
                </div>
                <div className="dashboard-container__news__footer__learn-more">
                  Learn more
                  <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </div>
              </div>
              <div className="dashboard-container__news__more-news">
                MORE news <i className="fa fa-chevron-down"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
            <div className="card dashboard-container__notification">
              <div className="dashboard-container__notification__heading">
                Notifications
              </div>
              <div className="dashboard-container__notification__notification">
                <img src={notificationProfile} />
                <div className="dashboard-container__notification__notification__text">
                  <span className="dashboard-container__notification__notification__text__username">
                    Stephanie Wykoff
                  </span>
                  accepted your invitation to join (as a member) group{" "}
                  <span className="dashboard-container__notification__notification__text__username">
                    Band of Angels
                  </span>
                  <div className="dashboard-container__notification__notification__text__hour-ago">
                    1 hour ago
                  </div>
                </div>
              </div>
              <div className="dashboard-container__notification__notification">
                <img src={notificationProfile} />
                <div className="dashboard-container__notification__notification__text">
                  <span className="dashboard-container__notification__notification__text__username">
                    Stephanie Wykoff
                  </span>
                  accepted your invitation to join (as a member) group{" "}
                  <span className="dashboard-container__notification__notification__text__username">
                    Band of Angels
                  </span>
                  <div className="dashboard-container__notification__notification__text__hour-ago">
                    1 hour ago
                  </div>
                </div>
              </div>
              <div className="dashboard-container__notification__notification">
                <img src={notificationConversation} />
                <div className="dashboard-container__notification__notification__text">
                  <span className="dashboard-container__notification__notification__text__username">
                    Stephanie Wykoff
                  </span>
                  posted a new comment in group{" "}
                  <span className="dashboard-container__notification__notification__text__username">
                    Great Startup 1
                  </span>
                  <div className="dashboard-container__notification__notification__text__comment">
                    This startup is really well!
                  </div>
                  <div className="dashboard-container__notification__notification__text__hour-ago">
                    1 hour ago
                  </div>
                </div>
              </div>
              <div className="dashboard-container__notification__notification">
                <img src={notificationConversation} />
                <div className="dashboard-container__notification__notification__text">
                  <span className="dashboard-container__notification__notification__text__username">
                    Stephanie Wykoff
                  </span>
                  posted a new comment in group{" "}
                  <span className="dashboard-container__notification__notification__text__username">
                    Great Startup 1
                  </span>
                  <div className="dashboard-container__notification__notification__text__comment">
                    This startup is really well!
                  </div>
                  <div className="dashboard-container__notification__notification__text__hour-ago">
                    1 hour ago
                  </div>
                </div>
              </div>
              <div className="dashboard-container__notification__more-updates">
                MORE udpates <i className="fa fa-chevron-down"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12">
            <div className="card dashboard-container__reports-and-analytics">
              <div className="dashboard-container__reports-and-analytics__heading">
                Reports and analytics
              </div>
              <div className="dashboard-container__reports-and-analytics__scores-container">
                <div className="dashboard-container__reports-and-analytics__scores-container__score">
                  <div className="dashboard-container__reports-and-analytics__scores-container__score__heading">
                    All startups
                  </div>
                  <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container">
                    <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__value">
                      1825
                    </div>
                    <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance">
                      <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__score">
                        +83
                      </div>
                      <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator">
                        <span class="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator--up-arrow material-icons">
                          north
                        </span>
                        <span className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator--since-last">
                          since last
                          <br /> month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dashboard-container__reports-and-analytics__scores-container__score">
                  <div className="dashboard-container__reports-and-analytics__scores-container__score__heading">
                    People in your network
                  </div>
                  <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container">
                    <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__value">
                      532
                    </div>
                    <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance">
                      <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__score">
                        +24
                      </div>
                      <div className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator">
                        <span class="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator--up-arrow material-icons">
                          north
                        </span>
                        <span className="dashboard-container__reports-and-analytics__scores-container__score__value-container__performance__indicator--since-last">
                          since last
                          <br /> month
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-container__reports-and-analytics__chart-funnel-container">
                <div className="dashboard-container__reports-and-analytics__chart-funnel-container--chart">
                  <ReportAnalyticChart />
                </div>
                <div className="dashboard-container__reports-and-analytics__chart-funnel-container--chart">
                  <ReportAnalyticFunnel />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
