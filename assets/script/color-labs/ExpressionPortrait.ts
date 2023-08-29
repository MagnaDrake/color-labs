import { _decorator, Animation, Component, Input, Node, Sprite } from "cc";
import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
const { ccclass, property } = _decorator;

export enum PortraitAnimKey {
  IDLE = "idle",
  POUR = "pour",
  INTERACT = "interact",
  LOSE = "lose",
  WIN = "win",
  COMPLETE = "complete",
  PICK = "pick",
}

@ccclass("ExpressionPortrait")
export class ExpressionPortrait extends Component {
  @property(Animation)
  anim!: Animation;

  expression: PortraitAnimKey = PortraitAnimKey.IDLE;

  start() {
    this.node.off(Input.EventType.TOUCH_START);
    this.node.on(Input.EventType.TOUCH_START, () => {
      if (this.expression === PortraitAnimKey.IDLE) {
        this.playAnim(PortraitAnimKey.INTERACT);
        AudioManager.Instance.playOneShot(
          getAudioKeyString(AudioKeys.awawawawa)
        );
        this.scheduleOnce(() => {
          if (this.expression === PortraitAnimKey.INTERACT) {
            this.playAnim(PortraitAnimKey.IDLE);
          }
        }, 2);
      }
    });
  }

  update(deltaTime: number) {}

  playAnim(key: PortraitAnimKey) {
    this.expression = key;
    this.anim.play(key);
  }
}
