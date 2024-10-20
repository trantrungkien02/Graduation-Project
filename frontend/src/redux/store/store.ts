import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../stateglobal/authSlice';
import userReducer from '../stateglobal/userSlice';
import courseReducer from '../stateglobal/courseSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import sidebarReducer from '~/redux/stateglobal/openSidebar';
import modalReducer from '~/redux/stateglobal/openAddCompany';
import hasCompanyReducer from '~/redux/stateglobal/isHasCompany';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};
const rootReducer = combineReducers({
    auth: authReducer,
    users: userReducer,
    course: courseReducer,
    modal: modalReducer,
    sidebar: sidebarReducer,
    hascompany: hasCompanyReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export let persistor = persistStore(store);
