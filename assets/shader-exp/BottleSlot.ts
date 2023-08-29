import { _decorator, Component, Node } from "cc";
import { Bottle } from "./Bottle";
const { ccclass, property } = _decorator;

@ccclass("BottleSlot")
export class BottleSlot extends Component {
  @property(Node)
  upSlot!: Node;

  @property(Node)
  leftSlot!: Node;

  @property(Node)
  rightSlot!: Node;

  @property(Node)
  defaultSlot!: Node;

  @property(Node)
  bottle!: Node;

  protected onLoad(): void {
    this.bottle.getComponent(Bottle)!.slot = this;
  }

  start() {}

  update(deltaTime: number) {}
}
