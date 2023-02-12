import * as rx from "rxjs";
import * as buttonEvents from "./button.events";

type TLanternDispatchEvents = "putOnCharge" | "removeFromCharge";

const lanternEvents$ = new rx.Subject<TLanternDispatchEvents>();

export const sendPutOnCharge = () => lanternEvents$.next("putOnCharge");
export const sendRemoveFromCharge = () =>
  lanternEvents$.next("removeFromCharge");

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

export const putOnCharge$ = lanternEvents$.pipe(
  rx.filter((event) => event === "putOnCharge"),
  rx.map(() => ({
    type: "putOnCharge",
  }))
);

export const removeFromCharge$ = lanternEvents$.pipe(
  rx.filter((event) => event === "removeFromCharge"),
  rx.map(() => ({
    type: "removeFromCharge",
  }))
);

export const showChargingIndicator$ = buttonEvents.press$.pipe(
  rx.switchMap(() => rx.timer(400).pipe(rx.raceWith(buttonEvents.release$))),
  rx.map(() => ({
    type: "showChargingIndicator",
  }))
);

export const hideChargingIndicator$ = rx
  .merge(removeFromCharge$, showChargingIndicator$)
  .pipe(
    rx.switchMap(() => rx.timer(3000)),
    rx.map(() => ({
      type: "hideChargingIndicator",
    }))
  );
