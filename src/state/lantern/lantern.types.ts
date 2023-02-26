import * as selectors from "./lantern.selectors";

export type TModes = "regular" | "colorful";
export type TIntensity = "low" | "medium" | "high";
export type TColor =
  | "iridescent"
  | "redStatic"
  | "redFlicker"
  | "redBlueFlicker";

export type TState = {
  isTurnedOn: boolean;
  modes: TModes[];
  modeIndex: number;
  submodes: {
    regular: TIntensity[];
    colorful: TColor[];
  };
  submodeIndexes: {
    regular: number;
    colorful: number;
  };
  showChargeIndicator: boolean;
  isCharging: boolean;
};

export type TResultMode = ReturnType<typeof selectors.selectResultMode>;
