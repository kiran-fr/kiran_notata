import React from "react";
import "./notification-top-menu.scss";
import {
  ICONPOSITION,
  SETTINGSMENU,
} from "../../../private/shubham-new-designs/pages/constants";
import NotificationProfile from "../../../assets/images/notification-profile.png";
import ButtonWithIcon from "../../../private/shubham-new-designs/pages/ui-kits/button-with-icon";
import NotificationAlarm from "../../../assets/images/notification-alarm.png";
import NotificationSetting from "../../../assets/images/notifications-settings.png";
import NotificationGroup from "../../../assets/images/notification-group.png";

export default function NotificationsDropDown() {
  return (
    <div className="notification-menu__dropdown">
      <div className="notifications">
        <div className="notifications__notification">
          <img src={NotificationProfile} />
          <div>
            <p className="notifications__notification__text">
              <span className="highlight">Stephanie Wykoff</span> invited you to
              join (as a member) group{" "}
              <span className="highlight">Business Angels</span>
            </p>
            <div className="notifications__notification__actions">
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
          </div>
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
          <div>
            <p className="notifications__notification__text">
              <span className="highlight">Stephanie Wykoff</span> invited you to
              join (as a member) group{" "}
              <span className="highlight">Business Angels</span>
            </p>
            <div className="notifications__notification__actions">
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
          </div>
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
          <div>
            <p className="notifications__notification__text">
              <span className="highlight">Stephanie Wykoff</span> invited you to
              join (as a member) group{" "}
              <span className="highlight">Business Angels</span>
            </p>
            <div className="notifications__notification__actions">
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
          </div>
        </div>
        <div className="notifications__notification">
          <img src={NotificationProfile} />
          <div>
            <p className="notifications__notification__text">
              <span className="highlight">Stephanie Wykoff</span> invited you to
              join (as a member) group{" "}
              <span className="highlight">Business Angels</span>
            </p>
            <div className="notifications__notification__actions">
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
          </div>
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
      <div className="notification-menu__dropdown__footer">
        See full list of notifications{" "}
        <i class={`fa fa-chevron-down `} aria-hidden="true"></i>
      </div>
    </div>
  );
}
