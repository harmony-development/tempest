import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import {
  HarmonyConnection,
  HomeServer,
  SocketEvent,
} from "@harmony-dev/harmony-node-sdk";
import { makeStyles, Theme } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import { Comms } from "../../comms/Comms";
import { HarmonyStorage } from "../../storage/HarmonyStorage";
import { useToast } from "../../components/toast/SnackbarContext";

const appStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
  },
  navSpacer: {
    ...theme.mixins.toolbar,
  },
}));

let firstDisconnect = true;

const _App = () => {
  const { guildid, channelid } = useParams<{
    guildid?: string;
    channelid?: string;
  }>();
  const i18n = useTranslation(["network"]);
  const toast = useToast();
  const history = useHistory();
  const classes = appStyles();

  useEffect(() => {
    const homeserver = HarmonyStorage.getHomeserver();
    const session = HarmonyStorage.getSession();
    if (!homeserver || !session) {
      history.push("/entry/serverselect");
      return;
    }
    Comms.connection = new HarmonyConnection(
      new HomeServer(homeserver),
      session
    );
    Comms.connection.events.on(SocketEvent.SOCKET_CLOSE, (_) => {
      if (firstDisconnect) {
        toast({
          severity: "error",
          message: i18n.t("network:disconnected"),
        });
        firstDisconnect = false;
      }
      setTimeout(() => {
        Comms.connection?.reconnect();
      }, 5000);
    });
    Comms.connection.events.on(SocketEvent.SOCKET_ERROR, (err) => {
      if (firstDisconnect) {
        toast({
          severity: "error",
          message: err.message,
        });
        firstDisconnect = false;
      }
      setTimeout(() => {
        Comms.connection?.reconnect();
      });
    });
    Comms.connection.events.on(SocketEvent.SOCKET_OPEN, (_) => {
      if (!firstDisconnect) {
        toast({
          severity: "success",
          message: i18n.t("network:reconnected"),
        });
      }
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      {/* this fills in the space where the navbar is to prevent dumbness™ */}
      <div className={classes.navSpacer}></div>
    </div>
  );
};

export const App = React.memo(_App);
