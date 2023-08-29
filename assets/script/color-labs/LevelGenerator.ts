import {
  _decorator,
  CCInteger,
  Component,
  EditBox,
  Node,
  randomRangeInt,
} from "cc";
import {
  Bottle,
  BottleData,
  LevelData,
  LiquidColors,
} from "../../shader-exp/Bottle";
import { LevelGeneratorDisplay } from "./LevelGeneratorDisplay";
import { levelData2 } from "./levelData";
const { ccclass, property } = _decorator;

@ccclass("LevelGenerator")
export class LevelGenerator extends Component {
  levelData: LevelData[] = [];

  currentLevelData!: LevelData;

  savedLevelData: LevelData[] = [];

  @property(EditBox)
  totalVials!: EditBox;

  @property(EditBox)
  emptyVials!: EditBox;

  @property(EditBox)
  iteration!: EditBox;

  @property(LevelGeneratorDisplay)
  display!: LevelGeneratorDisplay;

  onClickGenerateLevel() {
    this.generateLevel(
      parseInt(this.totalVials.string),
      parseInt(this.emptyVials.string),
      parseInt(this.iteration.string)
    );
  }

  onClickSaveLevel() {
    if (!this.savedLevelData.includes(this.currentLevelData)) {
      this.savedLevelData.push(this.currentLevelData);
    }
    console.log("Level Saved!");
    console.log(`current saved levels amount: ${this.savedLevelData.length}`);
  }

  printLevels() {
    console.log(this.savedLevelData);
  }

  protected start(): void {
    levelData2.forEach((level, index) => {
      level.levelIndex = index + 1;
      level.devRecord = devRecords[index];
    });

    console.log(levelData2);
  }

  generateLevel(totalVials: number, emptyVials: number, iteration: number) {
    console.log("generating level", this.savedLevelData.length + 1);
    const bottles = [];
    const usedColors: LiquidColors[] = [LiquidColors.Black];
    let color = LiquidColors.Black;
    for (let i = 0; i < totalVials - emptyVials; i++) {
      do {
        color = this.getRandomColor();
      } while (this.checkIfExists(usedColors, color));
      usedColors.push(color);

      const colorList = [];
      for (let j = 0; j < 4; j++) {
        colorList.push(color);
      }
      bottles.push({ colors: colorList } as BottleData);
    }

    for (let i = 0; i < emptyVials; i++) {
      bottles.push({ colors: [] });
    }

    this.scramble(bottles, iteration);
    this.currentLevelData = { bottles: bottles };
    this.levelData.push({ bottles: bottles });
    this.display.generateLevelDisplay(this.currentLevelData);
  }

  checkIfExists(array: Array<LiquidColors>, color: LiquidColors) {
    // let exists = false;
    // array.forEach((element) => {
    //   if (color == element) {
    //     exists = true;
    //   }
    // });
    return array.includes(color);
    //return exists;
  }

  scramble(bottles: BottleData[], iteration: number) {
    for (let i = 0; i < iteration; i++) {
      const originRandIndex = randomRangeInt(0, bottles.length);
      let targetRandIndex;
      const originColors = bottles[originRandIndex].colors;

      if (
        originColors !== undefined &&
        originColors[originColors.length - 1] !== undefined
      ) {
        const originTopColor = this.getTopBottleColor(
          originColors as LiquidColors[]
        );

        do {
          targetRandIndex = randomRangeInt(0, bottles.length);
        } while (targetRandIndex === originRandIndex);

        const targetColors = bottles[targetRandIndex].colors;
        if (targetColors !== undefined && targetColors?.length < 4) {
          const targetTopColor = this.getTopBottleColor(
            targetColors as LiquidColors[]
          );
          if (targetTopColor !== originTopColor) {
            const movingColor = originColors.pop();
            targetColors.push(movingColor! as LiquidColors);
          }
        }
      }
    }
  }

  getTopBottleColor(list: LiquidColors[] | undefined) {
    if (list == undefined || list.length < 0) return undefined;
    return list[list.length - 1];
  }

  getTopBottleColorRecursive(
    res: LiquidColors[],
    list: LiquidColors[],
    tail: number
  ) {
    const top = list[tail];

    if (res.length <= 0 || top === res[0]) {
      res.push(top as LiquidColors);
      this.getTopBottleColorRecursive(res, list, tail - 1);
    } else {
      return res;
    }
  }

  isAllColorSame(list: LiquidColors[]) {
    if (list.length < 4 && list.length >= 1) return false;
    let color = list[0];
    for (let i = 1; i < 4; i++) {
      const nextColor = list[i];
      if (nextColor !== color) {
        return false;
      }
      color = nextColor;
    }
    return true;
  }

  getRandomColor() {
    const values = Object.keys(LiquidColors);

    const enumKey = values[Math.floor(Math.random() * values.length)];
    //@ts-ignore
    return LiquidColors[enumKey];
  }
}

export type Enum<E> = Record<keyof E, number | string> & {
  [k: number]: string;
};

export function getEnumKeyByEnumValue<
  E extends Enum<E>,
  K extends string | number
>(enumType: E, enumValue: K) {
  //@ts-ignore
  let keys = Object.keys(enumType).filter((x) => enumType[x] === enumValue);
  return keys.length > 0 ? keys[0] : null;
}

export const devRecords = [
  4, 8, 6, 8, 9, 9, 9, 9, 9, 8, 12, 12, 9, 10, 10, 13, 12, 11, 11, 12, 15, 16,
  12, 15, 14, 13, 13, 11, 15, 16, 18, 15, 13, 15, 12, 16, 14, 16, 15, 15, 16,
  19, 18, 19, 17, 20, 19, 23, 18, 23,
];
