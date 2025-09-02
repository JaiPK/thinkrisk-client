import { configureStore, combineReducers } from "@reduxjs/toolkit";
import toggleSideNavSlice from "../features/ui/header/toggleSideNavSlice";
import toggleSideNavReducer from "../features/ui/header/toggleSideNavSlice";
import dateSlice from "../features/modules/dashboard/generalLedger/dateSlice";
import GLFilterConfigSlice from "../features/modules/dashboard/generalLedger/state/GLFilterConfigSlice";
import APFilterConfigSlice from "../features/modules/dashboard/accountsPayable/state/APFilterConfigSlice";
import GLTransDetailsDrillThroughSlice from "../features/modules/dashboard/generalLedger/state/GLTransDetailsDrillThroughSlice";
import APTransDetailsDrillThroughSlice from "../features/modules/dashboard/accountsPayable/state/APTransDetailsDrillThroughSlice";
import GLDataSlice from "../features/modules/gl-slice/GLSlice";
import APDataSlice from "../features/modules/ap-slice/APSlice";
import APPDataSlice from "../features/modules/app-slice/app-slice";
import Rbac from "../features/modules/Rbac/Rbac";


import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
  } from "redux-persist";

 
const persistConfig = {
  key: 'root',
  storage,
}
 
const rootReducer = combineReducers({
    toggleSideNav: toggleSideNavSlice,
    GLPostedDateRange: dateSlice,
    GLFilterConfig: GLFilterConfigSlice,
    GLTransDetailsDrillThrough: GLTransDetailsDrillThroughSlice,
    APFilterConfig: APFilterConfigSlice,
    APTransDetailsDrillThrough: APTransDetailsDrillThroughSlice,
    GLDataSlice: GLDataSlice,
    APDataSlice: APDataSlice,
    APPDataSlice: APPDataSlice,
    Rbac:Rbac
});

const persistedReducer = persistReducer(persistConfig, rootReducer)
 



export type RootState = ReturnType<typeof rootReducer>;


export const Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    ,}),
});
export type AppDispatch = typeof Store.dispatch
