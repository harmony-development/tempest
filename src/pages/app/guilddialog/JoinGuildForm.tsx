import React, { useState } from "react";
import { TextField, Button, makeStyles, Theme } from "@material-ui/core";
import { useSelector } from "react-redux";

import { HostSelection } from "../../../components/HostSelection";
import { RootState } from "../../../redux/redux";
import { Comms } from "../../../comms/Comms";

const joinGuildFormStyles = makeStyles((theme: Theme) => ({
  formEntry: {
    marginTop: theme.spacing(1),
  },
}));

const _JoinGuildForm = () => {
  const classes = joinGuildFormStyles();
  const hosts = useSelector((state: RootState) => state.appReducer.hosts);
  const [host, setHost] = useState(Comms.homeserver);
  const [customHost, setCustomHost] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const joinCodeFieldChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinCode(e.currentTarget.value);
  };

  const joinGuildClicked = () => {};

  return (
    <div>
      <HostSelection
        host={host}
        setHost={setHost}
        hosts={hosts}
        customHost={customHost}
        setCustomHost={setCustomHost}
      />
      <TextField
        label="Join Code"
        variant="outlined"
        fullWidth
        value={joinCode}
        onChange={joinCodeFieldChanged}
        className={classes.formEntry}
      />
      <Button onClick={joinGuildClicked} className={classes.formEntry}>
        Join Guild
      </Button>
    </div>
  );
};

export const JoinGuildForm = React.memo(_JoinGuildForm);
