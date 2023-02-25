import * as React from "react";

import { lanterMachine } from "./lantern.machine.temp";
import { state$, sendPress, sendRelease } from "./lantern.rx";

export const useLantern = () => {
  const [state, setState] = React.useState(lanterMachine.initialState.context);
  React.useEffect(() => {
    const subscription = state$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, []);

  return {
    state,
    actions: {
      sendPress,
      sendRelease,
      // sendToggleCharger: state.isCharging
      //   ? lanternEvents.sendRemoveFromCharge
      //   : lanternEvents.sendPutOnCharge,
    },
  };
};
