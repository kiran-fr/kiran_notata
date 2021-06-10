import React, { useState } from "react";
import "./web-form.scss";
import {
  ICONPOSITION,
  SETTINGSMENU,
} from "../../NewDesign/srv_startup/pages/constants";
import copy from "../../../assets/images/copy.png";
import ButtonWithIcon from "../../NewDesign/srv_startup/pages/ui-kits/button-with-icon";
import { useQuery } from "@apollo/client";
import { accountGet } from "../../Apollo/Queries";
import { settings } from "../../../definitions";

export default function WebForm({ history }) {
  // States
  const [copyUrlSuccess, setCopyUrlSuccess] = useState(false);
  const [copyIframeSuccess, setCopyIframeSuccess] = useState(false);

  // Queries
  const accountQuery = useQuery(accountGet);

  // Data maps
  let account = accountQuery.data?.accountGet || {};

  const iFrameUrl =
    `${window.location.protocol}//` +
    `${window.location.host}/` +
    `public/` +
    `creative_new/` +
    `${account.id || "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}/` +
    `form.html`;

  const iFrameContent = `<iframe src="${iFrameUrl}" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; border: none;"></iframe>`;

  function copyIframeToClipboard() {
    navigator.clipboard.writeText(iFrameContent);
    setCopyIframeSuccess(true);
    setCopyUrlSuccess(false);
  }

  function copyUrlToClipboard() {
    navigator.clipboard.writeText(iFrameUrl);
    setCopyIframeSuccess(false);
    setCopyUrlSuccess(true);
  }

  return (
    <div className="web-form-container">
      <div className="card web-form-container__card">
        <div className="card-heading web-form-container__heading">
          <i
            className="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => history.push(settings)}
          />
          Web Form
        </div>
        <div className="web-form">
          <p className="web-form__description">
            This form can be posted on your website. Please copy and paste the
            embeddable code below, or refer to the link.
          </p>
          <div className="web-form__link">Link</div>
          <p className="web-form__link-url">{iFrameUrl}</p>
          <div className="web-form__copy-link" onClick={copyUrlToClipboard}>
            <img src={copy} />
            {copyUrlSuccess ? "Link copied" : "Copy Link"}
          </div>
          <div className="web-form__code-heading">CODE</div>
          <div className="web-form__code-iframe">{iFrameContent}</div>
          <div className="web-form__copy-link" onClick={copyIframeToClipboard}>
            <img src={copy} />
            {copyIframeSuccess ? "Code copied" : "Copy code"}
          </div>
          <div className="web-form__customization-container">
            <ButtonWithIcon
              className="web-form__customization-container__customize-btn"
              iconName="add"
              text="Customize form"
              iconPosition={ICONPOSITION.NONE}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
