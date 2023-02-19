import { ContextFrom, EventFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import { interpret } from "xstate";

import * as lanternEvents from "./lantern.events";

export type TModes = "regular" | "colorful";
export type TIntensity = "low" | "medium" | "high";
export type TColor =
  | "iridescent"
  | "redStatic"
  | "redFlicker"
  | "redBlueFlicker";

export const lanternModel = createModel(
  {
    isTurnedOn: false,
    mode: "regular" as TModes,
    intensity: "low" as TIntensity,
    color: "redStatic" as TColor,
    showChargeIndicator: false,
    isCharging: false,
  },
  {
    events: {
      togglePower: () => ({}),
      switchSubmode: () => ({}),
      switchMode: () => ({}),
      showChargingIndicator: () => ({}),
      hideChargingIndicator: () => ({}),
      putOnCharge: () => ({}),
      removeFromCharge: () => ({}),
    },
  }
);

export type TContext = ContextFrom<typeof lanternModel>;
export type TEvents = EventFrom<typeof lanternModel>;

const lanterMachine = lanternModel.createMachine(
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
          showChargingIndicator: {
            actions: lanternModel.assign({ showChargeIndicator: true }),
          },
        },
        invoke: [{ src: "togglePower" }, { src: "showChargingIndicator" }],
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
            initial: "redStatic",
            entry: lanternModel.assign({ mode: "colorful" }),
            on: {
              switchMode: "regular.intensityHistory",
            },
            invoke: {
              src: "switchMode",
            },
            states: {
              redStatic: {
                entry: lanternModel.assign({ color: "redStatic" }),
                on: {
                  switchSubmode: "redFlicker",
                },
                invoke: {
                  src: "switchSubmode",
                },
              },
              redFlicker: {
                entry: lanternModel.assign({ color: "redFlicker" }),
                on: {
                  switchSubmode: "redBlueFlicker",
                },
                invoke: {
                  src: "switchSubmode",
                },
              },
              redBlueFlicker: {
                entry: lanternModel.assign({ color: "redBlueFlicker" }),
                on: {
                  switchSubmode: "iridescent",
                },
                invoke: {
                  src: "switchSubmode",
                },
              },
              iridescent: {
                entry: lanternModel.assign({ color: "iridescent" }),
                on: {
                  switchSubmode: "redStatic",
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
    on: {
      hideChargingIndicator: {
        actions: lanternModel.assign({ showChargeIndicator: false }),
        cond: (ctx) => !ctx.isCharging,
      },
      putOnCharge: {
        actions: lanternModel.assign({
          isCharging: true,
          showChargeIndicator: true,
        }),
      },
      removeFromCharge: {
        actions: lanternModel.assign({ isCharging: false }),
      },
    },
    invoke: [
      { src: "hideChargingIndicator" },
      { src: "putOnCharge" },
      { src: "removeFromCharge" },
    ],
  },
  {
    services: {
      togglePower: () => lanternEvents.togglePower$,
      switchMode: () => lanternEvents.switchMode$,
      switchSubmode: () => lanternEvents.switchSubmode$,
      showChargingIndicator: () => lanternEvents.showChargingIndicator$,
      hideChargingIndicator: () => lanternEvents.hideChargingIndicator$,
      putOnCharge: () => lanternEvents.putOnCharge$,
      removeFromCharge: () => lanternEvents.removeFromCharge$,
    },
  }
);

export const lanternService = interpret(lanterMachine).start();
