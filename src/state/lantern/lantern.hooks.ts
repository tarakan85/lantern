import * as React from "react";
import { interpret } from "xstate";
import * as rx from "rxjs";

import * as buttonEvents from "./button.events";

import { lanterMachine, TContext } from "./lantern.machine";

const service = interpret(lanterMachine).start();

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
    sendPress: buttonEvents.sendPress,
    sendRelease: buttonEvents.sendRelease,
  };
};
