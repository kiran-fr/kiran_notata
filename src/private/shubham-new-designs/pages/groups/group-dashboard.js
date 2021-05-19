import React, { useState } from "react";
import "./group-dashboard.scss";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}
export default function GroupDashboard() {
  const [dropDownState, setDropDownState] = useState(false);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="group-dashboard-container">
      <div className="row">
        <div className="col-sm-10 col-xs-12">
          <div className="col-sm-7">
            <div className="card">
              <div className="group-dashboard-container__card-heading">
                <span class="material-icons">lock</span>Band of Angels
                <span
                  class="material-icons group-dashboard-container__browse-card"
                  onClick={() => setDropDownState(!dropDownState)}
                >
                  {" "}
                  more_horiz{" "}
                </span>
              </div>
              {dropDownState && (
                <div className="group-dashboard-container__browse-card__drop-dwon">
                  <div
                    className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                    onClick={() => null}
                  >
                    <span class="material-icons settings">content_copy</span>
                    <span className="text">SETTINGS</span>
                  </div>
                  <div
                    className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                    onClick={() => null}
                  >
                    <span class="material-icons settings">edit</span>
                    <span className="text">EDIT</span>
                  </div>
                  <div
                    className="material-icons group-dashboard-container__browse-card__drop-dwon__item"
                    onClick={() => null}
                  >
                    <span class="material-icons settings">groups</span>
                    <span className="text">CREATE NEW GROUP</span>
                  </div>
                  <div
                    className="material-icons group-dashboard-container__browse-card__drop-dwon__item leave"
                    onClick={() => null}
                  >
                    <span class="material-icons leave">delete</span>
                    <span className="text">DELETE GROUP</span>
                  </div>
                </div>
              )}
              <div>
                <p className="group-dashboard-container__group-details">
                  Band of Angels was the first high-tech angel investment group
                  in the Norway and continues today, with millions of dollars of
                  annual investment into 20+ startups each year.
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-5">
            <div className="card">
              <Tabs value={value} onChange={handleChange}>
                <Tab label="Admin View" {...a11yProps(0)} />
                <Tab label="Member View" {...a11yProps(1)} />
              </Tabs>
              <div className="users-container">
                <div className="users-container__user-count">
                  <div className="users-container__user-count__name">
                    10 evaluation templates
                  </div>
                  <div className="users-container__user-count__action">
                    <div className="users-container__user-count__action__btn">
                      Manage templates
                    </div>
                  </div>
                </div>
                <div className="users-container__user-count">
                  <div className="users-container__user-count__name">
                    <u>4 members</u>
                  </div>
                  <div className="users-container__user-count__action">
                    <div className="users-container__user-count__action__btn">
                      Invite members
                    </div>
                  </div>
                </div>
                <div className="users-container__user-count">
                  <div className="users-container__user-count__name">
                    2 admins
                  </div>
                  <div className="users-container__user-count__action">
                    <i
                      class={`users-container__user-count__action__icon fa fa-chevron-down`}
                      aria-hidden="true"
                      onClick={() => null}
                    ></i>
                  </div>
                </div>
                <div className="users-container__user-count">
                  <div className="users-container__user-count__name">
                    3 startups
                  </div>
                  <div className="users-container__user-count__action">
                    <div className="users-container__user-count__action__btn">
                      Manage Startups
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
