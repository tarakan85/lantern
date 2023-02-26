import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";

import { Lantern } from "~/components/lantern/lantern.component";
import { store } from "~/state/root/root.store";

export const App = () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Lantern />
    </Provider>
  );
};
