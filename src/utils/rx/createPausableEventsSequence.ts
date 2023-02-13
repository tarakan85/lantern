import * as rx from "rxjs";
import { nextIndex } from "~/utils/array";

type TEvent<T> = {
  value: T;
  duration: number;
};

export const createPausableEventsSequence = <T extends any>(
  events: TEvent<T>[]
) => {
  type TEventsState = {
    currentEventIndex: number;
    events: TEvent<T>[];
    isPlaying: boolean;
  };

  type TDispatchEvent = "start" | "pause" | "next";

  const dispatchEvent$ = new rx.Subject<TDispatchEvent>();

  const eventsState$ = dispatchEvent$.pipe(
    rx.scan<TDispatchEvent, TEventsState>(
      (state, action) =>
        ({
          start: {
            ...state,
            isPlaying: true,
          },
          pause: {
            ...state,
            isPlaying: false,
          },
          next: {
            ...state,
            currentEventIndex: nextIndex(state.currentEventIndex, state.events),
          },
        }[action]),
      { currentEventIndex: 0, events, isPlaying: false }
    )
  );

  const state$ = eventsState$.pipe(
    rx.switchMap((state) => {
      const index = state.currentEventIndex;
      const value = state.events[index];
      const duration = state.events[index].duration;

      return state.isPlaying
        ? rx.concat(
            rx.of(value),
            rx.timer(duration).pipe(
              rx.tap(() => dispatchEvent$.next("next")),
              rx.mergeMap(() => rx.EMPTY)
            )
          )
        : rx.EMPTY;
    })
  );

  return {
    subscribe: state$.subscribe.bind(state$),
    start: () => dispatchEvent$.next("start"),
    pause: () => dispatchEvent$.next("pause"),
  };
};
