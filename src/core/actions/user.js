import { createAction } from '@reduxjs/toolkit';

export const fetchAuthUser = createAction(
  "login/fetch",
  (data) => ({
    payload: {
      email: data.email,
      password: data.password
    }
  })
);

export const fetchCurrentUser = createAction(
  "user/fetchCurrentUser"
);

export const setUserProfile = createAction(
  "user/setUserProfile",
  (payload) => ({
    payload
  })
);

// window.opener.postmessage
export const fetchOAuthUser = createAction(
  "user/oauth/setUserProfile",
  (payload) => ({
    ...payload
  })
);

export const fetchUserLoggedOut = createAction(
  "USER_LOGGEDOUT",
  () => ({

  })
)

export const fetchSignUpUser = createAction(
  "signup/fetch",
  (data) => ({
    payload: {
      email: data.email,
      password: data.password
    }
  })
)

export const updateUserAction = createAction(
  "user/update",
  (data) => ({
    payload: data
  })
)

export const changePasswordAction = createAction(
  "user/changePassword",
  (data) => ({
    payload: {
      old_password: data.oldPassword,
      new_password: data.newPassword
    }
  })
)

export const getProfile = createAction(
  'user/GE_USER_PROFILE',
  () => ({

  })
)

export const uploadAvatarAction = createAction(
  'user/uploadAvatar',
  (formData) => ({
    payload: formData
  })
);
