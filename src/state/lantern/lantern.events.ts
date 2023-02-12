import * as rx from "rxjs";
import * as buttonEvents from "./button.events";

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

export const showChargingIndicator$ = buttonEvents.press$.pipe(
  rx.switchMap(() => rx.timer(400).pipe(rx.raceWith(buttonEvents.release$))),
  rx.map(() => ({
    type: "showChargingIndicator",
  }))
);

export const hideChargingIndicator$ = showChargingIndicator$.pipe(
  rx.switchMap(() => rx.timer(3000)),
  rx.map(() => ({
    type: "hideChargingIndicator",
  }))
);
