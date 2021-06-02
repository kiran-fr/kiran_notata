import React, { useState } from "react";
import "./notifications.scss";
import { ICONPOSITION, SETTINGSMENU } from "../constants";
import NotificationProfile from "../../../../assets/images/notification-profile.png";
import ButtonWithIcon from "../ui-kits/button-with-icon";
import NotificationAlarm from "../../../../assets/images/notification-alarm.png";
import NotificationSetting from "../../../../assets/images/notifications-settings.png";
import NotificationGroup from "../../../../assets/images/notification-group.png";
import eye from "../../../../assets/images/eye.png";
import eyeGray from "../../../../assets/images/eye-gray.png";

export default function Notifications({ setMenuSelected }) {
  const [isDropDown, setIsDropDown] = useState(false);
  return (
    <div className="notifications-container">
      <div className="notifications-container__card">
        <div className="card-heading notifications-container__header">
          <div className="card-heading notifications-container__heading">
            <i
              class="fa fa-chevron-left"
              aria-hidden="true"
              onClick={() => setMenuSelected(SETTINGSMENU.HOME)}
            ></i>
            Notifications
          </div>
          <div className="card-heading notifications-container__show">
            Show
            <i
              className={`fa ${
                isDropDown ? "fa-chevron-up" : "fa-chevron-down"
              }`}
              aria-hidden="true"
              onClick={() => {
                setIsDropDown(!isDropDown);
              }}
            >
              {isDropDown && (
                <div className="notifications-container__show__dropdown">
                  <div className="drop-down-item" onClick={() => {}}>
                    <img src={eye} />
                    <span className="text">Team</span>
                  </div>
                  <div className="drop-down-item" onClick={() => {}}>
                    <img src={eyeGray} />
                    <span className="text">Groups</span>
                  </div>
                  <div className="drop-down-item" onClick={() => {}}>
                    <img src={eye} />
                    <span className="text">Startups</span>
                  </div>
                  <div className="drop-down-item" onClick={() => {}}>
                    <img src={eyeGray} />
                    <span className="text">Reminders</span>
                  </div>
                  <div className="drop-down-item" onClick={() => {}}>
                    <img src={eye} />
                    <span className="text">Filter matches</span>
                  </div>
                </div>
              )}
            </i>
          </div>
        </div>
        <div className="notifications">
          <div className="notifications__notification">
            <img src={NotificationProfile} />
            <p className="notifications__notification__text">
              <span className="highlight">Stephanie Wykoff</span> invited you to
              join (as a member) group{" "}
              <span className="highlight">Business Angels</span>
            </p>
            <ButtonWithIcon
              className="notifications__notification__decline-btn"
              text="DECLINE"
              iconPosition={ICONPOSITION.NONE}
            ></ButtonWithIcon>
            <ButtonWithIcon
              className="notifications__notification__join-btn"
              iconName="check"
              text="JOIN"
              iconPosition={ICONPOSITION.START}
            ></ButtonWithIcon>
          </div>
          <div className="notifications__notification">
            <img src={NotificationProfile} />
            <p className="notifications__notification__text">
              <span className="highlight">Stephanie Wykoff</span> invited you to
              join (as a member) group{" "}
              <span className="highlight">Business Angels</span>
            </p>
          </div>
          <div className="notifications__notification">
            <img src={NotificationProfile} />
            <div>
              <div className="notifications__notification__text">
                <span className="highlight">Stephanie Wykoff</span> posted a new
                comment in group{" "}
                <span className="highlight">Great Startup 1</span>
              </div>
              <div className="notifications__notification__comment-text">
                This startup is really well!
              </div>
            </div>
          </div>
          <div className="notifications__notification">
            <img src={NotificationProfile} />
            <p className="notifications__notification__text">
              <span className="highlight">Stephanie Wykoff</span> invited you to
              join (as a member) group{" "}
              <span className="highlight">Business Angels</span>
            </p>
            <ButtonWithIcon
              className="notifications__notification__decline-btn"
              text="DECLINE"
              iconPosition={ICONPOSITION.NONE}
            ></ButtonWithIcon>
            <ButtonWithIcon
              className="notifications__notification__join-btn"
              iconName="check"
              text="JOIN"
              iconPosition={ICONPOSITION.START}
            ></ButtonWithIcon>
          </div>
          <div className="notifications__notification">
            <div className="img-src">
              <img src={NotificationGroup} />
            </div>
            <p className="notifications__notification__text">
              <span className="highlight">
                Stephanie Wykoff, Miranda Walsh, Sarah Parker, John Doe{" "}
              </span>
              and 15 other from <span className="highlight">Business Cats</span>
              group filled <span className="highlight">
                First impression
              </span>{" "}
              evaluation.
            </p>
          </div>
          <div className="notifications__notification">
            <div className="img-src">
              <img src={NotificationAlarm} />
            </div>
            <p className="notifications__notification__text">
              You set a reminder 30 days ago: Don’t forger to re-evaluate Great
              startup 1.
            </p>
            <ButtonWithIcon
              className="notifications__notification__decline-btn"
              text="RESCHEDULE"
              iconPosition={ICONPOSITION.NONE}
            ></ButtonWithIcon>
            <ButtonWithIcon
              className="notifications__notification__join-btn"
              iconName="check"
              text="DONE"
              iconPosition={ICONPOSITION.START}
            ></ButtonWithIcon>
          </div>
          <div className="notifications__notification">
            <img src={NotificationProfile} />
            <p className="notifications__notification__text">
              <span className="highlight">Stephanie Wykoff</span> invited you to
              join her team.
            </p>
            <ButtonWithIcon
              className="notifications__notification__decline-btn"
              text="DECLINE"
              iconPosition={ICONPOSITION.NONE}
            ></ButtonWithIcon>
            <ButtonWithIcon
              className="notifications__notification__join-btn"
              iconName="check"
              text="JOIN"
              iconPosition={ICONPOSITION.START}
            ></ButtonWithIcon>
          </div>
          <div className="notifications__notification">
            <div className="img-src">
              <img src={NotificationSetting} />
            </div>
            <div>
              <div className="notifications__notification__text">
                New match by filter
                <span className="highlight"> Filter 1 - Great Startup 1</span>
              </div>
              <div className="notifications__notification__tags-text">
                Funnel stage: Invested.
              </div>
              <div className="notifications__notification__tags-text">
                Tags: software, finance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
