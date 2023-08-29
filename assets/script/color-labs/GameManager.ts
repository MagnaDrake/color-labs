import {
  _decorator,
  CCInteger,
  Component,
  director,
  Input,
  Label,
  Node,
  Quat,
  randomRangeInt,
  Vec3,
} from "cc";
import { Bottle, LiquidColors } from "../../shader-exp/Bottle";
import { moveTo, isTargetOnTheRight } from "./position";
import { BottleManager } from "./BottleManager";
import { levelData2 } from "./levelData";
import { ExpressionPortrait, PortraitAnimKey } from "./ExpressionPortrait";
import { GameplayUIManager } from "./GameplayUIManager";
import { TitleScreenUIManager } from "./TitleScreenUIManager";
import { UserSaveData } from "./LevelSelector";
import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
import { UserDataManager } from "./UserDataManager";
const { ccclass, property } = _decorator;

export enum GameStates {
  NONE,
  IDLE,
  HOLDING_VIAL,
  POURING,
  LOSE,
  WIN,
}

@ccclass("GameManager")
export class GameManager extends Component {
  @property(Node)
  gameContainer!: Node;

  @property(CCInteger)
  maxSlots = 16;

  @property(BottleManager)
  bottleManager!: BottleManager;

  @property(ExpressionPortrait)
  portrait!: ExpressionPortrait;

  @property(Node)
  containerAnchor!: Node;

  @property(GameplayUIManager)
  gameplayUIManager!: GameplayUIManager;

  @property(Label)
  levelIndicator!: Label;

  containerOgWorldPosition!: Vec3;

  bottles: Bottle[] = [];

  currentSelectedBottle: Bottle | null = null;

  targetBottle: Bottle | null = null;

  _currentGameState = GameStates.NONE;

  prevState = GameStates.NONE;

  levelIndex = -1;

  moves = 0;

  devRecord = 0;

  static Instance: GameManager;

  set currentGameState(state: GameStates) {
    this.prevState = this._currentGameState;
    this._currentGameState = state;
    this.onChangeGameState();
  }

  get currentGameState() {
    return this._currentGameState;
  }

  protected onLoad(): void {
    const instance = GameManager.Instance;

    if (instance?.isValid && instance !== this) {
      this.destroy();
      return;
    }

    if (!instance || !instance.isValid) {
      GameManager.Instance = this;
    }

    const anchorWp = this.gameContainer.worldPosition;
    this.containerOgWorldPosition = new Vec3(
      anchorWp.x,
      anchorWp.y,
      anchorWp.z
    );
  }

  start() {
    AudioManager.Instance.play(
      `${getAudioKeyString(AudioKeys.BGMMain)}`,
      0.6,
      true
    );

    // const firstBottle: BottleData = {
    //   colors: [LiquidColors.Blue, LiquidColors.Red, LiquidColors.Blue],
    // };
    // const secondBottle: BottleData = {
    //   colors: [
    //     LiquidColors.Red,
    //     LiquidColors.Blue,
    //     LiquidColors.Black,
    //     LiquidColors.Black,
    //   ],
    // };
    // const thirdBottle: BottleData = {
    //   colors: [LiquidColors.Blue, LiquidColors.Red, LiquidColors.Red],
    // };
    // //const fourthBottle: BottleData = {};
    // const level: LevelData = {
    //   bottles: [firstBottle, secondBottle, thirdBottle],
    // };
    // let i = 0;
    //this.generateLevel(0);
  }

  onClickBottle(bottle: Bottle) {
    if (this.currentGameState === GameStates.POURING) return;

    if (
      this.currentSelectedBottle === undefined ||
      this.currentSelectedBottle === null
    ) {
      this.currentSelectedBottle = bottle;
      moveTo(bottle.node, bottle.slot.upSlot.worldPosition, 0.5);
      this.currentGameState = GameStates.HOLDING_VIAL;
    } else if (this.currentSelectedBottle.id === bottle.id) {
      moveTo(
        this.currentSelectedBottle.node,
        this.currentSelectedBottle.slot.defaultSlot.worldPosition,
        0.5
      );
      this.currentSelectedBottle = null;
      this.currentGameState = GameStates.IDLE;
    } else if (bottle.id !== this.currentSelectedBottle.id) {
      if (
        this.currentSelectedBottle.getTopColor() !== undefined &&
        (bottle.getTopColor() === this.currentSelectedBottle.getTopColor() ||
          bottle.getTopColor() === undefined)
      ) {
        const initialAmount = this.currentSelectedBottle.getLiquidAmount();
        const totalPour = this.currentSelectedBottle.popAllTopLiquid();

        if (totalPour!.length + bottle.liquidList.length > 4) {
          this.currentSelectedBottle.liquidList = [
            ...this.currentSelectedBottle.liquidList,
            ...totalPour!,
          ];

          moveTo(
            this.currentSelectedBottle.node,
            this.currentSelectedBottle.slot.defaultSlot.worldPosition,
            0.5
          );
          this.currentSelectedBottle = null;
          this.currentGameState = GameStates.IDLE;

          return;
        }

        const goingRight = isTargetOnTheRight(
          this.currentSelectedBottle.node.worldPosition.x,
          bottle.node.worldPosition.x
        );

        let slot;
        if (goingRight) {
          slot = bottle.slot.leftSlot;
          this.currentSelectedBottle.flip();
        } else {
          slot = bottle.slot.rightSlot;
        }

        moveTo(this.currentSelectedBottle.node, slot.worldPosition, 0.5);
        this.currentSelectedBottle.animPour(
          initialAmount,
          initialAmount - totalPour!.length
        );
        bottle.fillLiquid(totalPour!);
        this.targetBottle = bottle;
        this.currentGameState = GameStates.POURING;
      } else {
        moveTo(
          this.currentSelectedBottle.node,
          this.currentSelectedBottle.slot.defaultSlot.worldPosition,
          0.5
        );
        this.currentSelectedBottle = null;
        this.currentGameState = GameStates.IDLE;
      }
    }
  }

  hasWin() {
    let finishedVials = 0;
    this.bottles.forEach((bottle) => {
      if (bottle.isFinished()) {
        finishedVials += 1;
      }
    });

    if (finishedVials === this.bottles.length) {
      return true;
    } else {
      return false;
    }
  }

  clearBottleState() {
    this.currentSelectedBottle = null;
    this.targetBottle = null;
    this.currentGameState = GameStates.IDLE;
  }

  hasMovesLeft() {
    for (let i = 0; i < this.bottles.length; i++) {
      const originBottle = this.bottles[i];
      for (let j = 0; j < this.bottles.length; j++) {
        if (i === j) {
          continue;
        }
        const targetBottle = this.bottles[j];
        if (this.isBottleValidMove(originBottle, targetBottle)) {
          return true;
        }
      }
    }
    return false;
  }

  isBottleValidMove(origin: Bottle, target: Bottle) {
    if (origin.getTopColor() === undefined) return true;

    const overflow =
      target.liquidList.length + origin.getAllTopLiquid()!.length > 4;
    return (
      !target.isFull() &&
      (target.getTopColor() === undefined ||
        origin.getTopColor() === target.getTopColor()) &&
      !overflow
    );
  }

  onChangeGameState() {
    switch (this.currentGameState) {
      case GameStates.NONE:
      case GameStates.IDLE:
        this.targetBottle = null;
        this.portrait.playAnim(PortraitAnimKey.IDLE);
        const win = this.hasWin();
        if (!win) {
          const hasMove = this.hasMovesLeft();
          if (!hasMove) {
            this.currentGameState = GameStates.LOSE;
          }
        } else {
          this.currentGameState = GameStates.WIN;
        }
        break;
      case GameStates.HOLDING_VIAL:
        AudioManager.Instance.playOneShot(
          `${getAudioKeyString(AudioKeys.SFXVialClink)}-${randomRangeInt(0, 8)}`
        );

        this.portrait.playAnim(PortraitAnimKey.PICK);
        break;
      case GameStates.POURING:
        AudioManager.Instance.playOneShot(
          `${getAudioKeyString(AudioKeys.SFXPour)}-${randomRangeInt(0, 5)}`,
          0.45
        );
        if (this.targetBottle?.isFinished()) {
          AudioManager.Instance.playOneShot(
            `${getAudioKeyString(AudioKeys.SFXVialComplete)}`,
            0.6
          );
          this.portrait.playAnim(PortraitAnimKey.COMPLETE);
        } else {
          this.portrait.playAnim(PortraitAnimKey.POUR);
        }
        this.moves += 1;
        break;
      case GameStates.LOSE:
        this.scheduleOnce(() => {
          this.portrait.playAnim(PortraitAnimKey.LOSE);
          AudioManager.Instance.playOneShot(
            getAudioKeyString(AudioKeys.SFXLevelFail)
          );

          this.bottles.forEach((bottle) => {
            bottle.node.off(Input.EventType.TOUCH_START);
          });
          // todo trigger win window
          this.gameplayUIManager.toggleLevelClear(false);
          this.levelIndicator.node.active = false;
          moveTo(this.gameContainer, this.containerAnchor.worldPosition, 0.25);
        }, 0.1);

        // todo trigger lose window
        break;
      case GameStates.WIN:
        this.saveWin();
        this.scheduleOnce(() => {
          AudioManager.Instance.playOneShot(
            getAudioKeyString(AudioKeys.SFXLevelClear)
          );
          this.portrait.playAnim(PortraitAnimKey.WIN);

          this.bottles.forEach((bottle) => {
            bottle.node.off(Input.EventType.TOUCH_START);
          });
          // todo trigger win window
          this.levelIndicator.node.active = false;

          this.gameplayUIManager.toggleLevelClear(
            true,
            this.moves,
            this.devRecord
          );
          moveTo(this.gameContainer, this.containerAnchor.worldPosition, 0.25);
        }, 0.1);

        break;
    }
  }

  saveWin() {
    const saveData = UserDataManager.Instance.getUserData();
    if (!saveData.completedLevels.includes(this.levelIndex)) {
      saveData.completedLevels.push(this.levelIndex);
    }
    //todo track perfect levels
    if (this.moves <= this.devRecord) {
      if (!saveData.perfectLevels.includes(this.levelIndex)) {
        saveData.perfectLevels.push(this.levelIndex);
      }
    }

    UserDataManager.Instance.saveUserData(saveData);
  }

  debugVialEndGame() {
    moveTo(this.gameContainer, this.containerAnchor.worldPosition, 0.25);
  }

  generateLevel(levelIndex: number) {
    this.currentSelectedBottle = null;
    this.targetBottle = null;
    this.moves = 0;
    this.devRecord = 0;
    this.levelIndicator.string = `Level ${levelIndex + 1}`;
    this.levelIndicator.node.active = true;
    this.gameplayUIManager.toggleLoadingScreen(false);
    this.levelIndex = levelIndex;
    this.bottleManager.resetBottles();
    this.bottles = [];
    const level = levelData2[levelIndex];
    this.devRecord = level.devRecord || 5;
    level.bottles.forEach((bottleData, index) => {
      const slot = this.bottleManager.getBottleSlot();
      slot?.setParent(this.gameContainer);
      const bottleNode = slot?.getChildByName("Bottle");
      const bottleClass = bottleNode?.getComponent(Bottle);
      if (bottleClass?.gameManager === undefined) {
        bottleClass!.gameManager = this;
      }
      this.bottles.push(bottleClass!);
      bottleClass?.setColors(bottleData.colors as LiquidColors[]);
      bottleClass?.resetSlotPosition();
    });
    this.currentGameState = GameStates.IDLE;
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
    );
  }

  setupNextLevel() {
    AudioManager.Instance.playOneShot(getAudioKeyString(AudioKeys.SFXUIClick));
    this.gameplayUIManager.resetUI();
    this.scheduleOnce(() => {
      this.gameContainer.worldPosition = this.containerOgWorldPosition;
      this.generateNextLevel();
    }, 0.25);
  }

  retryLevel() {
    if (this.currentGameState === GameStates.POURING) return;

    AudioManager.Instance.playOneShot(getAudioKeyString(AudioKeys.SFXUIClick));
    this.gameplayUIManager.resetUI();
    this.scheduleOnce(() => {
      this.gameContainer.worldPosition = this.containerOgWorldPosition;
      this.generateLevel(this.levelIndex);
    }, 0.25);
  }

  generateNextLevel() {
    this.levelIndex += 1;
    this.generateLevel(this.levelIndex);
  }

  backToLevelSelect() {
    AudioManager.Instance.playOneShot(getAudioKeyString(AudioKeys.SFXUIClick));
    this.gameplayUIManager.resetUI();
    AudioManager.Instance.stop();
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    );
    this.scheduleOnce(() => {
      director.loadScene("title", (e, scene) => {
        const uiManager = scene?.getComponentInChildren(TitleScreenUIManager);
        uiManager!.fromGameplay = true;
        uiManager?.toggleLoadingScreen(false);
        uiManager?.openLevelSelector();
      });
    }, 0.25);
  }

  update(deltaTime: number) {}
}
