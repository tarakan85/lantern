import * as React from "react";
import * as rx from "rxjs";

import * as buttonEvents from "./button.events";
import { state$, TContext } from "./lantern.machine.temp";

export const useLantern = () => {
  const [state, setState] = React.useState({} as TContext);
  React.useEffect(() => {
    const subscription = state$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, []);

  return {
    state,
    sendPress: buttonEvents.sendPress,
    sendRelease: buttonEvents.sendRelease,
    // sendToggleCharger: state.isCharging
    //   ? lanternEvents.sendRemoveFromCharge
    //   : lanternEvents.sendPutOnCharge,
  };
};
