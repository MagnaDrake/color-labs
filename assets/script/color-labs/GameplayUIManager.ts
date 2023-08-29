import { _decorator, Component, Node, Vec3 } from "cc";
import { LevelClearHeader } from "./LevelClearHeader";
import { moveTo } from "./position";
import { BlackScreen } from "./BlackScreen";
import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("GameplayUIManager")
export class GameplayUIManager extends Component {
  @property(LevelClearHeader)
  levelClearHeader!: LevelClearHeader;

  @property(Node)
  headerAnchor!: Node;

  @property(Node)
  nextLevelButton!: Node;

  @property(Node)
  retryButton!: Node;

  @property(Node)
  completeAllLevelsButton!: Node;

  @property(Node)
  backToLevelSelectButton!: Node;

  @property(BlackScreen)
  blackScreen!: BlackScreen;

  retryButtonAnchor!: Vec3;

  nextLevelButtonAnchor!: Vec3;

  completeAllLevelsAnchor!: Vec3;

  toggleLevelClear(isWin: boolean, moves = 0, devRecord = 0) {
    moveTo(this.levelClearHeader.node, this.headerAnchor.worldPosition, 0.25);
    this.levelClearHeader.updateText(isWin, moves, devRecord);
    if (isWin) {
      if (GameManager.Instance.levelIndex >= 49) {
        moveTo(
          this.completeAllLevelsButton,
          this.completeAllLevelsAnchor,
          0.25
        );
      } else {
        moveTo(this.nextLevelButton, this.nextLevelButtonAnchor, 0.25);
      }
    }

    //moveTo(this.retryButton, this.retryButtonAnchor, 0.25);
  }

  resetUI() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    );

    this.blackScreen.toggleVisibility(true);

    // this.retryButton.setPosition(
    //   -1200,
    //   this.retryButton.position.y,
    //   this.retryButton.position.z
    // );

    this.nextLevelButton.setPosition(
      1200,
      this.nextLevelButton.position.y,
      this.nextLevelButton.position.z
    );

    this.levelClearHeader.node.position = new Vec3(0, 600, 0);

    this.completeAllLevelsButton.position = new Vec3(0, -500, 0);
  }

  protected onLoad(): void {
    const levelAnchor = this.completeAllLevelsButton.worldPosition;
    const nlbWp = this.nextLevelButton.worldPosition;

    // this.retryButtonAnchor = new Vec3(retryWp.x, retryWp.y, retryWp.z);
    this.nextLevelButtonAnchor = new Vec3(nlbWp.x, nlbWp.y, nlbWp.z);
    this.completeAllLevelsAnchor = new Vec3(
      levelAnchor.x,
      levelAnchor.y,
      levelAnchor.z
    );
    this.resetUI();
  }

  toggleLoadingScreen(value: boolean) {
    this.blackScreen.toggleVisibility(value);
  }

  update(deltaTime: number) {}
}
