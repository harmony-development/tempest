import React, { useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router";
import {
  HarmonyConnection,
  HomeServer,
  SocketEvent,
} from "@harmony-dev/harmony-node-sdk";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { makeStyles, Theme, darken } from "@material-ui/core";

import { Comms } from "../../comms/Comms";
import { HarmonyStorage } from "../../storage/HarmonyStorage";
import { useToast } from "../../components/toast/SnackbarContext";
import {
  setGuildID,
  setChannelID,
  setGuildsList,
} from "../../redux/reducers/AppReducer";
import { useDialog } from "../../components/dialog/CommonDialogContext";

import { GuildList } from "./guildlist/GuildList";
import { GuildDialog } from "./guilddialog/GuildDialog";

/**
 * If this value is true, that means that the user got disconnected for the first time.
 * That means that he should be shown the 'disconnected' alert.
 * Without this, the alert would get spammed constantly because of the reconnects.
 */
let firstDisconnect = true;

/**
 * This prevents what I like to call the 'JS Fork Bomb'
 * basically if the error and close event fire at the same time (which happens if the host is offline),
 * the number of error events will double every time
 */
let isReconnecting = false;

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
  const i18n = useTranslation(["network"]);
  const classes = appStyles();
  const dispatch = useDispatch();
  const toast = useToast();
  const dialog = useDialog();
  const history = useHistory();

  const disconnectEvent = useCallback(() => {
    if (firstDisconnect) {
      toast({
        severity: "error",
        message: i18n.t("network:disconnected"),
      });
      firstDisconnect = false;
    }
    if (!isReconnecting) {
      isReconnecting = true;
      setTimeout(() => {
        Comms.connection?.reconnect();
        isReconnecting = false;
      }, 4000);
    }
    // eslint-disable-next-line
  }, []);

  const connectEvent = useCallback(() => {
    if (!firstDisconnect) {
      toast({
        severity: "success",
        message: i18n.t("network:reconnected"),
      });
      firstDisconnect = true;
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const homeserver = HarmonyStorage.getHomeserver();
    const session = HarmonyStorage.getSession();
    const userid = HarmonyStorage.getUserID();
    if (!homeserver || !session || !userid) {
      history.push("/entry/serverselect");
      return;
    }
    Comms.connection = new HarmonyConnection(
      new HomeServer(homeserver),
      session
    );
    Comms.connection.events.addListener(
      SocketEvent.SOCKET_CLOSE,
      disconnectEvent
    );
    Comms.connection.events.addListener(
      SocketEvent.SOCKET_ERROR,
      disconnectEvent
    );
    Comms.connection.events.addListener(SocketEvent.SOCKET_OPEN, connectEvent);

    (async () => {
      try {
        const data = await Comms.connection?.getUser(userid);
        if (data?.guild_list) {
          try {
            dispatch(setGuildsList(JSON.parse(data.guild_list)));
          } catch {
            dispatch(setGuildsList([]));
          }
        }
      } catch (e) {
        dialog({
          type: "error",
          error: e,
        });
      }
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(setGuildID(guildid));
    // eslint-disable-next-line
  }, [guildid]);

  useEffect(() => {
    dispatch(setChannelID(channelid));
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
