import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { makeStyles, Theme, darken } from "@material-ui/core";
import { Connection } from "@harmony-dev/harmony-web-sdk";

import { HarmonyStorage } from "../../storage/HarmonyStorage";
import {
  setCurrentGuildID,
  setCurrentChannelID,
} from "../../redux/reducers/AppReducer";
import { Comms } from "../../comms/Comms";
import { useDialog } from "../../components/dialog/CommonDialogContext";

import { GuildList } from "./guildlist/GuildList";
import { GuildDialog } from "./guilddialog/GuildDialog";

const appStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    overflow: "auto",
  },
  guildlist: {
    padding: "8px",
    backgroundColor: darken(theme.palette.background.default, 0.5),
    borderRight: "1px solid grey",
    display: "flex",
    flexDirection: "column",
  },
  channellist: {
    width: "300px",
    overflowY: "auto",
    backgroundColor: darken(theme.palette.background.default, 0.25),
  },
  memberlist: {
    width: "400px",
    overflowY: "auto",
    backgroundColor: darken(theme.palette.background.default, 0.25),
  },
  chat: {
    display: "flex",
    flexDirection: "column",
    flexFlow: "column",
    width: "100%",
    height: "100%",
  },
}));

const _App = () => {
  const { guildid, channelid } = useParams<{
    guildid?: string;
    channelid?: string;
  }>();
  const classes = appStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const homeserver = HarmonyStorage.getHomeserver();
    const session = HarmonyStorage.getSession();
    const userid = HarmonyStorage.getUserID();
    if (!homeserver || !session || !userid) {
      history.push("/entry/serverselect");
      return;
    }
    if (!Comms.homeserver) {
      Comms.homeserver = homeserver;
      Comms.connections[homeserver] = new Connection(homeserver);
      Comms.connections[homeserver].session = session;
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(setCurrentGuildID(guildid));
    // eslint-disable-next-line
  }, [guildid]);

  useEffect(() => {
    dispatch(setCurrentChannelID(channelid));
    // eslint-disable-next-line
  }, [channelid]);

  return (
    <>
      <div className={classes.root}>
        <div className={classes.guildlist}>
          <GuildList />
        </div>
        <div className={classes.channellist}></div>
        <div className={classes.chat}></div>
        <div className={classes.memberlist}></div>
      </div>
      <GuildDialog />
    </>
  );
};

export const App = React.memo(_App);
