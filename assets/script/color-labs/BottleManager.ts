import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { BottleSlot } from "../../shader-exp/BottleSlot";
import { Bottle } from "../../shader-exp/Bottle";
const { ccclass, property } = _decorator;

@ccclass("BottleManager")
export class BottleManager extends Component {
  @property(Prefab)
  bottleSlotPrefab!: Prefab;

  @property(Node)
  container!: Node;

  bottleSlotPools: Node[] = [];

  idCounter = 0;

  protected onLoad(): void {
    this.container.children.forEach((node) => {
      this.bottleSlotPools.push(node);
      node.setParent(this.node);
    });
  }

  resetBottles() {
    //console.log("reset length", this.container.children);
    this.container.children.forEach((child, index) => {
      child.active = false;
      this.bottleSlotPools.push(child);

      //console.log("pool length", this.bottleSlotPools);
      const bottle = child.getChildByName("Bottle")?.getComponent(Bottle);
      bottle?.resetLiquid();
      //console.log("reset liquid", index);
    });

    this.bottleSlotPools.forEach((slot) => {
      slot.setParent(this.node);
    });
  }

  getBottleSlot() {
    //console.log("get bottle slot");
    if (this.bottleSlotPools.length <= 0) {
      //console.log("instantiate new bottle");
      const slot = instantiate(this.bottleSlotPrefab);
      slot.getChildByName("Bottle")!.getComponent(Bottle)!.id = this.idCounter;
      slot.getChildByName("Bottle")!.getComponent(Bottle)!.setupInputEvents();
      this.idCounter += 1;
      return slot;
    } else {
      // console.log("pop from array");
      const slot = this.bottleSlotPools.pop();
      slot!.getChildByName("Bottle")!.getComponent(Bottle)!.setupInputEvents();
      slot!.active = true;
      return slot;
    }
  }
}
