import * as React from "react";
import { interpret } from "xstate";
import * as rx from "rxjs";

import * as events from "./latern.rx";
import { lanterMachine, TContext } from "./lantern.machine";

const machine = lanterMachine.withConfig({
  services: {
    click: () => events.click$.pipe(rx.map((type) => ({ type }))),
    doubleClick: () => events.doubleClick$.pipe(rx.map((type) => ({ type }))),
    longPress: () =>
      events.createLongPress(800).pipe(rx.map((type) => ({ type }))),
  },
});

const service = interpret(machine).start();

const state$ = rx
  .from(service)
  .pipe(rx.filter((state) => state.changed === true));

export const useLantern = () => {
  const [state, setState] = React.useState({} as TContext);
  React.useEffect(() => {
    const subscription = state$.subscribe((state) => setState(state.context));
    return () => subscription.unsubscribe();
  }, []);

  return {
    state,
    sendPress: events.sendPress,
    sendRelease: events.sendRelease,
  };
};
