import React, { useState } from "react";
import { TextField, Button, makeStyles, Theme } from "@material-ui/core";

const joinGuildFormStyles = makeStyles((theme: Theme) => ({
  submitBtn: {
    marginTop: theme.spacing(1),
  },
}));

const _JoinGuildForm = () => {
  const classes = joinGuildFormStyles();
  const [joinCode, setJoinCode] = useState("");

  const joinCodeFieldChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinCode(e.currentTarget.value);
  };

  const joinGuildClicked = () => {};

  return (
    <div>
      <TextField
        label="Join Code"
        variant="outlined"
        fullWidth
        value={joinCode}
        onChange={joinCodeFieldChanged}
      />
      <Button onClick={joinGuildClicked} className={classes.submitBtn}>
        Join Guild
      </Button>
    </div>
  );
};

export const JoinGuildForm = React.memo(_JoinGuildForm);
