const express = require("express");
const router = express.Router();
const player = require("./models/player");
const saf = require("./steamapi.js");

router.get("/userID", (req, res, next) => {
  player
    .getUserID(req.body.link)
    .then(userid => {
      req.body.userID = userid;
      next();
    })
    .catch(err => res.send(err));
});

router.get("/userID", async (req, res, next) => {
  await player
    .findPlayerAndStore(req.body.userID)
    .then(user => {
      req.body.user = user;
      next();
    })
    .catch(err => res.send(err));
});

router.get("/userID", (req, res) => {
  player
    .addTagsToPlayer(req.body.user)
    .then(completedUser => res.send(completedUser))
    .catch(err => res.send(err));
});

router.get("/userGames", (req, res) => {
  player
    .findPlayer(req.body.userID)
    .then(doc => res.send(doc))
    .catch(err => res.status(404).send(err));
});

router.get("/all", (req, res) => {
  let promise = player.findAll();
  promise.exec((err, doc) => {
    if (err | !doc) res.status(404).send("not found");
    res.send(doc);
  });
});

router.get("/", (req, res) => {
  player
    .findPlayer(req.body.userID)
    .then(user => res.send(user))
    .catch(err => res.send(err));
});

router.get("/", (req, res) => {
  player.findPlayer(req.body.userID).exec((err, doc) => {
    if (err | !doc) res.status(404).send("not found");
    res.send(doc);
  });
});

router.delete("/", (req, res) => {
  player.deletePlayer(req.body.userID).exec((err, doc) => {
    if (err) res.status(400).send(err);
    res.send(doc);
  });
});

module.exports = router;
