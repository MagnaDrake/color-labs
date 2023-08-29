import { _decorator, Component, Node, tween, UIOpacity } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BlackScreen")
export class BlackScreen extends Component {
  @property(UIOpacity)
  opacity!: UIOpacity;

  toggleVisibility(value: boolean) {
    const target = value ? 255 : 0;
    tween(this.opacity).to(0.25, { opacity: target }).start();
  }
}
