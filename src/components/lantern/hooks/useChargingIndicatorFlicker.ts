import * as React from "react";
import { indigo } from "@mui/material/colors";

import { createPausableEventsSequence } from "~/utils/rx";

type TFlicker = typeof indigo[500] | "transparent";

const flickerSeq = createPausableEventsSequence<TFlicker>([
  { value: indigo[500], duration: 500 },
  { value: "transparent" as const, duration: 500 },
]);

export const useChargingIndicatorFlicker = (doFlicker: boolean) => {
  const [color, setColor] = React.useState<TFlicker>("transparent");

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
