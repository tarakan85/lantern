import range from "lodash/range";
import { Box } from "@mui/material";
import { indigo } from "@mui/material/colors";

import { useChargingIndicatorFlicker } from "./charge-indicator.hooks";

export type TChargingIndicatorProps = {
  isVisible: boolean;
  isOnCharge: boolean;
};

export const ChargeIndicator: React.FC<TChargingIndicatorProps> = ({
  isVisible,
  isOnCharge,
}) => {
  const flickeringColor = useChargingIndicatorFlicker(isOnCharge);

  return (
    <Box
      sx={[
        { display: "flex", justifyContent: "center", visibility: "hidden" },
        isVisible && { visibility: "visible" },
      ]}
    >
      <Box
        sx={{
          bgcolor: isOnCharge ? flickeringColor : indigo[500],

          borderRadius: "50%",
          padding: "6px",
          margin: "4px",
        }}
      />
      {range(3).map((index) => (
        <Box
          key={index}
          sx={{
            bgcolor: indigo[500],
            borderRadius: "50%",
            padding: "6px",
            margin: "4px",
          }}
        />
      ))}
    </Box>
  );
};
