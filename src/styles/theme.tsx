import { createTheme } from "@mui/material";
import * as colors from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    intensity: {
      low: colors.yellow[100],
      medium: colors.yellow[300],
      high: colors.yellow[500],
    },
    colors: {
      red: colors.red[500],
      blue: colors.blue[500],
    },
    chargeIndicator: colors.indigo[500],
    turnedOff: colors.grey[50],
  },
});
