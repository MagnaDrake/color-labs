import { _decorator, Component, Node, tween, UIOpacity } from "cc";
import { moveTo } from "./position";
import { BlackScreen } from "./BlackScreen";
import { AudioKeys, AudioManager, getAudioKeyString } from "./AudioManager";
const { ccclass, property } = _decorator;

@ccclass("TitleScreenUIManager")
export class TitleScreenUIManager extends Component {
  @property(Node)
  jellyHiddenAnchor!: Node;

  @property(Node)
  jellyVisibleAnchor!: Node;

  @property(Node)
  titleHiddenAnchor!: Node;

  @property(Node)
  titleVisibleAnchor!: Node;

  @property(Node)
  levelSelectorVisibleAnchor!: Node;

  @property(Node)
  levelSelectorHiddenAnchor!: Node;

  @property(Node)
  jellySprite!: Node;

  @property(Node)
  menuObjects!: Node;

  @property(Node)
  levelSelector!: Node;

  @property(Node)
  creditsLabels!: Node;

  @property(Node)
  howToPlay!: Node;

  fromGameplay = false;

  @property(BlackScreen)
  blackScreen!: BlackScreen;

  protected onLoad(): void {
    this.jellySprite.setWorldPosition(this.jellyHiddenAnchor.worldPosition);
    this.levelSelector.setWorldPosition(
      this.levelSelectorHiddenAnchor.worldPosition
    );
    this.menuObjects.setWorldPosition(this.titleHiddenAnchor.worldPosition);
    this.blackScreen.toggleVisibility(true);
  }
  start() {
    AudioManager.Instance.play(
      `${getAudioKeyString(AudioKeys.BGMTitle)}`,
      0.6,
      true
    );

    if (!this.fromGameplay) {
      moveTo(this.jellySprite, this.jellyVisibleAnchor.worldPosition, 1);
      moveTo(this.menuObjects, this.titleVisibleAnchor.worldPosition, 1);
    }
    this.blackScreen.toggleVisibility(false);
  }

  openLevelSelector() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXSweep)}-0`
    );
    moveTo(this.jellySprite, this.jellyHiddenAnchor.worldPosition, 1);
    moveTo(this.menuObjects, this.titleHiddenAnchor.worldPosition, 1);
    moveTo(
      this.levelSelector,
      this.levelSelectorVisibleAnchor.worldPosition,
      1
    );
  }

  onClickCredits() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    );
    this.creditsLabels!.active = true;
    moveTo(this.jellySprite, this.jellyHiddenAnchor.worldPosition, 1);
    moveTo(this.menuObjects, this.titleHiddenAnchor.worldPosition, 1);
  }

  onHideCredits() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
    this.creditsLabels!.active = false;
    this.closeLevelSelector();
  }

  onStartGameClick() {
    this.openLevelSelector();
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
  }

  onBackLevelSelectorClick() {
    this.closeLevelSelector();
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXUIClick)}`
    );
  }

  closeLevelSelector() {
    AudioManager.Instance.playOneShot(
      `${getAudioKeyString(AudioKeys.SFXSweep)}-1`
    );
    moveTo(this.jellySprite, this.jellyVisibleAnchor.worldPosition, 1);
    moveTo(this.menuObjects, this.titleVisibleAnchor.worldPosition, 1);
    moveTo(this.levelSelector, this.levelSelectorHiddenAnchor.worldPosition, 1);
  }

  showHowToPlay() {
    this.howToPlay.active = true;
  }

  hideHowToPlay() {
    this.howToPlay.active = false;
  }

  toggleLoadingScreen(value: boolean) {
    this.blackScreen.toggleVisibility(value);
  }

  update(deltaTime: number) {}
}
