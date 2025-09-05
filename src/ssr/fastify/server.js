import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify();

import App from './src/App.jsx';

// Dummy data fetching functions
const getPost = async (postId) => ({
  id: postId,
  title: `This is the title of post ${postId}`
});

const getTrack = async (trackId) => ({
  id: trackId,
  name: `Track ${trackId} name`
});

// Serve static assets
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'dist'),
  prefix: '/'
});

// Home route
fastify.get('/', async (request, reply) => {
  const appHtml = ReactDOMServer.renderToString(React.createElement(App, { route: 'home' }));
  const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
  const html = template.replace('<div id="root"><!-- SSR content goes here --></div>', `<div id="root">${appHtml}</div>`);
  reply.type('text/html').send(html);
});

// Post route
fastify.get('/post/:postId', async (request, reply) => {
  const { postId } = request.params;
  const postData = await getPost(postId);

  const appHtml = ReactDOMServer.renderToString(
    React.createElement(App, { route: 'post', params: { postId }, data: postData })
  );

  const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
  const html = template.replace(
    '<div id="root"><!-- SSR content goes here --></div>',
    `<div id="root">${appHtml}</div>`
  );

  reply.type('text/html').send(html);
});

// Track route
fastify.get('/track/:trackId', async (request, reply) => {
  const { trackId } = request.params;
  const trackData = await getTrack(trackId);

  const appHtml = ReactDOMServer.renderToString(
    React.createElement(App, { route: 'track', params: { trackId }, data: trackData })
  );

  const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
  const html = template.replace(
    '<div id="root"><!-- SSR content goes here --></div>',
    `<div id="root">${appHtml}</div>`
  );

  reply.type('text/html').send(html);
});

// Start server
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
