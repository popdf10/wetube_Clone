const express = require("express");
const app = express();

const PORT = 4000;

function handleListening() {
  console.log(`Listening on: http://localhost:${PORT}`);
}

function handleHome(req, res) {
  console.log(req);
  res.send("Hello from Home!");
}

app.get("/", handleHome);
app.get("/profile", function (req, res) {
  res.send("You are on my profile");
});

app.listen(PORT, handleListening);
