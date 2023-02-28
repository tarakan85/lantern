import * as rx from "rxjs";
import { ofType, combineEpics } from "redux-observable";

import { TEpic } from "~/state/root/root.types";
import * as TIME from "~/constants/time";

import { actions } from "./lantern.slice";

const togglePower: TEpic = (action$) =>
  action$.pipe(
    ofType(actions.press.type),
    rx.switchMap(() =>
      rx
        .timer(TIME.TURN_ON_THRESHOLD)
        .pipe(rx.raceWith(action$.pipe(ofType(actions.release))))
    ),
    rx.filter((event) => event === 0),
    rx.map(() => actions.togglePower())
  );

const switchSubmode: TEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.press.type),
    rx.withLatestFrom(state$),
    rx.filter(([, state]) => state.lantern.isTurnedOn),
    rx.exhaustMap(() => {
      return rx.timer(TIME.DOUBLE_PRESS_THRESHOLD).pipe(
        rx.zipWith(action$.pipe(ofType(actions.release.type))),
        rx.map(() => actions.switchSubmode()),
        rx.takeUntil(
          rx.merge(
            state$.pipe(rx.filter((state) => !state.lantern.isTurnedOn)),
            action$.pipe(ofType(actions.press.type))
          )
        )
      );
    })
  );

const switchMode: TEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.press.type),
    rx.withLatestFrom(state$),
    rx.filter(([, state]) => state.lantern.isTurnedOn),
    rx.exhaustMap(() => {
      return rx.timer(TIME.DOUBLE_PRESS_THRESHOLD).pipe(
        rx.raceWith(action$.pipe(ofType(actions.press.type), rx.take(1))),
        rx.exhaustMap(() =>
          action$.pipe(
            ofType(actions.release.type),
            rx.take(1),
            rx.map(() => actions.switchMode()),
            rx.takeUntil(
              state$.pipe(rx.filter((state) => !state.lantern.isTurnedOn))
            )
          )
        )
      );
    })
  );

const showChargingIndicator: TEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.press.type),
    rx.withLatestFrom(state$),
    rx.filter(([, state]) => !state.lantern.isTurnedOn),
    rx.switchMap(() =>
      rx
        .timer(TIME.SHOW_CHARGE_INDICATOR_FROM_PRESS_THRESHOLD)
        .pipe(rx.raceWith(action$.pipe(ofType(actions.release.type))))
    ),
    rx.map(() => actions.showChargingIndicator())
  );

const hideChargingIndicator: TEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.removeFromCharge.type, actions.showChargingIndicator.type),
    rx.withLatestFrom(state$),
    rx.filter(([, state]) => !state.lantern.isCharging),
    rx.switchMap(() => {
      return rx
        .timer(TIME.CHARGE_INDICATOR_AUTO_SHUTDOWN_TIMER)
        .pipe(rx.takeUntil(action$.pipe(ofType(actions.putOnCharge.type))));
    }),
    rx.map(() => actions.hideChargingIndicator())
  );

export const epic = combineEpics(
  togglePower,
  switchSubmode,
  switchMode,
  showChargingIndicator,
  hideChargingIndicator
);
