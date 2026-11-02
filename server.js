const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("NIAZI PINTEREST API ONLINE ❤️");
});

app.get("/api/pinterest", (req, res) => {
  const url = req.query.url;

  if (!url || !url.includes("pinterest.com")) {
    return res.status(400).json({
      status: false,
      message: "Valid Pinterest URL required"
    });
  }

  res.json({
    status: false,
    message: "Video extraction engine not configured yet"
  });
});

app.listen(process.env.PORT || 3000);
