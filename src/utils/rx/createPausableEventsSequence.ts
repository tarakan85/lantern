import * as rx from "rxjs";
import { nextIndex } from "~/utils/array";

export type TEvent<TValue> = {
  value: TValue;
  duration: number;
};

export type TState<TValue> = {
  currentEventIndex: number;
  events: TEvent<TValue>[];
  isPlaying: boolean;
};

export type TDispatch = "start" | "pause" | "next";

export const createPausableEventsSequence = <TValue extends any>(
  events: TEvent<TValue>[]
) => {
  const dispatch$ = new rx.Subject<TDispatch>();

  const initialState: TState<TValue> = {
    currentEventIndex: 0,
    events,
    isPlaying: false,
  };

  const state$ = dispatch$.pipe(
    rx.scan<TDispatch, TState<TValue>>(
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
      initialState
    ),
    rx.shareReplay(1)
  );

  state$
    .pipe(
      rx.switchMap((state) => {
        const index = state.currentEventIndex;
        const duration = state.events[index].duration;

        return state.isPlaying
          ? rx.timer(duration).pipe(
              rx.tap(() => dispatch$.next("next")),
              rx.mergeMap(() => rx.EMPTY)
            )
          : rx.EMPTY;
      })
    )
    .subscribe();

  const currentEvent$ = state$.pipe(
    rx.map((state) => {
      const index = state.currentEventIndex;
      return state.events[index];
    })
  );

  return {
    subscribe: currentEvent$.subscribe.bind(currentEvent$),
    start: () => dispatch$.next("start"),
    pause: () => dispatch$.next("pause"),
  };
};
