import express from 'express';
import fs from 'fs';
import path from 'path';
import { render } from './entry-server';

const app = express();

app.use(express.static(path.resolve(__dirname, 'dist/client')));

app.get('*', async (req, res) => {
  const context = {};
  const { appHtml, preloadedState } = await render(req.url, context);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>My App</title></head>
    <body>
      <div id="root">${appHtml}</div>
      <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
      </script>
      <script src="/client/entry-client.js"></script>
    </body>
    </html>
  `;

  res.send(html);
});

app.listen(3000);
