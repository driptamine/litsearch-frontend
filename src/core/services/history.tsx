import { createBrowserHistory } from 'history';

const history = createBrowserHistory({
  basename: import.meta.env.BASE_URL
});

export default history;
