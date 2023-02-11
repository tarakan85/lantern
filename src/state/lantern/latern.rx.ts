import * as rx from "rxjs";

export type TButtonDispatchEvents = "press" | "release";
export type TButtonEvents = "click" | "doubleClick" | "longPress";

const buttonEvents$ = new rx.Subject<TButtonDispatchEvents>();

export const sendPress = () => buttonEvents$.next("press");
export const sendRelease = () => buttonEvents$.next("release");

export const press$ = buttonEvents$.pipe(
  rx.filter((event) => event === "press")
);
export const release$ = buttonEvents$.pipe(
  rx.filter((event) => event === "release")
);

const isLongPress = (
  event: TButtonDispatchEvents | "longPress"
): event is "longPress" => event === "longPress";

export const createLongPress = (time: number) => {
  return press$.pipe(
    rx.switchMap(() =>
      rx.timer(time).pipe(
        rx.map(() => "longPress" as const),
        rx.raceWith(release$)
      )
    ),
    rx.filter(isLongPress),
    rx.share()
  );
};

export const longPress$ = createLongPress(800);

export const click$ = press$.pipe(
  rx.switchMap(() =>
    rx.zip(rx.timer(300), release$.pipe(rx.take(1))).pipe(
      rx.map(() => "click" as const),
      rx.takeUntil(longPress$)
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
