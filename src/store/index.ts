import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from './authSlice';
import hotelReducer from './hotelSlice';
import { hotelApi } from './api/hotelApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelReducer,
    [hotelApi.reducerPath]: hotelApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types as they may contain non-serializable types like Dates or Supabase sessions
        ignoredActions: [
          'auth/setSession',
          'auth/setUser',
          'auth/logout',
          'hotels/setSearchParams'
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'hotels.searchParams.checkIn',
          'hotels.searchParams.checkOut',
          'auth.session',
          'auth.user',
          'hotelApi' // Ignore the entire RTK Query state path as it stores query arguments (Dates)
        ],
      },
    }).concat(hotelApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
