// Created By : Siva
// Date : 6/04/2021

import React, { useEffect } from "react";
import { Button } from "../Buttons/Buttons";
import "./style.css";

export function Modal({
  close,
  noKill,
  submit,
  title,
  disableFoot,
  loading,
  showScrollBar,
  submitTxt,
  closeTxt,
  submitButtonStyle,
  submitButtonIcon,
  intermidate,
  intermidateTxt,
  disabled,
  intermidateStyle,
  innerClassName,
  ...children
}) {
  useEffect(() => {
    function downHandler(e) {
      e.key === "Escape" && close(e);
      // e.key === "Enter" && !loading && submit && submit(e);
    }
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [close, loading, submit]);

  return (
    <div className={"container"}>
      <div className={"ghost"} />
      <div
        style={{ overflow: showScrollBar ? "hidden" : "auto" }}
        className={"content"}
        onClick={event => {
          if (event.target === event.currentTarget) {
            close(event);
          }
        }}
      >
        <div className={`inner ${innerClassName || ""}`}>
          {title && (
            <div className={"modal_header"}>
              {title && <div className={"modal_title"}>{title}</div>}

              {!noKill && (
                <div onClick={close} className={"close_modal"}>
                  <i className="fal fa-times" />
                </div>
              )}
            </div>
          )}

          <div
            style={{
              overflowY: showScrollBar ? "scroll" : "hidden",
              maxHeight: showScrollBar ? "60vh" : "auto",
            }}
            className={`${showScrollBar && "scrollbar"} main_content`}
            {...children}
          />

          {(close || submit) && !disableFoot && (
            <div className={"modal_footer"}>
              {close && closeTxt && (
                <Button
                  onClick={close}
                  style={{ display: "inline" }}
                  size="small1"
                  buttonStyle="white"
                >
                  {closeTxt}
                </Button>
              )}
              {intermidate && intermidateTxt && (
                <Button
                  onClick={intermidate}
                  style={{ display: "inline" }}
                  size="small1"
                  buttonStyle={intermidateStyle || "primary"}
                >
                  {intermidateTxt}
                </Button>
              )}
              {submit && (
                <Button
                  onClick={!loading && submit}
                  buttonStyle={submitButtonStyle || "primary"}
                  size="small1"
                  disabled={disabled ? disabled : false}
                  style={{ display: "inline" }}
                  type={submitButtonIcon || ""}
                  loading={loading}
                >
                  {submitTxt}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
