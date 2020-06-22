export class HarmonyStorage {
  static getHomeserver() {
    return localStorage.getItem("homeserver");
  }

  static getSession() {
    return localStorage.getItem("session");
  }
}
