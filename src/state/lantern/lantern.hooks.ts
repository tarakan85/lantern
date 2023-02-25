import * as React from "react";

import { TContext } from "./lantern.machine.temp";
import { state$, sendPress, sendRelease } from "./lantern.rx";

export const useLantern = () => {
  const [state, setState] = React.useState({} as TContext);
  React.useEffect(() => {
    const subscription = state$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, []);

  return {
    state,
    sendPress: sendPress,
    sendRelease: sendRelease,
    // sendToggleCharger: state.isCharging
    //   ? lanternEvents.sendRemoveFromCharge
    //   : lanternEvents.sendPutOnCharge,
  };
};
