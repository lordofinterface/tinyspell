import { inputStore } from '../stores/input-store';
import * as VM_CONSTANTS from '../vm/constants';

export class Mouse {
  private static instance: Mouse;
  private static canvas: HTMLCanvasElement;

  private constructor() {};

  public static init(canvas: HTMLCanvasElement) {
    if (!Mouse.instance) {
      Mouse.instance = new Mouse();
      Mouse.canvas = canvas;

      window.addEventListener("pointerdown", Mouse.eventHandler);
      window.addEventListener("pointerup", Mouse.eventHandler);
      window.addEventListener("pointermove", Mouse.eventHandler);
      Mouse.canvas.addEventListener("contextmenu", e => {e.preventDefault()});
    }
  }

  private static eventHandler(event: PointerEvent) {
    document.body.style.cursor = '';

    if (event.isPrimary) {
      const bounds = Mouse.canvas.getBoundingClientRect();
      const mouseX = Math.fround(VM_CONSTANTS.WIDTH * (event.clientX - bounds.left) / bounds.width);
      const mouseY = Math.fround(VM_CONSTANTS.HEIGHT * (event.clientY - bounds.top) / bounds.height);
      const mouseButtons = event.buttons & 0b111;

      inputStore.setKey('mouseX', mouseX);
      inputStore.setKey('mouseY', mouseY);
      inputStore.setKey('mouseButtons', mouseButtons);
    }
  }
}
