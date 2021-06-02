import React from "react";
import "./share-template.scss";
import TextBox from "../ui-kits/text-box";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import { ICONPOSITION, OVERVIEWPAGESTATE } from "../constants";
import TagsModal from "../ui-kits/TagsModal";
import InputCheckBox from "../ui-kits/check-box";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import "./startup-info.scss";

export default function ShareTemplate({ setPageState, companyName }) {
  return (
    <div className="row tab-panel-container">
      <div className="col-sm-12">
        <div className="card share-template-container">
          <div className="row">
            <div className="col-sm-12">
              <span
                class="material-icons back-icon"
                onClick={() => setPageState(OVERVIEWPAGESTATE.OVERVIEW)}
              >
                arrow_back_ios
              </span>
              <span className="page-heading">{companyName}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-5">
              <div className="row">
                <div className="col-sm-12 share">Share</div>
                <div className="col-sm-12 email">Email</div>
                <div className="col-sm-12">
                  <TextBox placeholder="ana@leverageUX.com"></TextBox>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <TextBox></TextBox>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <ButtonWithIcon
                    iconPosition={ICONPOSITION.END}
                    iconName="arrow_forward_ios"
                    text="SHARE"
                    className="btn-share"
                  ></ButtonWithIcon>
                </div>
              </div>
            </div>
            <div className="col-sm-7">
              <div className="row">
                <div className="col-sm-12 share">Link on template</div>
                <div className="col-sm-12 look-like">
                  Look like the template looks like:
                </div>
                <div className="col-sm-12 shared-link">
                  <span>
                    HTTP:///d/1nLcbGO4xMlamugkR2OuCnjGgU_eU1yduJSdWYDE7SPw
                    <button>Copy link</button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="separator"></div>
          <div className="row">
            <div className="col-sm-8">
              <div className="row">
                <div className="col-sm-12 email">Your Introduction</div>
                <div className="col-sm-12">
                  <textarea id="w3review" name="w3review" rows="4" cols="50" />
                </div>
                <div className="col-sm-12 email">Tags</div>
                <div className="col-sm-12 look-like">
                  Look like the template looks like:
                </div>
                <div className="col-sm-12">
                  <TagsModal />
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="row">
                <div className="col-sm-12 email">Seeking For</div>
                <div className="col-sm-12">
                  <TextBox />
                </div>
                <div className="col-sm-12 email">
                  Estimated company valuation
                </div>
                <div className="col-sm-12 ">
                  <TextBox placeholder="Email" />
                </div>
              </div>
            </div>
          </div>
          <div className="separator"></div>
          <div className="row tab-panel-container startup-info-container">
            <div className="col-sm-6">
              <div className="row">
                <div className="col-1 col-xs-1">
                  <div className="name-icon">G</div>
                </div>
                <div className="col-11 col-sm-10 col-xs-10">
                  <div className="startup-info-container__details">
                    <div className="startup-info-container__heading">
                      Great Startup Inc{" "}
                      <span className="material-icons">star</span>
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
                    <InputCheckBox checked /> Ane Nordahl Carlsen
                  </div>
                  <div className="row startup-info-contact-details">
                    <div className="col-6 col-xs-6 startup-info-contact-details__email">
                      <span class="material-icons">alternate_email</span>
                      <span className="name">ane@notata.io</span>
                    </div>
                    <div className="col-6 col-xs-6 startup-info-contact-details__linkedin">
                      <InputCheckBox checked />
                      <i class="fa fa-linkedin-square fa-lg"></i>
                      <span className="name">ekvol</span>
                    </div>
                    <div className="col-6 col-xs-6 startup-info-contact-details__phone">
                      <span class="material-icons">phone_iphone</span>
                      <span className="name">+47 95123220</span>
                    </div>
                    <div className="col-6 col-xs-6 startup-info-contact-details__linkedin">
                      <InputCheckBox checked />
                      <i class="fa fa-linkedin-square fa-lg"></i>
                      <span className="name">ane nordahl-carlsen</span>
                    </div>
                  </div>
                  <div className="row startup-info-notata-info">
                    <div className="col-6 col-xs-6 startup-info-notata-info__web">
                      <InputCheckBox checked /> WWW.NOTATA.IO
                    </div>
                    <div className="col-6 col-xs-6 startup-info-notata-info__slidedeck">
                      <Button endIcon={<Icon>arrow_forward_ios</Icon>}>
                        SLIDE DECK
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="startup-help-container">
                <div className="col-sm-12">
                  <div className="startup-help-container__heading">
                    <InputCheckBox checked /> One-Liner
                  </div>
                  <p>
                    Great Startup is a simple tool for investors to evaluate
                    startups and engage their network.
                  </p>
                  <div className="startup-help-container__heading">Problem</div>
                  <p>
                    It's hard to avoid unconscious bias when investing in early
                    stage startups. A systematic approach to evaluate companies
                    has proven to increase the return of investment. <br />
                    <br /> Most online platforms are focused on startups, while
                    tools for investors are often complicated, expensive and
                    lack sharing capabilites.
                    <br />
                    <br /> Entering the market as a new investor is difficult
                    without open access to a network. Notata is the only tool
                    which offers deal flow management, collaboration and sharing
                    between investors.
                  </p>
                  <div className="startup-help-container__heading">
                    <InputCheckBox checked />
                    Solution
                  </div>
                  <p>
                    A simple and sexy system to evaluate startups on the fly,
                    with sharing and collaboration at the core.
                  </p>
                  <div className="startup-help-container__heading">
                    <InputCheckBox checked />
                    Terms and conditions
                  </div>
                  <p>Startup agree to share available information.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6 startup-info-demo-container">
              <div className="startup-info-demo-container__heading">
                <InputCheckBox checked />
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
                <InputCheckBox checked />
                Business
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Business Model:
                </div>
                <div className="col-sm-5 col-xs-5 value">
                  Subscription model
                </div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Pricing:
                </div>
                <div className="col-sm-5 col-xs-5 value">Inexpensive</div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Product:
                </div>
                <div className="col-sm-5 col-xs-5 value">Software</div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Kind of business:
                </div>
                <div className="col-sm-5 col-xs-5 value">B2B</div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Currently in these markets:
                </div>
                <div className="col-sm-5 col-xs-5 value">Europe</div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Number of founders:
                </div>
                <div className="col-sm-5 col-xs-5 value">2</div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Diversity of the founding team:
                </div>
                <div className="col-sm-5 col-xs-5 value">
                  Female founder on team
                </div>
              </div>
              <div className="startup-info-demo-container__sub-heading">
                <InputCheckBox checked />
                Money
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Seeking for:
                </div>
                <div className="col-sm-5 col-xs-5 value">300 000 NOK</div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Raised soft money:
                </div>
                <div className="col-sm-5 col-xs-5 value">100 000 NOK</div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Raised hard money:
                </div>
                <div className="col-sm-5 col-xs-5 value">100 000 NOK</div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Raised money this round:
                </div>
                <div className="col-sm-5 col-xs-5 value">100 000 NOK</div>
              </div>
              <div className="row">
                <div className="col-sm-5 col-xs-5 key">
                  <InputCheckBox checked />
                  Pre-money evaluation:
                </div>
                <div className="col-sm-5 col-xs-5 value">100 000 NOK</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
