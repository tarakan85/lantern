import * as rx from "rxjs";
import { ofType } from "redux-observable";

import { TEpic } from "~/state/root/root.types";

import { actions } from "./lantern.slice";

export const togglePower: TEpic = (action$) =>
  action$.pipe(
    ofType(actions.press.type),
    rx.switchMap(() =>
      rx.timer(800).pipe(rx.raceWith(action$.pipe(ofType(actions.release))))
    ),
    rx.filter((event) => event === 0),
    rx.map(() => actions.togglePower())
  );

export const switchSubmode: TEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.press.type),
    rx.withLatestFrom(state$),
    rx.filter(([, state]) => state.lantern.isTurnedOn),
    rx.exhaustMap(() => {
      return rx.timer(300).pipe(
        rx.zipWith(action$.pipe(ofType(actions.release.type))),
        rx.map(() => actions.switchSubmode()),
        rx.takeUntil(
          rx
            .merge(
              state$.pipe(rx.filter((state) => !state.lantern.isTurnedOn)),
              action$.pipe(ofType(actions.press.type))
            )
            .pipe(rx.take(1))
        )
      );
    })
  );

export const switchMode: TEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.press.type),
    rx.withLatestFrom(state$),
    rx.filter(([, state]) => state.lantern.isTurnedOn),
    rx.exhaustMap(() => {
      return rx.timer(300).pipe(
        rx.mergeMap(() => rx.EMPTY),
        rx.raceWith(
          action$.pipe(
            ofType(actions.press.type),
            rx.take(1),
            rx.map(() => actions.switchMode())
          )
        )
      );
    })
  );
