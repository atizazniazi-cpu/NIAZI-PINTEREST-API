const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("❤️ NIAZI PINTEREST API ONLINE");
});

app.get("/api/pinterest", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url || !/^https?:\/\/(www\.)?(pinterest\.com|pin\.it)\//i.test(url)) {
      return res.status(400).json({
        status: false,
        message: "Valid Pinterest URL required"
      });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) throw new Error("Pinterest page unavailable");

    const html = await response.text();

    const matches = [
      ...html.matchAll(/https?:\\?\/\\?\/[^"'\\\s<>]+?\.mp4(?:\?[^"'\\\s<>]*)?/gi)
    ];

    const video = matches
      .map(x => x[0].replace(/\\u002F/g, "/").replace(/\\\//g, "/").replace(/&amp;/g, "&"))
      .find(x => x.includes("pinimg.com"));

    if (!video) {
      return res.json({
        status: false,
        message: "Video not found. This Pin may require another extraction method."
      });
    }

    res.json({
      status: true,
      creator: "NIAZI-MD",
      video_url: video,
      message: "Video found!"
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
});

app.listen(process.env.PORT || 3000);
