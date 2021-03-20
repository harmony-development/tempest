import { Connection } from "@harmony-dev/harmony-web-sdk";
import { host } from "./app";
import { closeStreamHandler, eventStreamHandler } from "./eventStreamHandler";
import { ChatStream } from "~/types";

const connections: {
  [host: string]: Connection;
} = {};
const chatStreams: {
  [host: string]: ChatStream;
} = {};
const pendingFederations: {
  [host: string]: Promise<Connection>;
} = {};

export const getOrFederate = (targetHost: string) => {
  if (connections[targetHost]) return connections[targetHost];
  if (pendingFederations[targetHost]) return pendingFederations[targetHost];
  if (targetHost === host.value) {
    const conn = new Connection(targetHost);
    connections[targetHost] = conn;
    return conn;
  }
  pendingFederations[targetHost] = (async () => {
    const federateResp = await connections[host.value].auth.federate({
      target: targetHost,
    });
    const conn = new Connection(targetHost);
    const loginResp = await conn.auth.loginFederated({
      authToken: federateResp.response.token,
      domain: host.value.replace("https://", ""),
    });
    conn.setSession(loginResp.response.sessionToken);
    connections[targetHost] = conn;
    delete pendingFederations[targetHost];
    return conn;
  })();
  return pendingFederations[targetHost];
};

export const getStream = async (host: string, session?: string) => {
  if (chatStreams[host]) return chatStreams[host];
  const conn = await getOrFederate(host);
  if (session) {
    conn.setSession(session);
  }
  const stream = conn.chat.streamEvents();
  chatStreams[host] = stream;
  stream.response.onMessage(eventStreamHandler(host, stream));
  stream.response.onComplete(closeStreamHandler(stream));
  return stream;
};

export const homeserverConn = () => {
  return getOrFederate(host.value);
};
