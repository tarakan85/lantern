import * as rx from "rxjs";

import { lanternModel, lanterMachine, TEvents } from "./lantern.machine.temp";

const dispatch$ = new rx.Subject<TEvents>();

export const sendPress = () => dispatch$.next(lanternModel.events.press());

export const sendRelease = () => dispatch$.next(lanternModel.events.release());

export const state$ = dispatch$.pipe(
  rx.startWith(lanterMachine.initialState),
  rx.scan((state, transition) => {
    return lanterMachine.transition(state, transition as TEvents);
  }, lanterMachine.initialState),
  rx.filter((state) => state.changed === true),
  rx.map((state) => state.context)
);

export const press$ = dispatch$.pipe(
  rx.filter((event) => event.type === "press")
);

export const release$ = dispatch$.pipe(
  rx.filter((event) => event.type === "release")
);

export const createLongPress = (time: number) => {
  return press$.pipe(
    rx.switchMap(() => rx.timer(time).pipe(rx.raceWith(release$))),
    rx.filter((event) => event === 0)
  );
};

const togglePower$ = createLongPress(800).pipe(
  rx.map(lanternModel.events.togglePower)
);

const switchSubmode$ = press$.pipe(
  rx.withLatestFrom(state$),
  rx.filter(([, state]) => state.isTurnedOn),
  rx.exhaustMap(() => {
    return rx
      .timer(300)
      .pipe(
        rx.zipWith(release$.pipe(rx.take(1))),
        rx.map(lanternModel.events.switchSubmode),
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
      rx.raceWith(
        press$.pipe(rx.take(1), rx.map(lanternModel.events.switchMode))
      )
    );
  })
);

rx.merge(togglePower$, switchSubmode$, switchMode$).subscribe((event) =>
  dispatch$.next(event)
);
