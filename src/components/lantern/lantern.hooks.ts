import * as React from "react";
import range from "lodash/range";
import { red, blue } from "@mui/material/colors";

import { createPausableEventsSequence } from "~/utils/rx";

type TFlickerRed = typeof red[500] | typeof blue[500] | "grey.50";

const flickerSeqRed = createPausableEventsSequence<TFlickerRed>([
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
  const [color, setColor] = React.useState<TFlickerRed>("grey.50");

  React.useEffect(() => {
    const subscription = flickerSeqRed.subscribe((event) =>
      setColor(event.value)
    );
    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    if (doFlicker) {
      flickerSeqRed.start();
    } else {
      flickerSeqRed.pause();
    }
  }, [doFlicker]);

  return color;
};

type TFlickerRedBlue = typeof red[500] | "grey.50";

const flickerSeqRedBlue = createPausableEventsSequence<TFlickerRedBlue>([
  { value: red[500], duration: 500 },
  { value: "grey.50" as const, duration: 500 },
]);

export const useRedFlicker = (doFlicker: boolean) => {
  const [color, setColor] = React.useState<TFlickerRedBlue>("grey.50");

  React.useEffect(() => {
    const subscription = flickerSeqRedBlue.subscribe((event) =>
      setColor(event.value)
    );
    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    if (doFlicker) {
      flickerSeqRedBlue.start();
    } else {
      flickerSeqRedBlue.pause();
    }
  }, [doFlicker]);

  return color;
};
