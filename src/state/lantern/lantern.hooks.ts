import { useSelector, useDispatch } from "react-redux";
import { TAppDispatch, TRootState } from "~/state/root/root.types";

import * as selectors from "./selectors";
import * as slice from "./lantern.slice";

export const useLantern = () => {
  const dispatch: TAppDispatch = useDispatch();
  const state = useSelector<TRootState, slice.TLanternState>(
    (state) => state.lantern
  );
  const resultMode = useSelector<TRootState, selectors.TResultMode>(
    selectors.selectResultMode
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
