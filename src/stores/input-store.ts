import {map} from "nanostores";

export type TInputStore = {
  gamepad: number;
  mouseX: number;
  mouseY: number;
  mouseButtons: number;
};

export const inputStore = map<TInputStore>({
  gamepad: 0,
  mouseX: 0,
  mouseY: 0,
  mouseButtons: 0
});
