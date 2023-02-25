import * as rx from "rxjs";

import { events, lanterMachine, TEvents } from "./lantern.machine";

const dispatch$ = new rx.Subject<TEvents>();

// public actions

export const sendPress = () => dispatch$.next(events.press());

export const sendRelease = () => dispatch$.next(events.release());

export const sendPutOnCharge = () => dispatch$.next(events.putOnCharge());

export const sendRemoveFromCharge = () =>
  dispatch$.next(events.removeFromCharge());

// state

export const state$ = dispatch$.pipe(
  rx.startWith(lanterMachine.initialState),
  rx.scan((state, transition) => {
    return lanterMachine.transition(state, transition as TEvents);
  }, lanterMachine.initialState),
  rx.map((state) => state.context)
);

// obervable types

export const press$ = dispatch$.pipe(
  rx.filter((event) => event.type === "press")
);

export const release$ = dispatch$.pipe(
  rx.filter((event) => event.type === "release")
);

export const putOnCharge$ = dispatch$.pipe(
  rx.filter((event) => event.type === "putOnCharge")
);

export const removeFromCharge$ = dispatch$.pipe(
  rx.filter((event) => event.type === "removeFromCharge")
);

// effects

const togglePower$ = press$.pipe(
  rx.switchMap(() => rx.timer(800).pipe(rx.raceWith(release$))),
  rx.filter((event) => event === 0),
  rx.map(events.togglePower)
);

const switchSubmode$ = press$.pipe(
  rx.withLatestFrom(state$),
  rx.filter(([, state]) => state.isTurnedOn),
  rx.exhaustMap(() => {
    return rx
      .timer(300)
      .pipe(
        rx.zipWith(release$.pipe(rx.take(1))),
        rx.map(events.switchSubmode),
        rx.takeUntil(
          rx
            .merge(state$.pipe(rx.filter((state) => state.isTurnedOn)), press$)
            .pipe(rx.take(1))
        )
      );
  })
);

const switchMode$ = press$.pipe(
  rx.withLatestFrom(state$),
  rx.filter(([, state]) => state.isTurnedOn),
  rx.exhaustMap(() => {
    return rx.timer(300).pipe(
      rx.mergeMap(() => rx.EMPTY),
      rx.raceWith(press$.pipe(rx.take(1), rx.map(events.switchMode)))
    );
  })
);

const showChargingIndicator$ = press$.pipe(
  rx.withLatestFrom(state$),
  rx.filter(([, state]) => !state.isTurnedOn),
  rx.switchMap(() => rx.timer(400).pipe(rx.raceWith(release$))),
  rx.map(events.showChargingIndicator)
);

const hideChargingIndicator$ = rx
  .merge(removeFromCharge$, showChargingIndicator$)
  .pipe(
    rx.withLatestFrom(state$),
    rx.filter(([, state]) => !state.isCharging),
    rx.switchMap(() => {
      return rx.timer(3000).pipe(rx.takeUntil(putOnCharge$.pipe(rx.take(1))));
    }),
    rx.map(events.hideChargingIndicator)
  );

// assemble effects

rx.merge(
  togglePower$,
  switchSubmode$,
  switchMode$,
  showChargingIndicator$,
  hideChargingIndicator$
).subscribe((event) => dispatch$.next(event));
