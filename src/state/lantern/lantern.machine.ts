import * as rx from "rxjs";
import { ContextFrom, EventFrom } from "xstate";
import { createModel } from "xstate/lib/model";

import * as lanternEvents from "./lantern.events";
import * as buttonEvents from "./button.events";

export type TModes = "regular" | "colorful";
export type TIntensity = "low" | "medium" | "high";
export type TColor = "red" | "blue";

const lanternModel = createModel(
  {
    isTurnedOn: false,
    mode: "regular" as TModes,
    intensity: "low" as TIntensity,
    color: "red" as TColor,
    showChargeIndicator: false,
    isCharging: false,
  },
  {
    events: {
      togglePower: () => ({}),
      switchSubmode: () => ({}),
      switchMode: () => ({}),
    },
  }
);

export type TContext = ContextFrom<typeof lanternModel>;
export type TEvents = EventFrom<typeof lanternModel>;

export const lanterMachine = lanternModel.createMachine(
  {
    predictableActionArguments: true,
    id: "app",
    context: lanternModel.initialContext,
    initial: "turnedOff",
    states: {
      turnedOff: {
        entry: lanternModel.assign({ isTurnedOn: false }),
        on: {
          togglePower: "turnedOn.modeHistory",
        },
        invoke: [{ src: "togglePower" }],
      },
      turnedOn: {
        entry: lanternModel.assign({ isTurnedOn: true }),
        on: {
          togglePower: "turnedOff",
        },
        invoke: {
          src: "togglePower",
        },
        initial: "regular",
        states: {
          regular: {
            initial: "low",
            entry: lanternModel.assign({ mode: "regular" }),
            on: {
              switchMode: "colorful.colorHistory",
            },
            invoke: {
              src: "switchMode",
            },
            states: {
              low: {
                entry: lanternModel.assign({ intensity: "low" }),
                on: {
                  switchSubmode: "medium",
                },
                invoke: {
                  src: "switchSubmode",
                },
              },
              medium: {
                entry: lanternModel.assign({ intensity: "medium" }),
                on: {
                  switchSubmode: "high",
                },
                invoke: {
                  src: "switchSubmode",
                },
              },
              high: {
                entry: lanternModel.assign({ intensity: "high" }),
                on: {
                  switchSubmode: "low",
                },
                invoke: {
                  src: "switchSubmode",
                },
              },
              intensityHistory: {
                type: "history",
                history: "shallow",
              },
            },
          },
          colorful: {
            initial: "red",
            entry: lanternModel.assign({ mode: "colorful" }),
            on: {
              switchMode: "regular.intensityHistory",
            },
            invoke: {
              src: "switchMode",
            },
            states: {
              red: {
                entry: lanternModel.assign({ color: "red" }),
                on: {
                  switchSubmode: "blue",
                },
                invoke: {
                  src: "switchSubmode",
                },
              },
              blue: {
                entry: lanternModel.assign({ color: "blue" }),
                on: {
                  switchSubmode: "red",
                },
                invoke: {
                  src: "switchSubmode",
                },
              },
              colorHistory: {
                type: "history",
                history: "shallow",
              },
            },
          },
          modeHistory: {
            type: "history",
            history: "deep",
          },
        },
      },
    },
  },
  {
    services: {
      togglePower: () => lanternEvents.togglePower$,
      switchMode: () => lanternEvents.switchMode$,
      switchSubmode: () => lanternEvents.switchSubmode$,
    },
  }
);
