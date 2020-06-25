import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";

import classes from "./GuildDialog.module.css";

const _JoinGuildForm = () => {
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
      <Button onClick={joinGuildClicked} className={classes.submitbtn}>
        Join Guild
      </Button>
    </div>
  );
};

export const JoinGuildForm = React.memo(_JoinGuildForm);
