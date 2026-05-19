import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: CORS Proxy for Monitoring
  app.post("/api/check-url", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      console.log(`Checking URL: ${url}`);
      const response = await fetch(url, { 
        method: "HEAD",
        timeout: 10000 
      });

      const data = {
        status: response.status,
        lastModified: response.headers.get("last-modified"),
        etag: response.headers.get("etag"),
        contentLength: response.headers.get("content-length"),
        contentType: response.headers.get("content-type"),
        checkedAt: new Date().toISOString(),
      };

      res.json(data);
    } catch (error: any) {
      console.error("Fetch Error:", error.message);
      res.status(500).json({ error: "Failed to fetch metadata", message: error.message });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
