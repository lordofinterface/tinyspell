import { Runtime } from '../vm/runtime';
import * as VM_CONSTANTS from '../vm/constants';
import { inputStore } from '../stores/input-store';

export class Keyboard {
  private static instance: Keyboard;
  private static runtime: Runtime;

  private constructor() {};

  public static init(runtime: Runtime) {
    if (!Keyboard.instance) {
      Keyboard.instance = new Keyboard();
      Keyboard.runtime = runtime;

      window.addEventListener("keydown", Keyboard.eventHandler);
      window.addEventListener("keyup", Keyboard.eventHandler);
    }
  }

  private static eventHandler(event: KeyboardEvent) {
    if (event.ctrlKey || event.altKey) return;
    if (event.target instanceof HTMLElement && event.target.tagName == 'INPUT') return;

    const down = (event.type == 'keydown');

    Keyboard.runtime.unlockAudio();

    document.body.style.cursor = "none";

    let mask = 0;

    switch (event.code) {
      case "KeyX": case "KeyV": case "Space": case "Period":
        mask = VM_CONSTANTS.BUTTON_X;
        break;
      case "KeyZ": case "KeyC": case "Comma":
        mask = VM_CONSTANTS.BUTTON_Z;
        break;
      case "ArrowUp":
        mask = VM_CONSTANTS.BUTTON_UP;
        break;
      case "ArrowDown":
        mask = VM_CONSTANTS.BUTTON_DOWN;
        break;
      case "ArrowLeft":
        mask = VM_CONSTANTS.BUTTON_LEFT;
        break;
      case "ArrowRight":
        mask = VM_CONSTANTS.BUTTON_RIGHT;
        break;
    }

    if (mask != 0) {
      event.preventDefault();
      if (down) {
        inputStore.setKey('gamepad', inputStore.get().gamepad | mask);
      } else {
        inputStore.setKey('gamepad', inputStore.get().gamepad & ~mask);
      }
    }

  }
}
