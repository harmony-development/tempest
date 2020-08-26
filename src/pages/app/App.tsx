import React, { useLayoutEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router";
import { makeStyles, Theme, darken } from "@material-ui/core";
import { Connection } from "@harmony-dev/harmony-web-sdk";

import { HarmonyStorage } from "../../storage/HarmonyStorage";
import { Comms } from "../../comms/Comms";

import { GuildList } from "./GuildList/GuildList";
import { GuildDialog } from "./GuildDialog/GuildDialog";
import { ChannelList } from "./ChannelList/ChannelList";
import { ChatArea } from "./ChatArea/ChatArea";
import { focusChatInput } from "../../redux/reducers/UIReducer";
import { useDispatch } from "react-redux";

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
    width: "400px",
    overflowY: "auto",
    backgroundColor: darken(theme.palette.background.default, 0.25),
  },
  memberlist: {
    width: "350px",
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
  const dispatch = useDispatch();
  const history = useHistory();
  const { hash } = useLocation();

  useLayoutEffect(() => {
    const homeserver = HarmonyStorage.getHomeserver();
    const session = HarmonyStorage.getSession();
    const userid = HarmonyStorage.getUserID();
    if (!homeserver || !session || !userid) {
      history.push("/entry/serverselect");
      return;
    }
    if (!Comms.homeserver) {
      const newConn = new Connection(homeserver);
      newConn.session = session;
      Comms.bindEvents(newConn);
      Comms.connections[homeserver] = newConn;
      Comms.homeserver = homeserver;
    }
    // eslint-disable-next-line
  }, []);

  /**
   * We want to make sure there's a connection or else there will be problems
   */
  useLayoutEffect(() => {
    (async () => {
      try {
        const homeserver = HarmonyStorage.getHomeserver();
        if (homeserver) {
          Comms.getOrFederate(homeserver);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [hash]);

  const onKeyDown = useCallback((ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key !== "Tab") {
      dispatch(focusChatInput());
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className={classes.root} onKeyDown={onKeyDown} tabIndex={0}>
        <div className={classes.guildlist}>
          <GuildList />
        </div>
        <div className={classes.channellist}>
          <ChannelList />
        </div>
        <div className={classes.chat}>
          <ChatArea />
        </div>
        <div className={classes.memberlist}></div>
      </div>
      <GuildDialog />
    </>
  );
};

export const App = React.memo(_App);
