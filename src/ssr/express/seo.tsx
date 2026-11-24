// server.js
import express from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./src/App.jsx"; // Your React root

const app = express();

// Serve static assets (CSR pages + client bundle)
app.use(express.static(path.resolve(__dirname, "dist")));

// SSR route example
app.get(["/post/:postId", "/track/:trackId", "/:username"], (req, res) => {
  const html = ReactDOMServer.renderToString(<App url={req.url} />);

  const template = fs.readFileSync(
    path.resolve(__dirname, "dist/index.html"),
    "utf8"
  );

  const finalHtml = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  res.send(finalHtml);
});

// Fallback CSR for other routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist/index.html"));
});

app.listen(3000, () => console.log("Server running on port 3000"));
