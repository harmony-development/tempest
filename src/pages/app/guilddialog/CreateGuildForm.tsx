import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";

import classes from "./GuildDialog.module.css";

const _CreateGuildForm = () => {
  const [guildName, setGuildName] = useState("");

  const guildNameFieldChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuildName(e.currentTarget.value);
  };

  const createGuildClicked = () => {};

  return (
    <div>
      <TextField
        label="Guild Name"
        variant="outlined"
        fullWidth
        onChange={guildNameFieldChanged}
        value={guildName}
      />
      <Button onClick={createGuildClicked} className={classes.submitbtn}>
        Create Guild
      </Button>
    </div>
  );
};

export const CreateGuildForm = React.memo(_CreateGuildForm);
