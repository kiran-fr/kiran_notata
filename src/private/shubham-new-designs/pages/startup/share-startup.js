import React, { useState } from "react";
import "./share-startup.scss";
import Scrollspy from "react-scrollspy";

export default function ShareStartup() {
  const [infoSectionState, setInfoSectionState] = useState("");
  const [businessSectionState, setBusinessSectionState] = useState("");
  const [moneySectionState, setMoneySectionState] = useState("");
  const [materialsSectionState, setMaterialsSectionState] = useState("");
  const [contactsSectionState, setContactsSectionState] = useState("");
  const [socialSectionState, setSocialSectionState] = useState("");
  const [termsSectionState, setTermsSectionState] = useState("");
  return (
    <div className="row tab-panel-container">
      <div className="col-sm-12">
        <div className="card share-startup-container">
          <div className="row">
            <div className="col-sm-12">
              <span class="material-icons back-icon">arrow_back_ios</span>
              <span className="page-heading">Great Startup Inc</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-3 col-xs-0">
              <div className="menu-container">
                <Scrollspy
                  items={[
                    "info",
                    "business",
                    "money",
                    "materials",
                    "contacts",
                    "social-profiles",
                    "terms-conditions",
                  ]}
                  currentClassName="is-current"
                  offset={-300}
                >
                  <li>
                    <a href="#info">Info</a>
                  </li>
                  <li>
                    <a href="#business">Business</a>
                  </li>
                  <li>
                    <a href="#money">Money</a>
                  </li>
                  <li>
                    <a href="#materials">Materials</a>
                  </li>
                  <li>
                    <a href="#contacts">Contacts</a>
                  </li>
                  <li>
                    <a href="#social-profiles">Social profiles</a>
                  </li>
                  <li>
                    <a href="#terms-conditions">Terms and conditions</a>
                  </li>
                </Scrollspy>
              </div>
            </div>
            <div className="col-md-9 col-sm-9 col-xs-12 startup-details-container">
              <div className="col-sm-2 col-xs-3">
                <i class="camera fa fa-camera" aria-hidden="true"></i>
              </div>
              <div className="col-sm-10 col-xs-9">
                <div className="row">
                  <div className="col-sm-3">
                    <button className="upload-logo-btn">UPLOAD LOGO</button>
                  </div>
                  <div className="col-sm-3">
                    <button className="delete-btn">DELETE</button>
                  </div>
                </div>
              </div>
              <div className="col-sm-12" id="info">
                <div className="info-separator separator"></div>
              </div>
              <div className={`col-sm-12 details`}>
                <div className="heading">
                  <i
                    class={`fa ${
                      infoSectionState === ""
                        ? "fa-chevron-up"
                        : "fa-chevron-down"
                    }`}
                    aria-hidden="true"
                    onClick={() =>
                      setInfoSectionState(
                        infoSectionState === "" ? "collapse" : ""
                      )
                    }
                  ></i>
                  Info
                </div>
                <div className={infoSectionState}>
                  <div className="sub-heading">One-Liner</div>
                  <div className="description">
                    How can the company be described in a few short sentences?
                  </div>
                  <div className="textbox">
                    <input type="text" placeholder="Write your answer..." />
                  </div>
                  <div className="sub-heading">Problem</div>
                  <div className="description">
                    What is the problem that is being solved?
                  </div>
                  <div className="textbox">
                    <textarea placeholder="Write your answer..." />
                  </div>
                  <div className="sub-heading">Solution</div>
                  <div className="description">
                    What is the solution to the problem that is being solved?
                  </div>
                  <div className="textbox">
                    <textarea placeholder="Write your answer..." />
                  </div>
                </div>
              </div>
              <div className="col-sm-12" id="business">
                <div className="separator"></div>
              </div>
              <div className="col-sm-12 details">
                <div className="heading">
                  <i
                    class={`fa ${
                      businessSectionState === ""
                        ? "fa-chevron-up"
                        : "fa-chevron-down"
                    }`}
                    aria-hidden="true"
                    onClick={() =>
                      setBusinessSectionState(
                        businessSectionState === "" ? "collapse" : ""
                      )
                    }
                  ></i>
                  Business
                </div>
                <div className={businessSectionState}>
                  <div className="sub-heading">Business model</div>
                  <div className="description">
                    How is this business making money?
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>...as a service</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>subscription model</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>one time fee</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>cut of sales</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>freemium</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>free</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>hardware</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>hardware + subscription</span>
                  </div>
                  <div className="sub-heading">Pricing</div>
                  <div className="description">
                    How is this business making money?
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>free</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>inexpensive</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>average</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>expensive</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>no pricing model developed</span>
                  </div>
                  <div className="sub-heading">Product</div>
                  <div className="description">
                    How is this business making money?
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>software</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>hardware</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>services</span>
                  </div>
                  <div className="sub-heading">Kind of business</div>
                  <div className="description">
                    Who are the users and who are the customers (B = business, C
                    = consumer, G = government)
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>B2B</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>B2C</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>B2G</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>C2B</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>C2G</span>
                  </div>
                  <div className="sub-heading">Currently in these markets</div>
                  <div className="description">
                    What markets are being focused on?
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>North America</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>South America</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>Africa</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>Europe</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>Asia</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>Oceania</span>
                  </div>
                  <div className="sub-heading">Number of founders:</div>
                  <div className="description">
                    What markets are being focused on?
                  </div>
                  <div className="textbox no-of-founders">
                    <input type="text" />
                  </div>
                  <div className="sub-heading">
                    Diversity of the founding team
                  </div>
                  <div className="description">
                    What markets are being focused on?
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>Female founder on team</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" />
                    <span>Minority founder on team</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-12" id="money">
                <div className="separator"></div>
              </div>
              <div className="col-sm-12 details">
                <div className="heading">
                  <i
                    class={`fa ${
                      moneySectionState === ""
                        ? "fa-chevron-up"
                        : "fa-chevron-down"
                    }`}
                    aria-hidden="true"
                    onClick={() =>
                      setMoneySectionState(
                        moneySectionState === "" ? "collapse" : ""
                      )
                    }
                  ></i>
                  Money
                </div>
                <div className={moneySectionState}>
                  <div className="sub-heading">Seeking for:</div>
                  <div className="textbox no-of-founders">
                    <input type="text" />
                  </div>
                  <div className="sub-heading">Soft Money</div>
                  <div className="description">
                    Government grants, cash prices from competitions, etc.
                  </div>
                  <div className="textbox no-of-founders">
                    <input type="text" />
                  </div>
                  <div className="comment">Comment</div>
                  <div className="textbox comment-text-area">
                    <textarea />
                  </div>
                  <div className="sub-heading">Raised money this round</div>
                  <div className="description">
                    What's the target of this round?
                  </div>
                  <div className="textbox no-of-founders">
                    <input type="text" />
                  </div>
                  <div className="sub-heading">Pre-money evaluation</div>
                  <div className="description">
                    What's the pre money evaluation of the company?
                  </div>
                  <div className="textbox no-of-founders">
                    <input type="text" />
                  </div>
                </div>
              </div>
              <div className="col-sm-12" id="materials">
                <div className="separator"></div>
              </div>
              <div className="col-sm-12 details">
                <div className="heading">
                  <i
                    class={`fa ${
                      materialsSectionState === ""
                        ? "fa-chevron-up"
                        : "fa-chevron-down"
                    }`}
                    aria-hidden="true"
                    onClick={() =>
                      setMaterialsSectionState(
                        materialsSectionState === "" ? "collapse" : ""
                      )
                    }
                  ></i>
                  Materials
                </div>
                <div className={materialsSectionState}>
                  <div className="sub-heading">Slide decks</div>
                  <div className="description">
                    Add links to google drive, dropbox or any external services
                  </div>
                  <div className="text-box-heading col-sm-4 col-xs-4">Name</div>
                  <div className="text-box-heading col-sm-8 col-xs-8">
                    Source link
                  </div>
                  <div className="textbox name-text no-of-founders col-sm-4 col-xs-4">
                    <input type="text" />
                  </div>
                  <div className="textbox name-text no-of-founders col-sm-8 col-xs-8">
                    <input type="text" />
                  </div>
                  <div className="sub-heading col-sm-12">Product Demo</div>
                  <div className="description">
                    Add links to any external services
                  </div>
                  <div className="text-box-heading col-sm-4 col-xs-4">Name</div>
                  <div className="text-box-heading col-sm-8 col-xs-8">
                    Source link
                  </div>
                  <div className="textbox name-text no-of-founders col-sm-4 col-xs-4">
                    <input type="text" />
                  </div>
                  <div className="textbox name-text no-of-founders col-sm-8 col-xs-8">
                    <input type="text" />
                  </div>
                  <div className="sub-heading col-sm-12">
                    Blogs, videos, articles, and other mentions
                  </div>
                  <div className="description">
                    Add links to any external services
                  </div>
                  <div className="text-box-heading col-sm-4 col-xs-4">Name</div>
                  <div className="text-box-heading col-sm-8 col-xs-8">
                    Source link
                  </div>
                  <div className="textbox name-text no-of-founders col-sm-4 col-xs-4">
                    <input type="text" />
                  </div>
                  <div className="textbox name-text no-of-founders col-sm-8 col-xs-8">
                    <input type="text" />
                  </div>
                </div>
              </div>
              <div className="col-sm-12" id="contacts">
                <div className="separator"></div>
              </div>
              <div className="col-sm-12 details">
                <div className="heading">
                  <i
                    className={`fa ${
                      contactsSectionState === ""
                        ? "fa-chevron-up"
                        : "fa-chevron-down"
                    }`}
                    aria-hidden="true"
                    onClick={() =>
                      setContactsSectionState(
                        contactsSectionState === "" ? "collapse" : ""
                      )
                    }
                  ></i>
                  Contacts
                </div>
                <div className={contactsSectionState}>
                  <div className="sub-heading">Contact person</div>
                  <div className="textbox no-of-founders">
                    <input type="text" />
                  </div>
                  <div className="sub-heading">Location</div>
                  <div className="description">
                    Where is the headquarters located?
                  </div>
                  <div className="textbox no-of-founders">
                    <input type="text" />
                  </div>
                  <div className="sub-heading">Website</div>
                  <div className="textbox no-of-founders">
                    <input type="text" />
                  </div>
                  <div className="sub-heading">Founding member 1</div>
                  <div className="description">Linkedin</div>
                  <div className="textbox no-of-founders">
                    <input
                      type="text"
                      placeholder="https://www.linkedin.com/in/daria-ky..."
                    />
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </div>
                  <div className="sub-heading">Founding member 2</div>
                  <div className="description">Linkedin</div>
                  <div className="textbox no-of-founders">
                    <input type="text" />
                    <i class="fa fa-plus" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
              <div className="col-sm-12" id="social-profiles">
                <div className="separator"></div>
              </div>
              <div className="col-sm-12 details">
                <div className="heading">
                  <i
                    className={`fa ${
                      socialSectionState === ""
                        ? "fa-chevron-up"
                        : "fa-chevron-down"
                    }`}
                    aria-hidden="true"
                    onClick={() =>
                      setSocialSectionState(
                        socialSectionState === "" ? "collapse" : ""
                      )
                    }
                  ></i>
                  Social profiles
                </div>
                <div className={socialSectionState}></div>
              </div>
              <div className="col-sm-12" id="terms-conditions">
                <div className="separator"></div>
              </div>
              <div className="col-sm-12 details">
                <div className="heading">
                  <i
                    class={`fa ${
                      termsSectionState === ""
                        ? "fa-chevron-up"
                        : "fa-chevron-down"
                    }`}
                    aria-hidden="true"
                    onClick={() =>
                      setTermsSectionState(
                        termsSectionState === "" ? "collapse" : ""
                      )
                    }
                  ></i>
                  Terms and conditions
                </div>
                <div className={termsSectionState}>
                  <div className="description terms-condition col-sm-9">
                    By accepting these terms you grant the receiver of this form
                    the rights to store the data provided and share it with
                    relevant people in their networ
                  </div>
                  <div className="checkbox col-sm-12">
                    <input type="checkbox" />
                    <span>I agree to the general terms and conditions</span>
                  </div>
                  <div className="checkbox col-sm-12">
                    <input type="checkbox" />
                    <span>I agree that you can share this information</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="separator"></div>
              </div>
              <div className="row footer">
                <div className="col-sm-6 col-xs-4">
                  <button className="delete-btn">CANCEL</button>
                </div>
                <div className="col-sm-6 col-xs-8">
                  <button className="upload-logo-btn">SAVE CHANGES</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
