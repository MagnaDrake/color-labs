import { _decorator, Component, Node } from "cc";
import { BottleManager } from "./BottleManager";
import { Bottle, LevelData, LiquidColors } from "../../shader-exp/Bottle";
const { ccclass, property } = _decorator;

@ccclass("LevelGeneratorDisplay")
export class LevelGeneratorDisplay extends Component {
  @property(Node)
  container!: Node;

  @property(BottleManager)
  bottleManager!: BottleManager;

  bottles: Bottle[] = [];

  start() {}

  update(deltaTime: number) {}

  generateLevelDisplay(level: LevelData) {
    console.log("generate level display");
    console.log(level);
    this.bottleManager.resetBottles();
    this.bottles = [];
    level.bottles.forEach((bottleData, index) => {
      const slot = this.bottleManager.getBottleSlot();
      slot?.setParent(this.container);
      const bottleNode = slot?.getChildByName("Bottle");
      const bottleClass = bottleNode?.getComponent(Bottle);
      this.bottles.push(bottleClass!);
      bottleClass?.setColors(bottleData.colors as LiquidColors[]);
    });
  }
}
