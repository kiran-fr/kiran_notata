import React, { useState } from "react";
import RadioButton from "../../../ui-kits/radio-button";
import InputCheckBox from "../../../ui-kits/check-box";

export default function Settings() {
  const [showMembersPrivacy, setShowMembersPrivacy] = useState(true);
  return (
    <div className="settings-container">
      <div className="header">
        <span className="material-icons">share</span>
        <span className="heading">Stage</span>
      </div>
      <div className="options">
        <div className="option">
          <InputCheckBox></InputCheckBox>
          Members can see scores.
        </div>
        <div className="option">
          <InputCheckBox></InputCheckBox>
          Everyone can see everyone, including individual scores.
        </div>
        <div className="option">
          <InputCheckBox></InputCheckBox>
          Allow members to share with group.
          <i
            class={`fa ${
              !showMembersPrivacy ? "fa-chevron-up" : "fa-chevron-down"
            }`}
            aria-hidden="true"
            onClick={() => setShowMembersPrivacy(!showMembersPrivacy)}
          ></i>
          {showMembersPrivacy && (
            <div className="option-options">
              <div className="option">
                <InputCheckBox></InputCheckBox>
                Members can see and post comments.
              </div>
              <div className="option">
                <InputCheckBox></InputCheckBox>
                Members can invite members.
              </div>
              <div className="option">
                <InputCheckBox></InputCheckBox>
                Members can share their evaluations.
              </div>
              <div className="option">
                <InputCheckBox></InputCheckBox>
                Members can share their startups.
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="header">
        <span class="material-icons">lock</span>
        <span className="heading">Privacy</span>
      </div>
      <div className="options">
        <div className="option">
          <RadioButton
            name="privacy"
            label="Private"
            id="privacy-private"
            checked={false}
          ></RadioButton>
          <div className="radio-button-description">
            Only I can invite members. My team cannot see this group.
          </div>
        </div>
        <div className="option">
          <RadioButton
            name="privacy"
            label="Public"
            id="privacy-public"
            checked={false}
          ></RadioButton>
          <div className="radio-button-description">
            Everyone can invite members. My team can see this group.
          </div>
        </div>
      </div>
      <div className="header">
        <span className="material-icons">notifications</span>
        <span className="heading">Notifications from this group</span>
      </div>
      <div className="options">
        <div className="option">
          <InputCheckBox></InputCheckBox>
          Comments
        </div>
        <div className="option">
          <InputCheckBox></InputCheckBox>
          Evaluations
        </div>
        <div className="option">
          <InputCheckBox></InputCheckBox>
          New members
        </div>
      </div>
    </div>
  );
}
