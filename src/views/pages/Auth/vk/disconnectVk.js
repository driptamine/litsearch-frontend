import { RemoveCookie } from 'views/utils';
import API from '../navigation/API';

const disconnectVk = async ({ setVkToken, setEnableVk }) => {
  RemoveCookie('Vk-access_token');
  RemoveCookie('Vk-refresh_token');
  RemoveCookie('Vk-username');
  RemoveCookie('Vk-profileImg');
  RemoveCookie('Vk-email');
  RemoveCookie('Vk-userId');
  RemoveCookie('Vk-myState');

  setVkToken();
  setEnableVk(false);

  await API.deleteVkToken();
};

export default disconnectVk;
