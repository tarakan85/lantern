import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    intensity: {
      low: string;
      medium: string;
      high: string;
    };
    colors: {
      red: string;
      blue: string;
    };
    chargeIndicator: string;
    turnedOff: string;
  }

  interface PaletteOptions {
    intensity: {
      low: string;
      medium: string;
      high: string;
    };
    colors: {
      red: string;
      blue: string;
    };
    chargeIndicator: string;
    turnedOff: string;
  }
}
