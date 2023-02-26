import * as React from "react";
import range from "lodash/range";

import { createPausableEventsSequence } from "~/utils/rx";

import { COLORS } from "./lantern.constants";

type TFlickerRedBlue = COLORS.RED | COLORS.BLUE | COLORS.NONE;

const flickerSeqRedBlue = createPausableEventsSequence<TFlickerRedBlue>([
  ...range(3).flatMap(() => [
    { value: COLORS.RED, duration: 60 },
    { value: COLORS.NONE, duration: 60 },
  ]),
  { value: COLORS.NONE, duration: 400 },
  ...range(3).flatMap(() => [
    { value: COLORS.BLUE, duration: 60 },
    { value: COLORS.NONE, duration: 60 },
  ]),
  { value: COLORS.NONE, duration: 800 },
]);

export const useRedBlueFlicker = (doFlicker: boolean) => {
  const [color, setColor] = React.useState<TFlickerRedBlue>(COLORS.NONE);

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

type TFlickerRed = COLORS.RED | COLORS.NONE;

const flickerSeqRed = createPausableEventsSequence<TFlickerRed>([
  { value: COLORS.RED, duration: 500 },
  { value: COLORS.NONE, duration: 500 },
]);

export const useRedFlicker = (doFlicker: boolean) => {
  const [color, setColor] = React.useState<TFlickerRed>(COLORS.NONE);

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
