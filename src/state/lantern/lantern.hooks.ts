import { useSelector, useDispatch } from "react-redux";

import { TAppDispatch, TRootState } from "~/state/root/root.types";

import * as selectors from "./lantern.selectors";
import { actions, TLanternState } from "./lantern.slice";

export const useLantern = () => {
  const dispatch: TAppDispatch = useDispatch();

  const state = useSelector<TRootState, TLanternState>(
    (state) => state.lantern
  );

  const resultMode = useSelector<TRootState, selectors.TResultMode>(
    selectors.selectResultMode
  );

  return {
    state: { ...state, resultMode },
    actions: {
      sendPress: () => dispatch(actions.press()),
      sendRelease: () => dispatch(actions.release()),
      sendToggleCharger: () =>
        dispatch(
          state.isCharging ? actions.removeFromCharge() : actions.putOnCharge()
        ),
    },
  };
};
