import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { Lantern } from "~/components/lantern/lantern.component";
import { store, persistor } from "~/state/root/root.store";
import { Styles } from "./styles/styles.component";

export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor as any} loading={null}>
        <Styles>
          <Lantern />
        </Styles>
      </PersistGate>
    </Provider>
  );
};
