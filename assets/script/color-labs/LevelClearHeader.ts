import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LevelClearHeader")
export class LevelClearHeader extends Component {
  @property(Label)
  headerLabel!: Label;

  @property(Label)
  primaryLabel!: Label;

  @property(Label)
  secondaryLabel!: Label;

  updateText(isWin: boolean, moves: number, devRecord?: number) {
    if (isWin) {
      this.headerLabel.string = "Level Clear!";
      this.primaryLabel.string = `You have cleared the level in ${moves} moves!`;
      let secondaryString;
      if (devRecord && devRecord > 0) {
        let tailString = "";
        if (moves > devRecord) {
          tailString = "You can do better!";
        } else if (moves < devRecord) {
          tailString = "Amazing!";
        } else {
          tailString = "Good work!";
        }
        secondaryString = `The devs' record is ${devRecord} moves. ${tailString}`;
      } else {
        secondaryString = "Good work!";
      }
      this.secondaryLabel.string = secondaryString;

      // todo find out how many optimal moves per level
    } else {
      this.headerLabel.string = "Level Failed...";
      this.primaryLabel.string = `There are no more possible moves.`;
      let secondaryString = "Nice try!";
      if (devRecord && devRecord > 0) {
        if (devRecord - moves <= 4) {
          secondaryString = "So close!";
        }
      }

      this.secondaryLabel.string = secondaryString;
    }
  }
}
