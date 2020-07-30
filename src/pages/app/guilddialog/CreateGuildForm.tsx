import React, { useState, useCallback } from "react";
import { TextField, Button } from "@material-ui/core";

import { Comms } from "../../../comms/Comms";

import classes from "./GuildDialog.module.css";

const _CreateGuildForm = () => {
  const [guildName, setGuildName] = useState("");

  const guildNameFieldChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuildName(e.currentTarget.value);
  };

  const createGuildClicked = useCallback(async () => {
    const resp = await Comms.getHomeserverConn().createGuild(guildName, "");
    console.log(resp);
  }, [guildName]);

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
