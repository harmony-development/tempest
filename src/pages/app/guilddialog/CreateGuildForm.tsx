import React, { useState, useCallback } from "react";
import { TextField, Button, makeStyles, Theme } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { Comms } from "../../../comms/Comms";
import { addGuildToList, setGuild } from "../../../redux/reducers/AppReducer";
import { RootState } from "../../../redux/redux";
import { HostSelection } from "../../../components/HostSelection";
import { setGuildDialogOpen } from "../../../redux/reducers/UIReducer";

const createGuildFormStyles = makeStyles((theme: Theme) => ({
  menuEntry: {
    marginTop: theme.spacing(1),
  },
}));

const _CreateGuildForm = () => {
  const dispatch = useDispatch();
  const classes = createGuildFormStyles();
  const hosts = useSelector((state: RootState) => state.appReducer.hosts);
  const [host, setHost] = useState(Comms.homeserver);
  const [customHost, setCustomHost] = useState("");
  const [guildName, setGuildName] = useState("");

  const guildNameFieldChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setGuildName(e.currentTarget.value);
    },
    []
  );

  const createGuildClicked = useCallback(async () => {
    const resp = await Comms.getHomeserverConn().createGuild(guildName, "");
    const guildID = resp.message?.getGuildId();
    if (guildID) {
      await Comms.getHomeserverConn().addGuildToGuildList(
        guildID,
        "http://127.0.0.1:2290"
      );
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
      dispatch(setGuildDialogOpen(false));
    }
    // eslint-disable-next-line
  }, [dispatch, guildName, host, customHost]);

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
