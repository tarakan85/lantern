import * as React from "react";
import { red, blue } from "@mui/material/colors";

import { createPausableEventsSequence } from "~/utils/rx";

type TFlicker = typeof red[500] | "grey.50";

const flickerSeq = createPausableEventsSequence<TFlicker>([
  { value: red[500], duration: 500 },
  { value: "grey.50" as const, duration: 500 },
]);

export const useRedFlicker = (doFlicker: boolean) => {
  const [color, setColor] = React.useState<TFlicker>("grey.50");

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
