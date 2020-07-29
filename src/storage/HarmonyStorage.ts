const HOMESERVER_KEY = "homeserver";
const SESSION_KEY = "session";
const USER_ID_KEY = "userid";

export class HarmonyStorage {
  static getHomeserver() {
    return localStorage.getItem(HOMESERVER_KEY);
  }

  static setHomeserver(value: string) {
    return localStorage.setItem(HOMESERVER_KEY, value);
  }

  static getSession() {
    return localStorage.getItem(SESSION_KEY);
  }

  static setSession(value: string) {
    return localStorage.setItem(SESSION_KEY, value);
  }

  static getUserID() {
    return localStorage.getItem(USER_ID_KEY);
  }

  static setUserID(value: string) {
    return localStorage.setItem(USER_ID_KEY, value);
  }

  /**
   * Sets the executeMessageCode flag to the default if it's not set
   */
  static checkExecuteMessageCode() {
    if (localStorage.getItem("executeMessageCode") === null) {
      localStorage.setItem(
        "executeMessageCode",
        "DANGEROUS! USE AT YOUR OWN RISK!"
      );
    }
  }

  static canExecuteMessageCode() {
    const flag = localStorage.getItem("executeMessageCode");
    return flag === "true";
  }
}
