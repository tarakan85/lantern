import React from "react";
import { Button, Box } from "@mui/material";

import { useRedBlueFlicker } from "./hooks";
import { useLantern } from "~/state/lantern/lantern.hooks";

export const Lantern = () => {
  const lantern = useLantern();
  const [doFlicker, setDoFlicker] = React.useState(false);
  const redBlueColor = useRedBlueFlicker(doFlicker);
  return (
    <div>
      <div>
        <Button onMouseDown={lantern.sendPress} onMouseUp={lantern.sendRelease}>
          Tap
        </Button>
        <Button onClick={lantern.sendToggleCharger}>Toggle charger</Button>
      </div>
      <Box component="code" sx={{ maxWidth: 400, display: "block" }}>
        {JSON.stringify(lantern.state, undefined, 2)}
      </Box>
      <div>
        <Button onClick={() => setDoFlicker(true)}>start flicker</Button>
        <Button onClick={() => setDoFlicker(false)}>stop flicker</Button>
      </div>
      <Box component="code" sx={{ maxWidth: 400, display: "block" }}>
        {JSON.stringify({ redBlueColor }, undefined, 2)}
      </Box>
    </div>
  );
};
