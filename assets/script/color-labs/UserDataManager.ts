import { _decorator, Component, Node } from "cc";
import { UserSaveData } from "./LevelSelector";
const { ccclass, property } = _decorator;

@ccclass("UserDataManager")
export class UserDataManager {
  userData: UserSaveData;
  private static _inst: UserDataManager;
  public static get Instance(): UserDataManager {
    if (this._inst == null) {
      this._inst = new UserDataManager();
    }
    return this._inst;
  }

  constructor() {
    let data;
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      data = JSON.parse(storedUserData) as UserSaveData;
    } else {
      data = { completedLevels: [], perfectLevels: [] };
    }
    this.userData = data;
  }

  saveUserData(data: UserSaveData) {
    localStorage.setItem("userData", JSON.stringify(data));
    this.userData = data;
  }

  getUserData() {
    const data = localStorage.getItem("userData");
    if (data !== undefined) {
      return JSON.parse(data as string) as UserSaveData;
    } else {
      return this.userData;
    }
  }
}
