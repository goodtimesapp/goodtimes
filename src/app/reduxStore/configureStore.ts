import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import promiseMiddleware from 'redux-promise';
import { State, reducer, initialState, sagas } from './index';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage'
import createSagaMiddleware from 'redux-saga';


const composeEnhancers = composeWithDevTools({
    // Specify here name, actionsBlacklist, actionsCreators and other options
});


const persistConfig = {
    key: 'root',
    storage: FilesystemStorage,
    debounce: 500,
    timeout: 10000,
    // debug: true,
    blacklist: ['websockets'] // do not persist websockets because they are references to a JS object, we cannot JSON stringify refs
}  
const persistedReducer = persistReducer(persistConfig, reducer);

const sagaMiddleware = createSagaMiddleware()

/*
 * We're giving State interface to create store
 * store is type of State defined in our reducers
 */
const store = createStore(
    persistedReducer, 
    undefined, 
    composeEnhancers(
        applyMiddleware(thunk),
        applyMiddleware(sagaMiddleware)
    )
);

let persistor = persistStore(store);

sagaMiddleware.run(sagas.postsSaga);

export { store, persistor, sagaMiddleware };