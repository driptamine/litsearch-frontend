import { chatRequest } from 'core/api/chatSession';

const SW_PATH = '/push-sw.js';

const urlBase64ToUint8Array = (base64) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const bytes = window.atob(raw);
  return Uint8Array.from([...bytes].map((ch) => ch.charCodeAt(0)));
};

const vapidKey = async () => {
  const { data } = await chatRequest('/push/vapid-public-key/');
  if (!data?.publicKey) throw new Error('Push is not configured');
  return data.publicKey;
};

export const registerPushServiceWorker = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try {
    return await navigator.serviceWorker.register(SW_PATH);
  } catch (_) {
    return null;
  }
};

// Requests permission (if needed) and subscribes the browser for push.
// Returns 'granted' | 'denied' | 'unsupported' | 'unconfigured'.
export const enablePushNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return 'unsupported';
  if (!window.isSecureContext && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'unsupported';
  }
  let permission = Notification.permission;
  if (permission === 'default') {
    try {
      permission = await Notification.requestPermission();
    } catch (_) {
      return 'denied';
    }
  }
  if (permission !== 'granted') return 'denied';
  try {
    const registration = await navigator.serviceWorker.register(SW_PATH);
    const existing = await registration.pushManager.getSubscription();
    if (existing) return 'granted';
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(await vapidKey()),
    });
    await chatRequest('/push/subscribe/', {
      method: 'post',
      data: { endpoint: subscription.endpoint, keys: subscription.toJSON().keys },
    });
    return 'granted';
  } catch (_) {
    return 'unconfigured';
  }
};
