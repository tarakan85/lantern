import * as React from "react";
import * as rx from "rxjs";

import * as buttonEvents from "./button.events";
import * as lanternEvents from "./lantern.events";
import { lanternService, TContext } from "./lantern.machine";

const state$ = rx
  .from(lanternService)
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
    sendToggleCharger: state.isCharging
      ? lanternEvents.sendRemoveFromCharge
      : lanternEvents.sendPutOnCharge,
  };
};
