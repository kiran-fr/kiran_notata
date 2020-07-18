import React from "react";
import classnames from "classnames";
import {
  container,
  small_container,
  center_container,
  inner_container,
  success_box
} from "../../elements/Style.module.css";

export const Awaiting = () => {
  return (
    <div className={classnames(container, small_container, center_container)}>
      <div className={inner_container}>
        <div className={success_box}>
          <h4>We have sent you an email 🚀</h4>
          <div>
            To be able to log in you have to verify your identity by clicking
            the link in the email.
          </div>
        </div>
      </div>
    </div>
  );
};
