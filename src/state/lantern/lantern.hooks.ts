import * as React from "react";
import * as rx from "rxjs";

import { lanterMachine } from "./lantern.machine.temp";
import {
  state$,
  sendPress,
  sendRelease,
  sendRemoveFromCharge,
  sendPutOnCharge,
} from "./lantern.rx";
import * as selectors from "./selectors";

export const useLantern = () => {
  const [state, setState] = React.useState(lanterMachine.initialState.context);
  React.useEffect(() => {
    const subscription = state$
      .pipe(
        rx.filter((state) => state.changed === true),
        rx.map((state) => state.context)
      )
      .subscribe(setState);
    return () => subscription.unsubscribe();
  }, []);

  return {
    state: { ...state, resultMode: selectors.selectResultMode(state) },
    actions: {
      sendPress,
      sendRelease,
      sendToggleCharger: state.isCharging
        ? sendRemoveFromCharge
        : sendPutOnCharge,
    },
  };
};
