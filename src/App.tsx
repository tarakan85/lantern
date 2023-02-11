import * as React from "react";
import { Button, Box } from "@mui/material";

import { useLantern } from "~/state/lantern/lantern.hooks";

export const App = () => {
  const lantern = useLantern();
  return (
    <div>
      <div>
        <Button
          onMouseDown={lantern.sendPress}
          onMouseUp={lantern.sendRelease}
          onMouseLeave={lantern.sendRelease}
        >
          Tap
        </Button>
      </div>
      <Box component="code" sx={{ maxWidth: 400, display: "block" }}>
        {JSON.stringify(lantern.state, undefined, 2)}
      </Box>
    </div>
  );
};
