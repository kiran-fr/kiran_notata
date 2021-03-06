import React, { useState } from "react";
import "./Settings.scss";
import evaluationTemplate from "../../../assets/images/settings_evaluations-template.png";
import notifications from "../../../assets/images/settings_notifications.png";
import webForm from "../../../assets/images/settings_web-form.png";
import tags from "../../../assets/images/settings_tags.png";
import yourProfile from "../../../assets/images/settings_your-profile.png";
import yourTeam from "../../../assets/images/settings_your-team.png";
import { evaluation_templates_page } from "../../../definitions";
import { tags1 } from "../../../definitions";
import { funnels1 } from "../../../definitions";
import { web_form } from "../../../definitions";
import { your_team } from "../../../definitions";
import { notification } from "../../../definitions";
import { setting_profile } from "../../../definitions";
// import YourTeam from "./your-team";
// import WebForm from "./web-form";
// import Notifications from "./notifications";
// import Tags from "./tags";
// import Funnels from "./funnels";
// import { ElevationTemplates } from "../../NewDesign/srv_startup/pages/StartupPage/Evaluations/evaluation-templates";
// import ProfileSettings from "./profile";

export default function Settings({ history }) {
  const [isEvaluationCardVisible, setEvaluationCard] = useState(true);

  return (
    <div className="settings-container">
      <div className="card settings-container__card">
        <div className="settings-container__card__heading">
          <i class="fa fa-chevron-left" aria-hidden="true" />
          Settings
        </div>
        <div className="settings-container__card__separator" />
        <div className="menu-container">
          <div
            className="menu-container__menu"
            onClick={() => history.push(evaluation_templates_page)}
          >
            <img src={evaluationTemplate} />
            <div className="menu-container__menu__name">
              Evaluation templates
            </div>
          </div>
          <div
            className="menu-container__menu"
            onClick={() => history.push(tags1)}
          >
            <img src={tags} />
            <div className="menu-container__menu__name">Tags</div>
          </div>
          <div
            className="menu-container__menu"
            onClick={() => history.push(funnels1)}
          >
            <img src={tags} />
            <div className="menu-container__menu__name">Funnels</div>
          </div>
          <div
            className="menu-container__menu"
            onClick={() => history.push(your_team)}
          >
            <img src={yourTeam} />
            <div className="menu-container__menu__name">Your Team</div>
          </div>
          <div
            className="menu-container__menu"
            onClick={() => history.push(web_form)}
          >
            <img src={webForm} />
            <div className="menu-container__menu__name">Web Form</div>
          </div>
          <div
            className="menu-container__menu"
            onClick={() => history.push(setting_profile)}
          >
            <img src={yourProfile} />
            <div className="menu-container__menu__name">User Profile</div>
          </div>
          {/* <div
            className="menu-container__menu"
            onClick={() => history.push("/")}
          >
            <img src={accountSettings} />
            <div className="menu-container__menu__name">Account Settings</div>
          </div> */}
          <div
            className="menu-container__menu"
            onClick={() => history.push(notification)}
          >
            <img src={notifications} />
            <div className="menu-container__menu__name">Notifications</div>
          </div>
        </div>
        {/* {isEvaluationCardVisible && (
          <div className="card Settings-container__evaluation-card">
            <div className="evaluation-header">
              <div className="evaluation-header__name">
                Evaluation templates
              </div>
              <i
                className="fa fa-times"
                aria-hidden="true"
                onClick={() => setEvaluationCard(false)}
              />
            </div>
            <p className="Settings-container__evaluation-card__description">
              In the setting tab, you can create a new evaluation template or
              edit the existing one.
            </p>
            <div className="Settings-container__evaluation-card__footer">
              <span className="Settings-container__evaluation-card__footer__noOfEvals">
                4/10
              </span>
              <span className="Settings-container__evaluation-card__footer__evals">
                (Evaluations)
              </span>
              <div className="Settings-container__evaluation-card__footer__action-container">
                <ButtonWithIcon
                  className="prev-btn"
                  iconName="chevron_left"
                  text="Previous"
                  iconPosition={ICONPOSITION.START}
                />
                <ButtonWithIcon
                  className="next-btn prev-btn"
                  iconName="chevron_right"
                  text="Next"
                  iconPosition={ICONPOSITION.END}
                />
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
