import * as rx from "rxjs";

import { lanternModel, lanterMachine, TEvents } from "./lantern.machine.temp";

const dispatch$ = new rx.Subject<TEvents>();

export const sendPress = () => dispatch$.next(lanternModel.events.press());
export const sendRelease = () => dispatch$.next(lanternModel.events.release());
export const sendTogglePower = () =>
  dispatch$.next(lanternModel.events.togglePower());
export const sendSwitchSubMode = () =>
  dispatch$.next(lanternModel.events.switchSubmode());

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

export const doubleClick$ = press$.pipe(
  rx.exhaustMap(() =>
    rx.timer(300).pipe(
      rx.mergeMap(() => rx.EMPTY),
      rx.raceWith(
        press$.pipe(rx.take(1), rx.map(lanternModel.events.doubleClick))
      )
    )
  )
);

export const createLongPress = (time: number) => {
  return press$.pipe(
    rx.switchMap(() =>
      rx
        .timer(time)
        .pipe(rx.map(lanternModel.events.longPress), rx.raceWith(release$))
    ),
    rx.filter((event) => event.type === "longPress")
  );
};

const togglePower$ = createLongPress(800).pipe(rx.tap(sendTogglePower));
const switchSubmode$ = dispatch$.pipe(
  rx.withLatestFrom(state$),
  rx.filter(([, state]) => state.isTurnedOn),
  rx.filter(([event]) => event.type === "press"),
  rx.switchMap(() => {
    return rx.timer(300).pipe(
      rx.zipWith(release$.pipe(rx.take(1))),
      rx.map(lanternModel.events.clickDelayed),
      rx.takeUntil(
        state$.pipe(
          rx.filter((state) => state.isTurnedOn),
          rx.take(1)
        )
      )
    );
  }),
  rx.tap(sendSwitchSubMode)
);

rx.merge(togglePower$, switchSubmode$).subscribe();
