import { ContextFrom, EventFrom } from "xstate";
import { createModel } from "xstate/lib/model";

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
      press: () => ({}),
      release: () => ({}),
    },
  }
);

export type TContext = ContextFrom<typeof lanternModel>;
export type TEvents = EventFrom<typeof lanternModel>;

export const lanterMachine = lanternModel.createMachine({
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
    },
    turnedOn: {
      entry: lanternModel.assign({ isTurnedOn: true }),
      on: {
        togglePower: "turnedOff",
      },
      initial: "regular",
      states: {
        regular: {
          initial: "low",
          entry: lanternModel.assign({ mode: "regular" }),
          on: {
            switchMode: "colorful.colorHistory",
          },

          states: {
            low: {
              entry: lanternModel.assign({ intensity: "low" }),
              on: {
                switchSubmode: "medium",
              },
            },
            medium: {
              entry: lanternModel.assign({ intensity: "medium" }),
              on: {
                switchSubmode: "high",
              },
            },
            high: {
              entry: lanternModel.assign({ intensity: "high" }),
              on: {
                switchSubmode: "low",
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

          states: {
            redStatic: {
              entry: lanternModel.assign({ color: "redStatic" }),
              on: {
                switchSubmode: "redFlicker",
              },
            },
            redFlicker: {
              entry: lanternModel.assign({ color: "redFlicker" }),
              on: {
                switchSubmode: "redBlueFlicker",
              },
            },
            redBlueFlicker: {
              entry: lanternModel.assign({ color: "redBlueFlicker" }),
              on: {
                switchSubmode: "iridescent",
              },
            },
            iridescent: {
              entry: lanternModel.assign({ color: "iridescent" }),
              on: {
                switchSubmode: "redStatic",
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
});
