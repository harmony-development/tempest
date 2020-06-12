import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  TextField,
  makeStyles,
} from "@material-ui/core";

const addServerDialogStyles = makeStyles((theme) => ({
  dialogContent: {
    "& *": {
      marginBottom: theme.spacing(0.5),
    },
  },
}));

export const AddServerDialog = React.memo(
  (props: {
    serverAdded: (label: string, ip: string) => void;
    cancel: () => void;
    open: boolean;
  }) => {
    const classes = addServerDialogStyles();
    const [label, setLabel] = useState("");
    const [hostname, setHostName] = useState("");

    const onLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabel(event.currentTarget.value);
    };

    const onHostnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setHostName(event.currentTarget.value);
    };

    return (
      <Dialog open={props.open} onClose={props.cancel}>
        <DialogTitle>Add Server</DialogTitle>
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
          <Button onClick={props.cancel}>Cancel</Button>
          <Button
            onClick={() => props.serverAdded(label, hostname)}
            disabled={!hostname || !label}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
