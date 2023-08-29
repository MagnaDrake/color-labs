import { _decorator, Component, Input, Node } from "cc";
import { UserSaveData } from "./LevelSelector";
import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
import { TitleScreenUIManager } from "./TitleScreenUIManager";
import { UserDataManager } from "./UserDataManager";
const { ccclass, property } = _decorator;

@ccclass("AwardManager")
export class AwardManager extends Component {
  @property(Node)
  trophy!: Node;

  @property(Node)
  image!: Node;

  @property(TitleScreenUIManager)
  uiManager!: TitleScreenUIManager;

  protected onLoad(): void {
    const userData = UserDataManager.Instance.getUserData();
    if (userData) {
      if (userData.perfectLevels.length >= 50) {
        this.trophy.active = true;

        this.trophy.on(Input.EventType.TOUCH_START, () => {
          AudioManager.Instance.playOneShot(
            getAudioKeyString(AudioKeys.SFXUIClick)
          );
          this.image.active = true;
          this.uiManager.hideJellyMenu();
        });

        this.image.on(Input.EventType.TOUCH_START, () => {
          AudioManager.Instance.playOneShot(
            getAudioKeyString(AudioKeys.SFXUIClick)
          );
          this.image.active = false;
          this.uiManager.showJellyMenu();
        });
      }
    }
  }
}
