import {
  _decorator,
  Animation,
  AudioClip,
  CCInteger,
  Color,
  Component,
  Input,
  Material,
  Node,
  Quat,
  randomRangeInt,
  renderer,
  Sprite,
  Tween,
  tween,
  Vec3,
  Vec4,
} from "cc";
import { BottleSlot } from "./BottleSlot";
import { GameManager } from "../script/color-labs/GameManager";
import { moveTo } from "../script/color-labs/position";
const { ccclass, property } = _decorator;

export enum BottleAnimKeys {
  FullToThree = "PourFullToThree",
  FullToTwo = "PourFullToTwo",
  FullToOne = "PourFullToOne",
  FullToZero = "PourFullToZero",
  ThreeToTwo = "PourThreeToTwo",
  ThreeToOne = "PourThreeToOne",
  ThreeToZero = "PourThreeToZero",
  TwoToOne = "PourTwoToOne",
  TwoToZero = "PourTwoToZero",
  OneToZero = "PourOneToZero",
}

const oneKeys = [BottleAnimKeys.OneToZero];
const twoKeys = [BottleAnimKeys.TwoToZero, BottleAnimKeys.TwoToOne];
const threeKeys = [
  BottleAnimKeys.ThreeToZero,
  BottleAnimKeys.ThreeToOne,
  BottleAnimKeys.ThreeToTwo,
];
const fourKeys = [
  BottleAnimKeys.FullToZero,
  BottleAnimKeys.FullToOne,
  BottleAnimKeys.FullToTwo,
  BottleAnimKeys.FullToThree,
];

const allKeys = [oneKeys, twoKeys, threeKeys, fourKeys];

/**
 * TODO make a better mapping than this
 * @param from
 * @param to
 */
export function getPourAnimKey(from: number, to: number) {
  return allKeys[from - 1][to];
}

export enum LiquidColors {
  Red = "#ff4782", //ff4782
  Blue = "#22bcf2", //
  Purple = "#9f6bdb", // 9f6bdb
  Orange = "#ff9147", // ff9147
  Green = "#7fdc04", //7fdc04
  Pink = "#ffaac0", //ffaac0
  Yellow = "#ffef5c", // ffef5c
  DarkGrey = "#8d9489", //8d9489
  LightCyan = "#c2ffed",
  Black = "#000000",
}

export interface BottleData {
  colors?: LiquidColors[] | string[];
}

export interface LevelData {
  bottles: BottleData[];
  devRecord?: number;
  levelIndex?: number;
}

@ccclass("Bottle")
export class Bottle extends Component {
  @property(Node)
  materialNode!: Node;

  @property(Sprite)
  liquidSprite!: Sprite;

  @property(Animation)
  anim!: Animation;

  @property(Material)
  baseMaterial!: Material;

  @property(Node)
  shimmer!: Node;

  @property(CCInteger)
  id = 0;

  gameManager!: GameManager;

  percentageCounter = 0;

  copyMaterial!: Material;

  pass!: renderer.Pass;

  colorHandles: number[] = [];

  percentageHandles: number[] = [];

  liquidList: LiquidColors[] = [];

  slot!: BottleSlot;

  isFlipped = false;

  protected onLoad(): void {
    const mat = new Material();
    mat.copy(this.baseMaterial);

    this.copyMaterial = mat;

    this.liquidSprite.customMaterial = mat;

    this.liquidSprite.setMaterial(mat, 0);
    this.liquidSprite.setMaterialInstance(mat, 0);

    this.pass = this.liquidSprite!.customMaterial!.passes[0!];

    for (let i = 1; i <= 4; i++) {
      //console.log(`color${i}`);
      this.colorHandles.push(this.pass!.getHandle(`color${i}`));
    }

    for (let i = 1; i <= 4; i++) {
      //  console.log(`color${i}Percentage`);
      this.percentageHandles.push(this.pass!.getHandle(`color${i}Percentage`));
      //  console.log(this.percentageHandles[i - 1], i - 1);
    }

    this.setupInputEvents();
  }

  setupInputEvents() {
    this.node.off(Input.EventType.TOUCH_START);
    this.node.on(Input.EventType.TOUCH_START, () => {
      this.gameManager.onClickBottle(this);
    });
  }

  start() {
    // this.c4PercentageHandle = this.pass!.getHandle("color4Percentage");
    // console.log(this.c4PercentageHandle);
    // let stuff = 2;
    // this.c4Percentage = this.pass!.getUniform(this.c4PercentageHandle, 0);
    // console.log(this.c4Percentage);
    // this.c3PercentageHandle = this.pass!.getHandle("color3Percentage");
    // console.log(this.c3PercentageHandle);
    // this.c3Percentage = this.pass!.getUniform(this.c3PercentageHandle, 0);
    // console.log(this.c3Percentage);
    // this.pass.setUniform(this.c4PercentageHandle, newPercentage);
    // console.log(this.node.rotation);
    // console.log("animating pour in 3 secs");
    // console.log(this.materialNode.scale);
    // this.randomizeColors();
  }

  randomizeColors() {
    const colors: LiquidColors[] = [];
    for (let i = 0; i < 4; i++) {
      const randIndex = randomRangeInt(0, 7);
      colors.push(Object.keys(LiquidColors)[randIndex] as LiquidColors);
    }
    this.setColors(colors);
  }

  getTopColor() {
    return this.liquidList[this.liquidList.length - 1];
  }

  getLiquidAmount() {
    return this.liquidList.length;
  }

  popAllTopLiquid() {
    if (this.getTopColor() === undefined) return;
    const res: LiquidColors[] = [];
    this.popLiquid(res);
    //console.log(res);
    return res;
  }

  getAllTopLiquid() {
    if (this.getTopColor() === undefined) return;
    const res: LiquidColors[] = [];
    this.getTopLiquidRecursive(res, this.liquidList.length - 1);

    return res;
  }

  getTopLiquidRecursive(res: LiquidColors[], tail: number) {
    const top = this.liquidList[tail];

    if (res.length <= 0 || top === res[0]) {
      res.push(top as LiquidColors);
      this.getTopLiquidRecursive(res, tail - 1);
    } else {
      return res;
    }
  }

  popLiquid(res: LiquidColors[]) {
    const top = this.getTopColor();
    if (res.length <= 0 || top === res[0]) {
      res.push(this.liquidList.pop() as LiquidColors);
      this.popLiquid(res);
    } else {
      return res;
    }
  }

  setColors(colors: LiquidColors[] | undefined) {
    if (colors === undefined) {
      for (let i = 0; i < 4; i++) {
        this.pass.setUniform(this.percentageHandles[i], 0);
        this.pass.setUniform(this.colorHandles[i], new Quat(0, 0, 0, 255));
      }
    } else {
      for (let i = 0; i < 4; i++) {
        let color;
        if (i >= colors.length) {
          color = LiquidColors.Black;
          this.pass.setUniform(this.percentageHandles[i], 0);
        } else {
          color = colors[i];
          this.liquidList.push(color);
          this.pass.setUniform(this.percentageHandles[i], 0.22);
        }
        let rgbaOut = new Color(color);
        this.pass.setUniform(this.colorHandles[i], rgbaOut);
      }
    }
  }

  setColorByIndex(color: LiquidColors, index: number) {
    let rgbaOut = new Color(color);
    this.pass.setUniform(this.colorHandles[index], rgbaOut);
  }

  animPour(from: number, to: number) {
    // todo check current level
    const key = getPourAnimKey(from, to);
    // console.log(key);
    this.anim.play(key);
  }

  fillLiquid(amount: LiquidColors[]) {
    //console.log("fill", amount, amount.length);
    amount.forEach((liquid, index) => {
      this.liquidList.push(liquid);
      this.setColorByIndex(liquid, this.liquidList.length - 1);
      const targetIndex = this.liquidList.length - 1;
      this.scheduleOnce(() => {
        this.tweenLiquid(targetIndex, 0.5 / amount.length, true);
      }, 0.5 + (index * 0.5) / amount.length);
    });
  }

  tweenLiquid(liquidIndex: number, duration: number, fill: boolean) {
    // console.log("tween liquid");
    const percentageHanlde = this.percentageHandles[liquidIndex];
    // console.log(percentageHanlde, liquidIndex, duration);
    const liquidTween = tween(this.node)
      .to(
        duration,
        {},
        {
          onUpdate(target, ratio) {
            let value = 0;
            if (fill) {
              value = 0.22 * ratio!;
            } else {
              value = 0.22 - 0.22 * ratio!;
            }

            (target as Node)
              .getComponent(Bottle)!
              .pass.setUniform(percentageHanlde, value);
          },
        }
      )
      .start();
  }

  resetBottle() {
    const worldPos = this.node.worldPosition;
    this.slot.node.setScale(1, 1, 1);
    this.node.setWorldPosition(worldPos);
    if (this.isFlipped) {
      this.shimmer.setPosition(
        new Vec3(
          this.shimmer.position.x * -1,
          this.shimmer.position.y,
          this.shimmer.position.y
        )
      );
      this.isFlipped = false;
    }

    moveTo(this.node, this.slot.defaultSlot.worldPosition, 0.35, () => {
      this.gameManager.clearBottleState();
    });
  }

  resetSlotPosition() {
    this.node.setWorldPosition(this.slot.defaultSlot.worldPosition);
  }

  isFinished() {
    if (this.liquidList.length <= 0) return true;
    if (this.liquidList.length < 4 && this.liquidList.length >= 1) return false;
    let color = this.liquidList[0];
    for (let i = 1; i < 4; i++) {
      const nextColor = this.liquidList[i];
      if (nextColor !== color) {
        return false;
      }
      color = nextColor;
    }
    return true;
  }

  flip() {
    this.isFlipped = true;
    this.slot.node.setScale(-1, 1, 1);
    this.shimmer.setPosition(
      new Vec3(
        this.shimmer.position.x * -1,
        this.shimmer.position.y,
        this.shimmer.position.y
      )
    );
  }

  isFull() {
    return this.liquidList.length >= 4;
  }

  resetLiquid() {
    this.liquidList = [];
    this.setColors(undefined);
  }
  update(deltaTime: number) {}
}
