import { createModel } from "xstate/lib/model";

type TModes = "regular" | "colorful";
type TIntensity = "low" | "medium" | "high";
type TColor = "red" | "blue";

export type TContext = {
  isTurnedOn: boolean;
  mode: TModes;
  intensity: TIntensity;
  color: TColor;
  showChargeIndicator: boolean;
  isCharging: boolean;
};

const lanternModel = createModel(
  {
    isTurnedOn: false,
    mode: "regular",
    intensity: "low",
    color: "red",
    showChargeIndicator: false,
    isCharging: false,
  } as TContext,
  {
    events: {
      click: () => ({}),
      longPress: () => ({}),
      doubleClick: () => ({}),
    },
  }
);

export const lanterMachine = lanternModel.createMachine({
  predictableActionArguments: true,
  id: "app",
  context: lanternModel.initialContext,
  initial: "turnedOff",
  states: {
    turnedOff: {
      entry: lanternModel.assign({ isTurnedOn: false }),
      on: {
        longPress: "turnedOn.modeHistory",
      },
      invoke: [{ src: "longPress" }, { src: "turnOnChargingIndicator" }],
    },
    turnedOn: {
      entry: lanternModel.assign({ isTurnedOn: true }),
      on: {
        longPress: "turnedOff",
      },
      invoke: {
        src: "longPress",
      },
      initial: "regular",
      states: {
        regular: {
          initial: "low",
          entry: lanternModel.assign({ mode: "regular" }),
          on: {
            doubleClick: "colorful.colorHistory",
          },
          invoke: {
            src: "doubleClick",
          },
          states: {
            low: {
              entry: lanternModel.assign({ intensity: "low" }),
              on: {
                click: "medium",
              },
              invoke: {
                src: "click",
              },
            },
            medium: {
              entry: lanternModel.assign({ intensity: "medium" }),
              on: {
                click: "high",
              },
              invoke: {
                src: "click",
              },
            },
            high: {
              entry: lanternModel.assign({ intensity: "high" }),
              on: {
                click: "low",
              },
              invoke: {
                src: "click",
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
            doubleClick: "regular.intensityHistory",
          },
          invoke: {
            src: "doubleClick",
          },
          states: {
            red: {
              entry: lanternModel.assign({ color: "red" }),
              on: {
                click: "blue",
              },
              invoke: {
                src: "click",
              },
            },
            blue: {
              entry: lanternModel.assign({ color: "blue" }),
              on: {
                click: "red",
              },
              invoke: {
                src: "click",
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
});
