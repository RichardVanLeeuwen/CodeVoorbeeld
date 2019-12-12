const path = require("path");
const express = require("express");
const gameRouter = require("./gameRoutes");
const playerRouter = require("./playerRoutes");
const fs = require("fs");
const history = require("connect-history-api-fallback");
const db = require("./database.js");
const cors = require("cors");

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/games", gameRouter);
app.use("/api/players", playerRouter);

app.use(history);
app.use(express.static("./public"));

//404 error handling
app.use((req, res) => {
  fs.readFile(
    path.join(__dirname, "public", req.originalUrl + ".html"),
    (err, content) => {
      if (err) {
        res.status(404).send("404, file not found.");
      } else {
        res.end(content, "utf8");
      }
    }
  );
});

db.connect();

app.listen(PORT, () => console.log(`app started on port ${PORT}`));
