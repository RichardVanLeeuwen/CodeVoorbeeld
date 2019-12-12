const mongoose = require("mongoose");
const game = require("./game");
const saf = require("../steamapi.js");

const playerSchema = new mongoose.Schema({
  userID: {
    type: String,
    unique: true,
    dropDups: true
  },
  games: [{
    name: String,
    appID: Number,
    playTime: Number,
    playTime2: Number,
    tags: Array
  }]
});

const Player = mongoose.model("Player", playerSchema);

//user games ophalen
function saveGames(userID) {
  return new Promise((resolve, reject) => {
    saf
      .getUserGames(userID)
      .then(gamesArr => {
        new Player({
          userID: userID,
          games: gamesArr
        }).save((err, doc) => {
          if (err) reject(err);
          resolve(doc);
        });
      })
      .catch(err => reject(err));
  });
}

function findAll() {
  let promise = Player.find();
  return promise;
}

function findPlayer(userID) {
  return new Promise((resolve, reject) => {
    Player.find({
      userID
    }).exec((err, doc) => {
      if (err || !doc) reject(err);
      resolve(doc);
    });
  });
}

function findPlayerAndStore(userID) {
  return new Promise((resolve, reject) => {
    Player.find({
      userID: userID
    }).exec((err, doc) => {
      if (doc[0] == undefined) {
        saf.getUserGames(userID).then(gamesArr => {
          new Player({
            userID: userID,
            games: gamesArr
          }).save((err, doc) => {
            if (err) reject(err);
            resolve(doc[0]);
          });
        });
      } else if (err) {
        reject(err);
      } else {
        resolve(doc[0]);
      }
    });
  });
}

function getUserID(link) {
  return saf.getSteamID(link);
}

function addTagsToPlayer(user) {
  return new Promise((resolve, reject) => {
    new Promise(async (resolve, reject) => {
        for (let index = 0; index < user.games.length + 1; index++) {
          if (index == user.games.length) {
            resolve(user);
          } else {
            await addTagsToGame(user.games[index])
              .then(updatedGame => {
                user.games[index].tags = updatedGame.tags;
              })
              .catch(err => console.log(err));
          }
        }
      })
      .then(userObject => {
        resolve(userObject);
      })
      .catch(err => reject(err));
  });
}

function addTagsToGame(gameToMod) {
  return new Promise((resolve, reject) => {
    game
      .findGameByID(gameToMod.appID)
      .then(foundGame => {
        gameToMod.tags = foundGame[0].tags[0];
        resolve(gameToMod);
      })
      //catch nog niet gechecked
      .catch(() => {
        game
          .saveGame({
            name: gameToMod.name,
            appID: gameToMod.appID
          })
          .then(foundGame => {
            gameToMod.tags = foundGame[0].tags;
            resolve(gameToMod);
          })
          .catch(err => reject(err));
      });
  });
}

function savePlayer(playerObj) {
  let player = new Player(playerObj);
  player.save((err, player) => {
    if (err) return console.log(err);
    console.log(playerObj.name + " saved on " + getTime());
  });
}

function addPlayerGameTags(playerObject) {
  let games = playerObject.games;
  for (let i = 0; i < games.length; i++) {
    // haal tags op uit game database
    game.Game.find({
      appID: games[i].appID
    }).exec((err, doc) => {
      if (err | !doc) {
        //game niet in database, push hem erin
      }
      //game gevonden, push tags
    });
  }
}

function deletePlayer(userID) {
  return Player.findOneAndDelete({
    userID
  });
}

function getTime() {
  let date = new Date();
  let hour = ("0" + date.getHours()).slice(-2);
  let minute = ("0" + date.getMinutes()).slice(-2);
  let second = ("0" + date.getSeconds()).slice(-2);
  return hour + ":" + minute + ":" + second;
}

module.exports = {
  Player,
  findAll,
  savePlayer,
  getUserID,
  saveGames,
  addPlayerGameTags,
  deletePlayer,
  findPlayerAndStore,
  findPlayer,
  addTagsToPlayer
};