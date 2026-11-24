interface OAuthConfig {
  CLIENT_ID: string;
  OAUTH_REDIRECT_URI: string;
  OAUTH_LOGIN_ENPOINT: string;
}

interface ApiUtil {
  formQueryString: (params: Map<string, string>) => string;
}

interface OAuthHash {
  type: string;
  access_token?: string;
  message?: string;
}

interface OAuthServiceConfig {
  config: OAuthConfig;
  apiUtil: ApiUtil;
}

const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 426;
const ACCESS_TOKEN_SWIGGY_AZURE_EVENT = 'ACCESS_TOKEN_SWIGGY_AZURE_EVENT';

export class OAuthService {
  config: OAuthConfig;

  constructor(config: OAuthConfig, private apiUtil: ApiUtil) {
    this.config = config;
  }

  makeAuthUrl(): string {
    const queryParams = this.apiUtil.formQueryString(
      new Map([
        ['client_id', this.config.CLIENT_ID],
        [
          'redirect_uri',
          `${window.location.origin}${this.config.OAUTH_REDIRECT_URI}`
        ],
        ['response_type', 'token id_token'],
        ['scope', 'openid email profile'],
        [
          'nonce',
          Math.random()
            .toString(36)
            .substring(7)
        ]
      ])
    );
    return `${this.config.OAUTH_LOGIN_ENPOINT}/authorize?${queryParams}`;
  }

  launchPopup(): void {
    const left = window.screen.width / 2 - POPUP_WIDTH / 2;
    const top = window.screen.height / 2 - POPUP_HEIGHT / 2;

    const win = window.open(
      this.makeAuthUrl(),
      'Swiggy Login',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
        POPUP_WIDTH +
        ', height=' +
        POPUP_HEIGHT +
        ', top=' +
        top +
        ', left=' +
        left
    );
    if (win) win.opener = window;
  }

  redirectToLogin(): void {
    window.location.href = this.makeAuthUrl();
  }

  listenToMessageEvent(resolve: (token: string) => void, reject: (message: string) => void): void {
    const windowEventHandler = (event: MessageEvent) => {
      let hash = event.data as OAuthHash;
      console.log(hash);
      if (hash.type === ACCESS_TOKEN_SWIGGY_AZURE_EVENT) {
        const token = hash.access_token;
        resolve(token);
      } else if (hash.type == 'error') {
        console.error(hash.message);
        reject(hash.message);
      }
      window.removeEventListener('message', windowEventHandler);
    };

    window.addEventListener('message', windowEventHandler, false);
  }

  findTokenInHash(hash: string): string | null {
    const matchedResult = hash.match(/access_token=([^&]+)/);
    return matchedResult && matchedResult[1];
  }

  processToken(token: string, callbackFn: (token: string) => void): void {
    if (!window.opener) {
      token && callbackFn(token);
      return;
    }
    if (!token) {
      window.opener.postMessage(
        {
          type: 'error',
          message: 'No Access Token Found.'
        },
        window.location.origin
      );
      window.close();
      return;
    }

    window.opener.postMessage(
      {
        type: ACCESS_TOKEN_SWIGGY_AZURE_EVENT,
        access_token: token
      },
      window.location.origin
    );
    window.close();
  }
}

const config: OAuthConfig = {
  CLIENT_ID: '',
  OAUTH_REDIRECT_URI: '',
  OAUTH_LOGIN_ENPOINT: '',
};

const apiUtil: ApiUtil = {
  formQueryString: (params: Map<string, string>) => {
    const queryParams = [];
    for (const [key, value] of params.entries()) {
      queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
    return queryParams.join('&');
  }
};

export default new OAuthService(config, apiUtil);