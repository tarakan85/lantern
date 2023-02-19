import * as React from "react";
import range from "lodash/range";
import { red, blue } from "@mui/material/colors";

import { createPausableEventsSequence } from "~/utils/rx";

type TFlicker = typeof red[500] | typeof blue[500] | "grey.50";

const flickerSeq = createPausableEventsSequence<TFlicker>([
  ...range(3).flatMap(() => [
    { value: red[500], duration: 60 },
    { value: "grey.50" as const, duration: 60 },
  ]),
  { value: "grey.50" as const, duration: 400 },
  ...range(3).flatMap(() => [
    { value: blue[500], duration: 60 },
    { value: "grey.50" as const, duration: 60 },
  ]),
  { value: "grey.50" as const, duration: 800 },
]);

export const useRedBlueFlicker = (doFlicker: boolean) => {
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
