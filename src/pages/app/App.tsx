import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { HarmonyConnection, HomeServer } from "@harmony-dev/harmony-node-sdk";

import { Comms } from "../../comms/Comms";
import { HarmonyStorage } from "../../storage/HarmonyStorage";

const _App = () => {
  const history = useHistory();

  useEffect(() => {
    const homeserver = HarmonyStorage.getHomeserver();
    const session = HarmonyStorage.getSession();
    if (!homeserver || !session) {
      history.push("/entry/serverselect");
      return;
    }
    const server = new HomeServer(homeserver);
    Comms.connection = new HarmonyConnection(server, session);
    // eslint-disable-next-line
  }, []);

  return <div></div>;
};

export const App = React.memo(_App);
