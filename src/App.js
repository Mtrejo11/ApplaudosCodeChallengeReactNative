import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./states/store";
import DrawerNavigationMenu from "./navigation/drawer";


export default App = () => {
  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
      >
        <DrawerNavigationMenu />
      </PersistGate>
    </Provider>
  );
}