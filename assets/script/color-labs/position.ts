import {
  Node,
  view,
  Vec3,
  director,
  tween,
  easing,
  randomRangeInt,
  ITweenOption,
} from "cc";

export function getWorldPosFromUIPos(x: number, y: number) {
  const { width, height } = view.getVisibleSize();
  return {
    x: x - width * 0.5,
    y: y - height * 0.5,
  };
}

export function loadScene(scene: string) {
  director.loadScene(scene);
}

export function moveTo(
  object: Node,
  target: Vec3,
  duration: number,
  completeCallback?: any
) {
  const tweenProps = { worldPosition: target };
  let onComplete;
  if (completeCallback !== undefined) {
    onComplete = completeCallback;
  }
  const easingProps: ITweenOption = { easing: easing.circOut, onComplete };
  const moveTween = tween(object).to(duration, tweenProps, easingProps).start();

  return moveTween;
}

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function isTargetOnTheRight(a: number, b: number) {
  return a < b;
}

export function coinFlip() {
  const coin = randomRangeInt(0, 10);
  return coin >= 5;
}
