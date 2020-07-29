import { Connection } from "@harmony-dev/harmony-web-sdk";

export class Comms {
  static homeserverConn: Connection;
  static foreignConns: {
    [host: string]: Connection;
  };
}
