import * as React from "react";
import range from "lodash/range";

import { createPausableEventsSequence } from "~/utils/rx";

type TFlicker = "red" | "blue" | null;

const flickerSeq = createPausableEventsSequence<TFlicker>([
  ...range(3).flatMap(() => [
    { value: "red" as const, duration: 60 },
    { value: null, duration: 60 },
  ]),
  { value: null, duration: 400 },
  ...range(3).flatMap(() => [
    { value: "blue" as const, duration: 60 },
    { value: null, duration: 60 },
  ]),
  { value: null, duration: 800 },
]);

export const useRedBlueFlicker = (doFlicker: boolean) => {
  const [color, setColor] = React.useState<TFlicker>(null);

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
