import range from "lodash/range";
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
  indigo,
} from "@mui/material/colors";

import {
  useRedBlueFlicker,
  useRedFlicker,
  useChargingIndicatorFlicker,
} from "./hooks";
import { useLantern } from "~/state/lantern/lantern.hooks";
import { capitalizeFirst } from "~/utils/string";

export const Lantern = () => {
  const lantern = useLantern();

  const activeMode = lantern.state.mode;
  const activeSubmode = {
    regular: lantern.state.intensity,
    colorful: lantern.state.color,
  }[lantern.state.mode];

  const modesCombo = activeMode.concat(capitalizeFirst(activeSubmode));

  const redBlueFlickerColor = useRedBlueFlicker(
    modesCombo === "colorfulRedBlueFlicker"
  );

  const redFlickerColor = useRedFlicker(modesCombo === "colorfulRedFlicker");

  const chargingIndicatorFlickerColor = useChargingIndicatorFlicker(
    lantern.state.isCharging
  );

  const colorMap: Record<string, string> = {
    regularLow: yellow[100],
    regularMedium: yellow[300],
    regularHigh: yellow[500],
    colorfulRedStatic: red[500],
    colorfulRedFlicker: redFlickerColor,
    colorfulRedBlueFlicker: redBlueFlickerColor,
  };

  const color = lantern.state.isTurnedOn ? colorMap[modesCombo] : "grey.50";

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
          onClick={() => lantern.sendToggleCharger()}
        >
          {lantern.state.isCharging ? (
            <PowerOffSharpIcon sx={{ color: "grey.600" }} />
          ) : (
            <PowerSharpIcon sx={{ color: blue[600] }} />
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
            modesCombo === "colorfulIridescent" && {
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
          {lantern.state.showChargeIndicator && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  bgcolor: lantern.state.isCharging
                    ? chargingIndicatorFlickerColor
                    : indigo[500],
                  borderRadius: "50%",
                  padding: "6px",
                  margin: "4px",
                }}
              />
              {range(3).map(() => (
                <Box
                  sx={{
                    bgcolor: indigo[500],
                    borderRadius: "50%",
                    padding: "6px",
                    margin: "4px",
                  }}
                />
              ))}
            </Box>
          )}
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
            onMouseDown={lantern.sendPress}
            onMouseUp={lantern.sendRelease}
          >
            <PowerSettingsNewSharpIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
