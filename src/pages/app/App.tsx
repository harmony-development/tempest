import React, { useLayoutEffect } from "react";
import { useHistory } from "react-router";
import { makeStyles, Theme, darken } from "@material-ui/core";
import { Connection } from "@harmony-dev/harmony-web-sdk";

import { HarmonyStorage } from "../../storage/HarmonyStorage";
import { Comms } from "../../comms/Comms";

import { GuildList } from "./guildlist/GuildList";
import { GuildDialog } from "./guilddialog/GuildDialog";
import { ChannelList } from "./channellist/ChannelList";

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
  const classes = appStyles();
  const history = useHistory();

  useLayoutEffect(() => {
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

  return (
    <>
      <div className={classes.root}>
        <div className={classes.guildlist}>
          <GuildList />
        </div>
        <div className={classes.channellist}>
          <ChannelList />
        </div>
        <div className={classes.chat}></div>
        <div className={classes.memberlist}></div>
      </div>
      <GuildDialog />
    </>
  );
};

export const App = React.memo(_App);
