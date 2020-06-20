import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
} from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  open: boolean;
  onSubmit?: () => void;
  onClose?: () => void;
  onExited?: () => void;
}

export interface IAlertProps {
  title: string;
  description: string;
  type: "alert";
}

export interface IConfirmProps {
  title: string;
  description: string;
  type: "confirm";
}

export interface IErrorProps {
  error: any;
  type: "error";
}

export type CommonDialogProps = (IAlertProps | IConfirmProps | IErrorProps) &
  IProps;

export const CommonDialog = (props: CommonDialogProps) => {
  const { t } = useTranslation(["common", "errors"]);

  const getDialogActions = () => {
    switch (props.type) {
      case "confirm": {
        return (
          <>
            <Button
              color="primary"
              variant="outlined"
              onClick={props.onClose}
              autoFocus
            >
              {t("common:no")}
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={props.onSubmit}
            >
              {t("common:yes")}
            </Button>
          </>
        );
      }
      case "alert": {
        return (
          <Button color="primary" variant="contained" onClick={props.onSubmit}>
            {t("common:ok")}
          </Button>
        );
      }
      case "error": {
        return (
          <Button color="primary" variant="contained" onClick={props.onSubmit}>
            {t("common:ok")}
          </Button>
        );
      }
    }
  };

  const getDialogTitle = () => {
    switch (props.type) {
      case "error":
        return t("common:error");
      case "alert":
        return props.title;
      case "confirm":
        return props.title;
    }
  };

  const getDialogDesc = () => {
    switch (props.type) {
      case "error": {
        console.log(props.error);
        return t(`errors:${props.error["message"]}`, props.error["fields"]);
      }
      case "alert":
        return props.description;
      case "confirm":
        return props.description;
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      onExited={props.onExited}
      TransitionComponent={Grow}
    >
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogContent>
        <DialogContentText>{getDialogDesc()}</DialogContentText>
      </DialogContent>
      <DialogActions>{getDialogActions()}</DialogActions>
    </Dialog>
  );
};
