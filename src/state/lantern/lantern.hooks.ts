import { useSelector, useDispatch } from "react-redux";

import { TAppDispatch, TRootState } from "~/state/root/root.types";

import * as selectors from "./lantern.selectors";
import { actions } from "./lantern.slice";
import * as types from "./lantern.types";

export const useLantern = () => {
  const dispatch: TAppDispatch = useDispatch();

  const state = useSelector<TRootState, types.TState>((state) => state.lantern);

  const resultMode = useSelector<TRootState, types.TResultMode>(
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
