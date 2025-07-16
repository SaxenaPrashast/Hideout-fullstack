// ✅ Correct
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

const rootPersistConfig = {
    key:"root",
    storage,
    keyPrefix : 'redux-',
};

const rootReducer = combineReducers({
    //TODO => Create and Map reducer
});

export {  rootPersistConfig, rootReducer};

// // rootReducer.js
// import { combineReducers } from '@reduxjs/toolkit';
// import storage from 'redux-persist/lib/storage';
// import { persistReducer } from 'redux-persist';

// // Example: Import your reducers here
// // import authReducer from './slices/authSlice';
// // import userReducer from './slices/userSlice';

// const rootReducer = combineReducers({
//   // Add your reducers here
//   // auth: authReducer,
//   // user: userReducer,
// });

// const rootPersistConfig = {
//   key: 'root',
//   storage,
//   version: 1, // optional: helps with migrations
//   whitelist: [], // add keys of slices to persist
// };

// const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

// export { rootReducer, rootPersistConfig, persistedReducer };
