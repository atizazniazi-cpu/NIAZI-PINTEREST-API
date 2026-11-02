
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: true,
    name: "NIAZI-MD PINTEREST API",
    message: "API ONLINE ❤️",
    creator: "NIAZI-MD"
  });
});

app.get("/api/pinterest", async (req, res) => {
  try {
    const pinUrl = req.query.url;

    if (!pinUrl) {
      return res.status(400).json({
        status: false,
        message: "Pinterest URL required"
      });
    }

    const parsed = new URL(pinUrl);

    if (
      !["pinterest.com", "www.pinterest.com", "pin.it"].includes(parsed.hostname)
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid Pinterest URL"
      });
    }

    const page = await fetch(pinUrl, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36",
        "Accept": "text/html"
      },
      signal: AbortSignal.timeout(20000)
    });

    if (!page.ok) {
      throw new Error("Pinterest page could not be opened");
    }

    const html = await page.text();

    const patterns = [
      /https?:\\?\/\\?\/[^"'\\\s<>]+?\.mp4[^"'\\\s<>]*/gi,
      /"contentUrl"\s*:\s*"([^"]+)"/gi
    ];

    let videoUrl = null;

    for (const pattern of patterns) {
      const matches = [...html.matchAll(pattern)];

      for (const match of matches) {
        let candidate = match[1] || match[0];

        candidate = candidate
          .replace(/\\u002F/g, "/")
          .replace(/\\\//g, "/")
          .replace(/&amp;/g, "&")
          .replace(/\\u003D/g, "=");

        try {
          candidate = new URL(candidate).href;
          if (
            new URL(candidate).hostname.endsWith("pinimg.com") &&
            candidate.includes(".mp4")
          ) {
            videoUrl = candidate;
            break;
          }
        } catch {}
      }

      if (videoUrl) break;
    }

    if (!videoUrl) {
      return res.status(404).json({
        status: false,
        message: "Video not found. Pinterest may require another extraction method."
      });
    }

    res.json({
      status: true,
      creator: "NIAZI-MD",
      title: "Pinterest Video",
      video_url: videoUrl,
      download_url: videoUrl
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      creator: "NIAZI-MD",
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log("NIAZI PINTEREST API RUNNING ON " + PORT);
});
