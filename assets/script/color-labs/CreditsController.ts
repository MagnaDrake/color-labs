import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CreditsController")
export class CreditsController extends Component {
  onClickJellyYT() {
    window.open("https://www.youtube.com/@jellyhoshiumi");
  }

  onClickJellyTwt() {
    window.open("https://twitter.com/jellyhoshiumi");
  }

  onClickPhaseConnect() {
    window.open("https://phase-connect.com/");
  }

  onClickPeppy() {
    window.open("https://twitter.com/mira_peppy");
  }

  onClickMagna() {
    window.open("https://twitter.com/MagnaDrake_");
  }

  onClickLiosphe() {
    window.open("https://twitter.com/liosphe");
  }

  onClickPhaseJam() {
    window.open("https://itch.io/jam/unofficial-phaseconnect-jam-2");
  }

  onClickFreesound() {
    window.open("https://freesound.org/");
  }
}
