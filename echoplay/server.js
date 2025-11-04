const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Statische bestanden serveren (bv. uit 'dist' of 'public')
app.use(express.static(path.join(__dirname, "dist"))); // pas 'dist' aan naar jouw map

// SPA fallback: alle andere routes naar index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html")); // pas 'dist' aan indien nodig
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
