import React from "react";
import classnames from "classnames";

import {
  container,
  content,
  inner,
  close_modal,
  ghost,
  main_content,
  modal_header,
  modal_title,
  modal_footer
} from "./Modal.module.css";

import { Button } from "../NotataComponents/";

export const Modal = ({ close, title, ...children }) => {
  return (
    <div className={container}>
      <div className={ghost} />

      <div className={content}>
        <div className={inner}>
          <div className={modal_header}>
            {title && <div className={modal_title}>{title}</div>}

            <div onClick={close} className={close_modal}>
              <i className="fal fa-times" />
            </div>
          </div>

          <div className={main_content} {...children} />

          <div className={modal_footer}>
            <Button onClick={close} size="medium" buttonStyle="secondary">
              Canncel
            </Button>

            <Button size="medium" type="right_arrow">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
