"use strict";
const languages = ["en", "se"];
import { readFileSync } from "fs";

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};
  this.players = [];
  this.answers = [];
  this.eliminatedPlayer = [];
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.getUILabels = function (lang = "en") {
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
};

Data.prototype.createPoll = function (pollId, lang = "en") {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang;
    poll.questions = [];
    poll.answers = [];
    poll.currentQuestion = 0;
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
};

Data.prototype.addQuestion = function (pollId, q) {
  const poll = this.polls[pollId];
  if (typeof poll !== "undefined") {
    poll.questions.push(q);
  }
};

Data.prototype.editQuestion = function (pollId, index, newQuestion) {
  const poll = this.polls[pollId];
  if (typeof poll !== "undefined") {
    poll.questions[index] = newQuestion;
  }
};

Data.prototype.getQuestion = function (pollId, qId = null) {
  const poll = this.polls[pollId];
  if (typeof poll !== "undefined") {
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions;
  }
  return [];
};

Data.prototype.storeAnswer = function (pollId, answer, playerID) {
  let playerInfo = { answer, playerID };
  if (!this.answers[pollId]) {
    this.answers[pollId] = [];
  }
  this.answers[pollId].push(playerInfo);
  return this.answers[pollId];

};

Data.prototype.getAnswers = function (pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== "undefined") {
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== "undefined") {
      return { q: poll.questions[poll.currentQuestion].q };
    }
  }
  return {};
};

Data.prototype.removeUserInfo = function (pollId, userInfo) {

  const userIndex = this.players[pollId].findIndex(
    (user) => user.uniquePlayerId === userInfo.uniquePlayerId
  );
 
  if (userIndex !== -1) {
    this.players[pollId].splice(userIndex, 1)
  
  }
  console.log("removeUser ger:", this.players[pollId]);
  return this.players[pollId];
};

Data.prototype.addPlayer = function (pollId, userInfo) {
  if (!this.players[pollId]) {
    this.players[pollId] = [];
  }
  this.players[pollId].push(userInfo);
  return this.players[pollId];
};

Data.prototype.eliminateAPlayer = function (pollId, uniquePlayerId) {
  const userIndex = this.players[pollId].findIndex(
    (user) => user.uniquePlayerId === uniquePlayerId
  );
  if (!this.eliminatedPlayer[pollId]) {
    this.eliminatedPlayer[pollId] = [];
  }
  if (userIndex !== -1) {
      this.eliminatedPlayer[pollId].push(
      this.players[pollId].splice(userIndex, 1)
    );
  }
  console.log("EliminatePlayer ger", this.eliminatedPlayer[pollId]);
  return this.eliminatedPlayer[pollId];
};

Data.prototype.retrieveEliminatedPlayer = function (pollId) {
  console.log("inuti data funk", this.eliminatedPlayer[pollId]); //ger undefined???!!!!
  console.log("pollId i retrive elimi är", pollId);
  if (this.eliminatedPlayer[pollId]) {
    return this.eliminatedPlayer[pollId];
  } else return [];
};

export { Data };
