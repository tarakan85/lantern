import range from "lodash/range";
import { Box } from "@mui/material";

import { useChargingIndicatorFlicker } from "./charge-indicator.hooks";
import { COLORS } from "./charge-indicator.constants";

export type TChargingIndicatorProps = {
  isVisible: boolean;
  isOnCharge: boolean;
};

export const ChargeIndicator: React.FC<TChargingIndicatorProps> = ({
  isVisible,
  isOnCharge,
}) => {
  const flickeringColor = useChargingIndicatorFlicker(isOnCharge);

  const flickeringResultColor = {
    [COLORS.NONE]: "transparent",
    [COLORS.BLUE]: "chargeIndicator",
  }[flickeringColor];

  return (
    <Box
      sx={[
        { display: "flex", justifyContent: "center", visibility: "hidden" },
        isVisible && { visibility: "visible" },
      ]}
    >
      <Box
        sx={{
          bgcolor: isOnCharge ? flickeringResultColor : "chargeIndicator",
          borderRadius: "50%",
          padding: "6px",
          margin: "4px",
        }}
      />
      {range(3).map((index) => (
        <Box
          key={index}
          sx={{
            bgcolor: "chargeIndicator",
            borderRadius: "50%",
            padding: "6px",
            margin: "4px",
          }}
        />
      ))}
    </Box>
  );
};
