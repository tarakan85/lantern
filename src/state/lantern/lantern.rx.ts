import * as rx from "rxjs";

import { lanternModel, lanterMachine, TEvents } from "./lantern.machine.temp";

const dispatch$ = new rx.Subject<TEvents>();

// public actions

export const sendPress = () => dispatch$.next(lanternModel.events.press());

export const sendRelease = () => dispatch$.next(lanternModel.events.release());

// state

export const state$ = dispatch$.pipe(
  rx.startWith(lanterMachine.initialState),
  rx.scan((state, transition) => {
    return lanterMachine.transition(state, transition as TEvents);
  }, lanterMachine.initialState)
);

// obervable types

export const press$ = dispatch$.pipe(
  rx.filter((event) => event.type === "press")
);

export const release$ = dispatch$.pipe(
  rx.filter((event) => event.type === "release")
);

// utils

export const createLongPress = (time: number) => {
  return press$.pipe(
    rx.switchMap(() => rx.timer(time).pipe(rx.raceWith(release$))),
    rx.filter((event) => event === 0)
  );
};

// effects

const togglePower$ = createLongPress(800).pipe(
  rx.map(lanternModel.events.togglePower)
);

const switchSubmode$ = press$.pipe(
  rx.withLatestFrom(state$),
  rx.filter(([, state]) => state.context.isTurnedOn),
  rx.tap((v) => console.log(1313, v)),
  rx.exhaustMap(() => {
    return rx
      .timer(300)
      .pipe(
        rx.zipWith(release$.pipe(rx.take(1))),
        rx.map(lanternModel.events.switchSubmode),
        rx.takeUntil(
          rx
            .merge(
              state$.pipe(rx.filter((state) => state.context.isTurnedOn)),
              press$
            )
            .pipe(rx.take(1))
        )
      );
  })
);

const switchMode$ = press$.pipe(
  rx.withLatestFrom(state$),
  rx.filter(([, state]) => !state.context.isTurnedOn),
  rx.exhaustMap(() => {
    return rx.timer(300).pipe(
      rx.mergeMap(() => rx.EMPTY),
      rx.raceWith(
        press$.pipe(rx.take(1), rx.map(lanternModel.events.switchMode))
      )
    );
  })
);

const showChargingIndicator$ = press$.pipe(
  rx.withLatestFrom(state$),
  rx.filter(([, state]) => !state.context.isTurnedOn),
  rx.switchMap(() => rx.timer(400).pipe(rx.raceWith(release$))),
  rx.map(lanternModel.events.showChargingIndicator)
);

const hideChargingIndicator$ = showChargingIndicator$.pipe(
  rx.switchMap(() => rx.timer(2000)),
  rx.map(lanternModel.events.hideChargingIndicator)
);

// assemble effects

rx.merge(
  togglePower$,
  switchSubmode$,
  switchMode$,
  showChargingIndicator$,
  hideChargingIndicator$
).subscribe((event) => dispatch$.next(event));
