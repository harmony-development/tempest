import { Connection } from "@harmony-dev/harmony-web-sdk";
import { host } from "./app";
import {
  closeStreamHandler,
  eventStreamHandler,
  openStreamhandler,
} from "./eventStreamHandler";
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

export const newConnection = (host: string) => {
  return connections[host] || (connections[host] = new Connection(host));
};

export const getOrFederate = (targetHost: string) => {
  if (connections[targetHost]) return connections[targetHost];
  if (pendingFederations[targetHost]) return pendingFederations[targetHost];
  if (targetHost === host.value) {
    const conn = new Connection(targetHost);
    connections[targetHost] = conn;
    return conn;
  }
  pendingFederations[targetHost] = (async () => {
    const federateResp = await connections[host.value].auth.Federate({
      target: targetHost,
    });
    const conn = new Connection(targetHost);
    const loginResp = await conn.auth.LoginFederated({
      authToken: federateResp.token!,
      domain: host.value.replace("https://", ""),
    });
    conn.setSession(loginResp.sessionToken);
    connections[targetHost] = conn;
    delete pendingFederations[targetHost];
    return conn;
  })();
  return pendingFederations[targetHost];
};

export const getChatStream = async (host: string, session?: string) => {
  if (chatStreams[host]) return chatStreams[host];
  const conn = await getOrFederate(host);
  if (session) {
    conn.setSession(session);
    conn.chat.session = session;
  }
  const stream = conn.chat.StreamEvents();
  chatStreams[host] = stream;
  stream.eventEmitter.on("data", eventStreamHandler(stream));
  stream.eventEmitter.on("close", closeStreamHandler(stream));
  stream.eventEmitter.on("open", openStreamhandler(stream));
  return stream;
};
