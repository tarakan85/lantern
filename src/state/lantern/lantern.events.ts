import * as rx from "rxjs";
import * as buttonEvents from "./button.events";
import { TEvents } from "./lantern.machine";

export const togglePower$ = buttonEvents.createLongPress(800).pipe(
  rx.map(() => ({
    type: "togglePower",
  }))
);

export const switchMode$ = buttonEvents.doubleClick$.pipe(
  rx.map(() => ({
    type: "switchMode",
  }))
);

export const switchSubmode$ = buttonEvents.clickDelayed$.pipe(
  rx.map(() => ({
    type: "switchSubmode",
  }))
);
