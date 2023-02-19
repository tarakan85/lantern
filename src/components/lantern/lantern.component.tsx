import { Box, IconButton } from "@mui/material";
import PowerSettingsNewSharpIcon from "@mui/icons-material/PowerSettingsNewSharp";
import {
  yellow,
  red,
  lightGreen,
  blue,
  purple,
  green,
} from "@mui/material/colors";

import { useRedBlueFlicker, useRedFlicker } from "./hooks";
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
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          sx={[
            {
              border: "1px solid",
              borderColor: "grey.700",
              borderRadius: "8px",
              padding: "90px 80px",
              bgcolor: color,
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
        />
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
