import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PreloadController")
export class PreloadController extends Component {
  start() {
    this.scheduleOnce(() => {
      director.loadScene("title");
    }, 0.25);
  }

  update(deltaTime: number) {}
}
