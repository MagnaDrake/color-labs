import { _decorator, Component, Input, Node } from "cc";
import { UserSaveData } from "./LevelSelector";
import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("AwardManager")
export class AwardManager extends Component {
  @property(Node)
  trophy!: Node;

  @property(Node)
  image!: Node;

  protected onLoad(): void {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const saveData = JSON.parse(userData) as UserSaveData;

      localStorage.setItem("userData", JSON.stringify(saveData));

      if (saveData.perfectLevels.length >= 50) {
        this.trophy.active = true;

        this.trophy.on(Input.EventType.TOUCH_START, () => {
          AudioManager.Instance.playOneShot(
            getAudioKeyString(AudioKeys.SFXUIClick)
          );
          this.image.active = true;
        });

        this.image.on(Input.EventType.TOUCH_START, () => {
          AudioManager.Instance.playOneShot(
            getAudioKeyString(AudioKeys.SFXUIClick)
          );
          this.image.active = false;
        });
      }
    }
  }
}
