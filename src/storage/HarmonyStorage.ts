export class HarmonyStorage {
  static getHomeserver() {
    return localStorage.getItem("homeserver");
  }

  static getSession() {
    return localStorage.getItem("session");
  }

  static getUserID() {
    return localStorage.getItem("userid");
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

  static executeMessageCode() {
    const flag = localStorage.getItem("executeMessageCode");
    return flag === "true";
  }
}
