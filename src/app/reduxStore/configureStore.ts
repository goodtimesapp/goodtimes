import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import promiseMiddleware from 'redux-promise';
import { State, reducer, initialState } from './index';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage'


const composeEnhancers = composeWithDevTools({
    // Specify here name, actionsBlacklist, actionsCreators and other options
});


const persistConfig = {
    key: 'root',
    storage: FilesystemStorage,
    debug: true,
    blacklist: ['websockets'] // do not persist websockets because they are references to a JS object, we cannot JSON stringify refs
}  
const persistedReducer = persistReducer(persistConfig, reducer);

/*
 * We're giving State interface to create store
 * store is type of State defined in our reducers
 */
const store = createStore(
    persistedReducer, 
    undefined, 
    composeEnhancers(
        applyMiddleware(thunk)
    )
);

let persistor = persistStore(store);

export { store, persistor };