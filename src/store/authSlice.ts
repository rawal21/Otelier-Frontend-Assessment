import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: 'admin' | 'user';
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  role: 'user',
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.role = action.payload?.email?.endsWith('@luxstay.com') ? 'admin' : 'user';
      state.loading = false;
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      if (action.payload) {
        state.user = action.payload.user;
        state.role = action.payload.user.email?.endsWith('@luxstay.com') ? 'admin' : 'user';
      }
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.loading = false;
    },
  },
});

export const { setUser, setSession, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
