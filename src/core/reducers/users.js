import { createSlice } from '@reduxjs/toolkit';
import * as actions from 'core/actions';
import { REHYDRATE } from 'redux-persist/lib/constants';

const initialState = {
  accounts: [], // Array of user objects
  activeAccountId: null,
  isAuthorized: false,
  access_token: null,
  isFetching: {
    token: false,
  },
  google_oauth: {
    service: null,
    access_token: null,
    profileImg: null,
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    switchAccount: (state, action) => {
      const accountId = action.payload;
      const account = state.accounts.find(a => a.id === accountId);
      if (account) {
        state.activeAccountId = accountId;
        // Merge account data into root for compatibility if needed
        Object.assign(state, account);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(REHYDRATE, (state, action) => {
        return { ...state, ...action.payload };
      })
      .addCase("setToken/fetch", (state, action) => {
        const response = action.payload;
        const token = response.access_token || response.response?.access_token || response.token;
        return { ...state, ...response, access_token: token };
      })
      .addCase("token/get", (state, action) => {
        return { ...state, ...action.payload };
      })
      .addCase(actions.fetchLogout, (state, action) => {
        return { ...state, ...action.payload };
      })
      .addCase('USER_LOGGEDOUT', () => {
        return initialState;
      })
      .addCase("user/setUserProfile", (state, action) => {
        const userData = action.payload;
        if (!userData) return;

        // Merge userData into root state
        Object.assign(state, userData);

        const getBestAvatar = (data) => {
          return data.avatar || 
                 data.user?.avatar || 
                 data.profile_img || 
                 data.avatar_url || 
                 data.user?.profileImg || 
                 data.user?.profile_img || 
                 data.user?.avatar_url;
        };

        // Explicitly set djangoAvatar
        const newDjangoAvatar = getBestAvatar(userData);
        if (newDjangoAvatar) {
          state.djangoAvatar = newDjangoAvatar;
          state.profileImg = newDjangoAvatar;
        }

        // Also update the active account in the accounts array
        const currentUserId = userData.id || userData.userId || userData.pk || state.activeAccountId;
        if (currentUserId) {
          const accountIdx = state.accounts.findIndex(a => String(a.id) === String(currentUserId));
          if (accountIdx > -1) {
            state.accounts[accountIdx] = { ...state.accounts[accountIdx], ...userData };
          }
        }
      })
      .addCase("login/fetch/requested", (state) => {
        state.isFetching.token = true;
      })
      .addCase("login/fetch/succeeded", (state, action) => {
        const response = action.payload;
        state.isFetching.token = false;
        state.isAuthorized = true;
        state.access_token = response.response?.access_token || response.response?.token;
        Object.assign(state, response.response);
      })
      .addCase("login/fetch/failed", (state) => {
        state.isFetching.token = false;
      })
      .addCase("signup/fetch/succeeded", (state, action) => {
        const response = action.payload;
        state.isAuthorized = true;
        state.access_token = response.response?.access_token || response.response?.token;
        Object.assign(state, response.response);
      })
      .addCase("user/fetchCurrentUser/succeeded", (state, action) => {
        const response = action.payload;
        const userData = response.response?.entities?.users?.[Object.keys(response.response?.entities?.users || {})[0]] || response.response;
        
        const currentUserId = userData.id || userData.userId || state.activeAccountId || `user_${Date.now()}`;
        
        const updatedAccount = {
          id: currentUserId,
          ...userData
        };

        const accountIdx = state.accounts.findIndex(a => a.id === currentUserId);
        if (accountIdx > -1) {
          state.accounts[accountIdx] = { ...state.accounts[accountIdx], ...updatedAccount };
        } else {
          state.accounts.push(updatedAccount);
        }

        state.activeAccountId = currentUserId;
        state.username = updatedAccount.username;
        
        // Merge userData into root state
        Object.assign(state, userData);

        const getBestAvatar = (data) => {
          return data.avatar || 
                 data.user?.avatar || 
                 data.profile_img || 
                 data.avatar_url || 
                 data.user?.profileImg || 
                 data.user?.profile_img || 
                 data.user?.avatar_url;
        };

        // Explicitly set djangoAvatar
        state.djangoAvatar = getBestAvatar(userData);
        
        // Update profileImg ONLY if djangoAvatar is present
        if (state.djangoAvatar) {
          state.profileImg = state.djangoAvatar;
        }
      })
      .addCase("user/oauth/setUserProfile", (state, action) => {
        const response = action.payload;
        const { service = 'oauth' } = response;
        const userId = response.userId || response.id || `user_${Date.now()}`;
        
        const oauthData = { oauthed: true, ...response };
        const newAccount = {
          id: userId,
          username: response.username,
          profileImg: response.profileImg,
          [service]: oauthData,
          ...response
        };

        const existingAccountIndex = state.accounts.findIndex(a => a.id === userId);
        if (existingAccountIndex > -1) {
          state.accounts[existingAccountIndex] = { ...state.accounts[existingAccountIndex], ...newAccount };
        } else {
          state.accounts.push(newAccount);
        }

        state.activeAccountId = userId;
        state.username = newAccount.username;
        state.profileImg = newAccount.profileImg;
        state[service] = oauthData;
        Object.assign(state, response);
      })
      .addCase('user/SE_ACCESS_TOKEN', (state, action) => {
        const { scope, ...others } = action.payload;
        state.isAuthorized = true;
        state.token = {
          ...others,
          user_scope: scope.split(' '),
        };
      });
  },
});

export default usersSlice.reducer;

export const selectors = {
  selectAuthUser: state => state.accounts && state.accounts.length > 0 ? state.accounts.find(a => a.id === state.activeAccountId) || state.accounts[0] : state,
  selectisSignedIn: state => !!state.access_token || !!state.isAuthorized,
  selectAsyncInfoAuthState: state => state.isFetching,
  selectIsFetchingToken: state => state.isFetching.token,
};
