// Constants.js https://medium.com/@isphinxs/fetching-automatically-in-development-vs-production-47ecb37fc184
const production = {
  url: 'http://api.litloop.co'
};
const development = {
  url: 'http://localhost:8000'
};
export const config = process.env.NODE_ENV === 'development' ? development : production;
