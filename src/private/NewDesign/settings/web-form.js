import React from "react";
import "./web-form.scss";
import { ICONPOSITION, SETTINGSMENU } from "../../NewDesign/srv_startup/pages/constants";
import copy from "../../../assets/images/copy.png";
import ButtonWithIcon from "../../NewDesign/srv_startup/pages/ui-kits/button-with-icon";

export default function WebForm({ setMenuSelected }) {
  return (
    <div className="web-form-container">
      <div className="card web-form-container__card">
        <div className="card-heading web-form-container__heading">
          <i
            class="fa fa-chevron-left"
            aria-hidden="true"
            onClick={() => setMenuSelected(SETTINGSMENU.HOME)}
          ></i>
          Web Form
        </div>
        <div className="web-form">
          <p className="web-form__description">
            This form can be posted on your website. Please copy and paste the
            embeddable code below, or refer to the link.
          </p>
          <div className="web-form__link">Link</div>
          <p className="web-form__link-url">
            https://d1nLcbGO4xMlamugkR2OuCnjGgU_eU1yduJSdWYDE7
          </p>
          <div className="web-form__copy-link">
            <img src={copy}></img> Copy Link
          </div>
          <div className="web-form__code-heading">CODE</div>
          <div className="web-form__code-iframe">
            {`<iframe src="https://www.notata.io/public/b2d2c1b6-5a40-10d8-3780-4dbef72ce170/form.html" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; border: none;"></iframe>`}
          </div>
          <div className="web-form__copy-link">
            <img src={copy}></img> Copy code
          </div>
          <div className="web-form__customization-container">
            <ButtonWithIcon
              className="web-form__customization-container__customize-btn"
              iconName="add"
              text="Customize form"
              iconPosition={ICONPOSITION.NONE}
            ></ButtonWithIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
