import * as rx from "rxjs";

export type TButtonDispatchEvents = "press" | "release";
export type TButtonEvents =
  | "press"
  | "release"
  | "click"
  | "doubleClick"
  | "longPress";

const buttonEvents$ = new rx.Subject<TButtonDispatchEvents>();

export const sendPress = () => buttonEvents$.next("press");
export const sendRelease = () => buttonEvents$.next("release");

export const press$ = buttonEvents$.pipe(
  rx.filter((event) => event === "press")
);
export const release$ = buttonEvents$.pipe(
  rx.filter((event) => event === "release")
);

export const click$ = press$.pipe(
  rx.switchMap(() =>
    rx.timer(300).pipe(
      rx.zipWith(release$.pipe(rx.take(1))),
      rx.map(() => "click" as const)
    )
  )
);

export const doubleClick$ = press$.pipe(
  rx.exhaustMap(() =>
    rx.timer(300).pipe(
      rx.mergeMap(() => rx.EMPTY),
      rx.raceWith(
        press$.pipe(
          rx.take(1),
          rx.map(() => "doubleClick" as const)
        )
      )
    )
  )
);

export const createLongPress = (time: number) => {
  return press$.pipe(
    rx.switchMap(() =>
      rx.timer(time).pipe(
        rx.map(() => "longPress" as const),
        rx.raceWith(release$)
      )
    ),
    rx.filter((action) => action === "longPress")
  );
};
