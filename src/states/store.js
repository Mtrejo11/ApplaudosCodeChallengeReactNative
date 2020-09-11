import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

//reducers
import classificationReducer from './reducers/classification'

console.log('CLASSIFICATION', classificationReducer);


//persist config
const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: []
}
const classificationPersistConfig = {
    key: 'classification',
    storage: AsyncStorage,
    blacklist: [],
}

//combine reducers
const rootReducer = combineReducers({
    classification: persistReducer(classificationPersistConfig, classificationReducer),
});

// create store and persist reducers
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };