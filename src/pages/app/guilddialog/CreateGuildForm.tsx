import React, { useState, useCallback } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { Comms } from "../../../comms/Comms";
import { addGuildToList, setGuild } from "../../../redux/reducers/AppReducer";
import { RootState } from "../../../redux/redux";

const createGuildFormStyles = makeStyles((theme: Theme) => ({
  menuEntry: {
    marginTop: theme.spacing(1),
  },
}));

const _CreateGuildForm = () => {
  const dispatch = useDispatch();
  const classes = createGuildFormStyles();
  const hosts = useSelector((state: RootState) => state.appReducer.hosts);
  const [showCustomHostField, setShowCustomHostField] = useState(false);
  const [host, setHost] = useState("");
  const [customHost, setCustomHost] = useState("");
  const [guildName, setGuildName] = useState("");

  const guildNameFieldChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGuildName(e.currentTarget.value);
    },
    []
  );

  const onHostSelectChange = useCallback(
    (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      setShowCustomHostField(!!e.target.value);
      setHost(e.target.value as string);
    },
    []
  );

  const onCustomHostChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomHost(e.currentTarget.value);
    },
    []
  );

  const createGuildClicked = useCallback(async () => {
    const targetHost = host || customHost;
    const resp = await Comms.getHomeserverConn().createGuild(guildName, "");
    const guildID = resp.message?.getGuildId();
    if (guildID) {
      dispatch(
        addGuildToList({
          guildID,
          host: Comms.homeserver,
        })
      );
      const guildInfoResp = await Comms.getHomeserverConn().getGuild(guildID);
      dispatch(
        setGuild({
          entry: {
            guildID,
            host: Comms.homeserver,
          },
          guild: {
            name: guildInfoResp.message?.getGuildName(),
            owner: guildInfoResp.message?.getGuildOwner(),
            picture: guildInfoResp.message?.getGuildPicture(),
          },
        })
      );
    }
    // eslint-disable-next-line
  }, [dispatch, guildName, host, customHost]);

  return (
    <div>
      <Select
        value={host}
        fullWidth
        variant="outlined"
        onChange={onHostSelectChange}
        displayEmpty
      >
        <MenuItem value="">Other</MenuItem>
        {Object.keys(hosts).map((h) => (
          <MenuItem key={h} value={h}>
            {h}
          </MenuItem>
        ))}
      </Select>
      {!showCustomHostField ? (
        <TextField
          label="Custom Host"
          variant="outlined"
          fullWidth
          onChange={onCustomHostChange}
          value={customHost}
          className={classes.menuEntry}
        />
      ) : undefined}
      <TextField
        label="Guild Name"
        variant="outlined"
        fullWidth
        onChange={guildNameFieldChanged}
        value={guildName}
        className={classes.menuEntry}
      />
      <Button onClick={createGuildClicked} className={classes.menuEntry}>
        Create Guild
      </Button>
    </div>
  );
};

export const CreateGuildForm = React.memo(_CreateGuildForm);
