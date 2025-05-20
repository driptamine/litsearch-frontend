// https://dev.vk.com/api/api-requests
const VKontakteBaseAuthUrl = `https://oauth.vk.com/authorize?
  client_id=${import.meta.env.REACT_APP_TWITCH_CLIENT_ID}&
  redirect_uri=http://localhost:3000/auth/vk/callback&
  scope=user:read:follows+clips:edit&
  response_type=code`;

const vk_wall_posts_by_api = `https://api.vk.com/method/wall.get?
  owner_id=-45172096&
  fields=bdate&
  access_token=vk1.a.BmjU_yauxAySM4Ufno-ntQmKgIKa-eoB2pfekbC2afxdZ6TTwCnRsLgreysEDnYWC3ZlYHhr6eJGhfUjob8YgZXl5LSz7DqdkDMNPqrf7WF9Vu75iBzbS5Ol4YfTAl-a-n5fsGfuyKG2JYo0gjCs4WWsPPzAkfstqgxp-R2svwIwDjfnWhquVqS1B2usysVM&
  v=5.131
`;
