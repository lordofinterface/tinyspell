import {Runtime} from '../vm/runtime';
import {inputStore} from '../stores/input-store';
import * as VM_CONSTANTS from '../vm/constants';

export class Cart {
  runtime: Runtime;

  private cartName: string;
  private canvas: HTMLCanvasElement;
  private timeNextUpdate: number;

  constructor(cartName: string) {
    this.cartName = cartName;
    this.runtime = new Runtime(`tinespell-${cartName}`);
    this.timeNextUpdate = performance.now();
  }

  async init() {
    await this.runtime.init();
    this.canvas = this.runtime.canvas;
    await this.runtime.load(await Cart.loadCart(this.cartName));

    inputStore.subscribe(value => {
      this.runtime.setGamepad(0, value.gamepad);
      this.runtime.setMouse(value.mouseX, value.mouseY, value.mouseButtons);
    }); 

    this.runtime.start();

    requestAnimationFrame(t => this.update(t));

    return this.canvas;
  }

  update(timeFrameStart: number) {
    requestAnimationFrame(t => this.update(t));
    let calledUpdate = false;

    if (timeFrameStart - this.timeNextUpdate >= 200) {
      this.timeNextUpdate = timeFrameStart;
    }

    while (timeFrameStart >= this.timeNextUpdate) {
      this.timeNextUpdate += 1000 / 60;
      this.runtime.update();
      calledUpdate = true;
    }

    if (calledUpdate) this.runtime.composite();
  }

  async resetCart() {
    if (!this.runtime || !this.runtime.wasmBuffer) return;

    const wasmBuffer = this.runtime.wasmBuffer;
    this.runtime.reset(true);
    this.runtime.pauseState |= VM_CONSTANTS.PAUSE_REBOOTING;

    await this.runtime.load(wasmBuffer);
    this.runtime.pauseState &= ~VM_CONSTANTS.PAUSE_REBOOTING;
    this.runtime.start();
  }

  private static async loadCart(name: string): Promise<Uint8Array> {
    const cartUrl = `carts/${name}.wasm`;
    const res = await fetch(cartUrl);
    return new Uint8Array(await res.arrayBuffer());
  }
}
