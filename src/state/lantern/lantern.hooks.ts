import { useSelector, useDispatch } from "react-redux";
import { TAppDispatch, TRootState } from "~/state/root/root.types";

import * as selectors from "./selectors";
import * as slice from "./lantern.slice";

export const useLantern = () => {
  const dispatch: TAppDispatch = useDispatch();
  const state = useSelector<TRootState, slice.TState>((state) => state.lantern);
  const resultMode = useSelector<TRootState, selectors.TResultMode>((state) =>
    selectors.selectResultMode(state.lantern)
  );

  return {
    state: { ...state, resultMode },
    actions: {
      sendPress: () => dispatch(slice.actions.press()),
      sendRelease: () => dispatch(slice.actions.release()),
      sendToggleCharger: () => {},
      // sendToggleCharger: state.isCharging
      //   ? sendRemoveFromCharge
      //   : sendPutOnCharge,
    },
  };
};
