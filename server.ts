import express from "express";
import path from "path";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import { app } from "./api.js";

const PORT = 3000;

// Handle serving the frontend React application
async function setupViteAndAssets() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

const isMainFile = process.argv[1] && (
  process.argv[1].includes("server.ts") ||
  process.argv[1].includes("server.js") ||
  process.argv[1].includes("server.cjs")
);

if (isMainFile) {
  setupViteAndAssets();
}

export { runLocalFallback, checkOutOfScope, normalizeText } from "./api.js";
