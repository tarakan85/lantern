import { Box, IconButton } from "@mui/material";
import PowerSettingsNewSharpIcon from "@mui/icons-material/PowerSettingsNewSharp";
import PowerSharpIcon from "@mui/icons-material/PowerSharp";
import PowerOffSharpIcon from "@mui/icons-material/PowerOffSharp";
import {
  yellow,
  red,
  lightGreen,
  blue,
  purple,
  green,
} from "@mui/material/colors";
import { isMobile } from "react-device-detect";

import { useLantern } from "~/state/lantern/lantern.hooks";
import { ChargeIndicator } from "~/components/charge-indicator/charge-indicator.component";

import { useRedBlueFlicker, useRedFlicker } from "./lantern.hooks";
import { COLORS } from "./lantern.constants";

export const Lantern = () => {
  const { state, actions } = useLantern();

  const redBlueFlickerColor = useRedBlueFlicker(
    state.isTurnedOn && state.resultMode === "colorfulRedBlueFlicker"
  );

  const redFlickerColor = useRedFlicker(
    state.isTurnedOn && state.resultMode === "colorfulRedFlicker"
  );

  const colorMap: Record<string, string> = {
    regularLow: "intensity.low",
    regularMedium: "intensity.medium",
    regularHigh: "intensity.high",
    colorfulRedStatic: "colors.red",

    colorfulRedFlicker: {
      [COLORS.NONE]: "turnedOff",
      [COLORS.RED]: "colors.red",
    }[redFlickerColor],

    colorfulRedBlueFlicker: {
      [COLORS.NONE]: "turnedOff",
      [COLORS.RED]: "colors.red",
      [COLORS.BLUE]: "colors.blue",
    }[redBlueFlickerColor],
  };

  const color = state.isTurnedOn ? colorMap[state.resultMode] : "turnedOff";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            border: "1px solid",
            borderColor: "grey.300",
            position: "absolute",
            top: "-40px",
            right: "-40px",
          }}
          size="small"
          onClick={() => actions.toggleCharger()}
        >
          {state.isCharging ? (
            <PowerOffSharpIcon sx={{ color: blue[600] }} />
          ) : (
            <PowerSharpIcon sx={{ color: "grey.600" }} />
          )}
        </IconButton>
        <Box
          sx={[
            {
              border: "1px solid",
              borderColor: "grey.700",
              borderRadius: "8px",
              height: "200px",
              width: "164px",
              bgcolor: color,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            },
            state.resultMode === "colorfulIridescent" &&
              state.isTurnedOn && {
                animationName: "backgroundColorPalette",
                animationDuration: "8s",
                animationIterationCount: "infinite",
                animationDirection: "alternate",
                "@keyframes backgroundColorPalette": {
                  "0%": {
                    background: lightGreen["A700"],
                  },
                  "20%": {
                    background: blue[500],
                  },
                  "40%": {
                    background: purple[500],
                  },
                  "60%": {
                    background: red[500],
                  },
                  "80%": {
                    background: yellow[700],
                  },
                  "100%": {
                    background: green[700],
                  },
                },
              },
          ]}
        >
          <ChargeIndicator
            isVisible={state.showChargeIndicator}
            isOnCharge={state.isCharging}
          />
        </Box>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: "8px",
            padding: "20px 60px",
            borderColor: "grey.800",
            bgcolor: "grey.200",
          }}
        >
          <IconButton
            sx={{ bgcolor: "grey.300" }}
            size="large"
            {...(isMobile
              ? { onTouchStart: actions.press, onTouchEnd: actions.release }
              : { onMouseDown: actions.press, onMouseUp: actions.release })}
          >
            <PowerSettingsNewSharpIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
