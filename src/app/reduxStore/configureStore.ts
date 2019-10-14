import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import promiseMiddleware from 'redux-promise';
import { State, reducer, initialState } from './index';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const composeEnhancers = composeWithDevTools({
    // Specify here name, actionsBlacklist, actionsCreators and other options
});

const persistConfig = {
    key: 'root',
    storage
}  
const persistedReducer = persistReducer(persistConfig, reducer);

/*
 * We're giving State interface to create store
 * store is type of State defined in our reducers
 */
const store = createStore<any, any, any, any>(
    persistedReducer, 
    initialState, 
    composeEnhancers(
        applyMiddleware(thunk)
    )
);

let persistor = persistStore(store);

export { store, persistor };