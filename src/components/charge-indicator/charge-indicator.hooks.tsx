import * as React from "react";

import { createPausableEventsSequence } from "~/utils/rx";

import { COLORS } from "./charge-indicator.constants";

type TFlicker = COLORS.BLUE | COLORS.NONE;

const flickerSeq = createPausableEventsSequence<TFlicker>([
  { value: COLORS.BLUE, duration: 500 },
  { value: COLORS.NONE, duration: 500 },
]);

export const useChargingIndicatorFlicker = (doFlicker: boolean) => {
  const [color, setColor] = React.useState<TFlicker>(COLORS.NONE);

  React.useEffect(() => {
    const subscription = flickerSeq.subscribe((event) => setColor(event.value));
    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    if (doFlicker) {
      flickerSeq.start();
    } else {
      flickerSeq.pause();
    }
  }, [doFlicker]);

  return color;
};
