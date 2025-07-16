import { configureStore } from "@reduxjs/toolkit";
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from "react-redux"
import {persistStore, persistReducer } from "redux-persist";
import { rootPersistConfig, rootReducer } from "./rootReducer"

const store = configureStore({
    reducer : persistReducer(rootPersistConfig, rootReducer),
    middleware : (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck : false,
    })
})

const persistor = persistStore(store);

const {dispatch} =store;
const useSelector = useAppSelector;

const useDispatch = ()=>useAppDispatch();

export {store,persistor,dispatch,useSelector,useDispatch};

// // // store.js
// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore } from 'redux-persist';
// import { persistedReducer } from './rootReducer';
// import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//       immutableCheck: false,
//     }),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// const persistor = persistStore(store);

// // Types (optional but recommended)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// // Custom hooks for use throughout app
// const useAppDispatch: () => AppDispatch = useDispatch;
// const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export { store, persistor, useAppDispatch, useAppSelector };
