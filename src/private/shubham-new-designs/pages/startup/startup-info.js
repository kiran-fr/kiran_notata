import React from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import "./startup-info.scss";

export default function StartupInfo() {
  return (
    <div className="row tab-panel-container startup-info-container">
      <div className="col-sm-7">
        <div className="card">
          <div className="row">
            <div className="col-1 col-xs-1">
              <div className="name-icon">G</div>
            </div>
            <div className="col-11 col-sm-10 col-xs-10">
              <div className="startup-info-container__details">
                <div className="startup-info-container__heading">
                  Great Startup Inc <span className="material-icons">star</span>
                </div>
                <div className="startup-info-container__location">
                  <span className="material-icons">place</span>
                  <span className="name">Norway</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="startup-info-container__startup-official">
                Ane Nordahl Carlsen
              </div>
              <div className="row startup-info-contact-details">
                <div className="col-6 col-xs-6 startup-info-contact-details__email">
                  <span class="material-icons">alternate_email</span>
                  <span className="name">ane@notata.io</span>
                </div>
                <div className="col-6 col-xs-6 startup-info-contact-details__linkedin">
                  <i class="fa fa-linkedin-square fa-lg"></i>
                  <span className="name">ekvol</span>
                </div>
                <div className="col-6 col-xs-6 startup-info-contact-details__phone">
                  <span class="material-icons">phone_iphone</span>
                  <span className="name">+47 95123220</span>
                </div>
                <div className="col-6 col-xs-6 startup-info-contact-details__linkedin">
                  <i class="fa fa-linkedin-square fa-lg"></i>
                  <span className="name">ane nordahl-carlsen</span>
                </div>
              </div>
              <div className="row startup-info-notata-info">
                <div className="col-6 col-xs-6 startup-info-notata-info__web">
                  WWW.NOTATA.IO
                </div>
                <div className="col-6 col-xs-6 startup-info-notata-info__slidedeck">
                  <Button endIcon={<Icon>arrow_forward_ios</Icon>}>
                    SLIDE DECK
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="startup-help-container">
            <div className="col-sm-12">
              <div className="startup-help-container__heading">One-Liner</div>
              <p>
                Great Startup is a simple tool for investors to evaluate
                startups and engage their network.
              </p>
              <div className="startup-help-container__heading">Problem</div>
              <p>
                It's hard to avoid unconscious bias when investing in early
                stage startups. A systematic approach to evaluate companies has
                proven to increase the return of investment. <br />
                <br /> Most online platforms are focused on startups, while
                tools for investors are often complicated, expensive and lack
                sharing capabilites.
                <br />
                <br /> Entering the market as a new investor is difficult
                without open access to a network. Notata is the only tool which
                offers deal flow management, collaboration and sharing between
                investors.
              </p>
              <div className="startup-help-container__heading">Solution</div>
              <p>
                A simple and sexy system to evaluate startups on the fly, with
                sharing and collaboration at the core.
              </p>
              <div className="startup-help-container__heading">
                Terms and conditions
              </div>
              <p>Startup agree to share available information.</p>
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
                Great Startup
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
            <div className="col-sm-5 col-xs-5 value">Subscription model</div>
          </div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">Pricing:</div>
            <div className="col-sm-5 col-xs-5 value">Inexpensive</div>
          </div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">Product:</div>
            <div className="col-sm-5 col-xs-5 value">Software</div>
          </div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">Kind of business:</div>
            <div className="col-sm-5 col-xs-5 value">B2B</div>
          </div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">
              Currently in these markets:
            </div>
            <div className="col-sm-5 col-xs-5 value">Europe</div>
          </div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">Number of founders:</div>
            <div className="col-sm-5 col-xs-5 value">2</div>
          </div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">
              Diversity of the founding team:
            </div>
            <div className="col-sm-5 col-xs-5 value">
              Female founder on team
            </div>
          </div>
          <div className="startup-info-demo-container__sub-heading">Money</div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">Seeking for:</div>
            <div className="col-sm-5 col-xs-5 value">300 000 NOK</div>
          </div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">Raised soft money:</div>
            <div className="col-sm-5 col-xs-5 value">100 000 NOK</div>
          </div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">Raised hard money:</div>
            <div className="col-sm-5 col-xs-5 value">100 000 NOK</div>
          </div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">
              Raised money this round:
            </div>
            <div className="col-sm-5 col-xs-5 value">100 000 NOK</div>
          </div>
          <div className="row">
            <div className="col-sm-5 col-xs-5 key">Pre-money evaluation:</div>
            <div className="col-sm-5 col-xs-5 value">100 000 NOK</div>
          </div>
        </div>
      </div>
    </div>
  );
}
