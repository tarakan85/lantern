import * as React from "react";

import { lanterMachine } from "./lantern.machine.temp";
import { state$, sendPress, sendRelease } from "./lantern.rx";
import * as selectors from "./selectors";

export const useLantern = () => {
  const [state, setState] = React.useState(lanterMachine.initialState.context);
  React.useEffect(() => {
    const subscription = state$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, []);

  return {
    state: { ...state, resultMode: selectors.selectResultMode(state) },
    actions: {
      sendPress,
      sendRelease,
      // sendToggleCharger: state.isCharging
      //   ? lanternEvents.sendRemoveFromCharge
      //   : lanternEvents.sendPutOnCharge,
    },
  };
};
