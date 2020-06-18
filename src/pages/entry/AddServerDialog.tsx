import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  TextField,
  makeStyles,
  Grow,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

const addServerDialogStyles = makeStyles((theme) => ({
  dialogContent: {
    "& *": {
      marginBottom: theme.spacing(0.5),
    },
  },
}));

export const _AddServerDialog = (props: {
  serverAdded: (label: string, ip: string) => void;
  cancel: () => void;
  open: boolean;
}) => {
  const classes = addServerDialogStyles();
  const i18n = useTranslation(["entry"]);
  const [label, setLabel] = useState("");
  const [hostname, setHostName] = useState("");

  const onLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.currentTarget.value);
  };

  const onHostnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHostName(event.currentTarget.value);
  };

  return (
    <Dialog open={props.open} onClose={props.cancel} TransitionComponent={Grow}>
      <DialogTitle>{i18n.t("entry:add-server")}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          label="Label"
          onChange={onLabelChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Hostname"
          onChange={onHostnameChange}
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.cancel}>{i18n.t("entry:cancel")}</Button>
        <Button
          onClick={() => props.serverAdded(label, hostname)}
          disabled={!hostname || !label}
        >
          {i18n.t("entry:add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const AddServerDialog = React.memo(_AddServerDialog);
