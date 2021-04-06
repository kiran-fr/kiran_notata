// Created By : Siva
// Date : 6/04/2021

import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Button } from "../index";

import "./style.css";

export const Popup = ({
  handleModalClose,
  isOpen,
  btnprimaryTxt,
  btnSecondaryTxt,
  header,
  content,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={handleModalClose}
      aria-labelledby="responsive-dialog-title"
      title={<i class="closeIcon fa fa-times" aria-hidden="true"></i>}
    >
      <DialogTitle className="dialogTitle" id="responsive-dialog-title">
        {header}
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button
          size="small2"
          autoFocus
          onClick={handleModalClose}
          buttonStyle="white"
        >
          {btnprimaryTxt}
        </Button>
        <Button
          size="small2"
          onClick={handleModalClose}
          buttonStyle="primary"
          autoFocus
        >
          {btnSecondaryTxt}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
