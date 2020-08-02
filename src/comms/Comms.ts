import { Connection } from "@harmony-dev/harmony-web-sdk";

export class Comms {
  static homeserver: string;
  static connections: {
    [host: string]: Connection;
  } = {};

  static getHomeserverConn() {
    return this.connections[this.homeserver];
  }

  static async getOrFederate(host: string) {
    if (!this.connections[host]) {
      const resp = await this.getHomeserverConn().federate(host);
      const newConn = new Connection(host);
      newConn.loginFederated(resp.message?.getToken() || "", host);
    }
    return this.connections[host];
  }
}
