<template>
  <section class="createViewBody">
    <header>{{ uiLabels.theHeader }}</header>
    <div class="thePollId">{{ this.pollId }}</div>
  
  <section class="activePlayers">
    <div class="onePlayer" v-for="player in playersData">
      {{ getName(player) }}
    </div>
  </section>

  <button class="purpleButton" v-on:click="createPoll">
   {{ uiLabels.startGame }}
  </button>

</section>
</template>

<script>
import io from "socket.io-client";
const socket = io("localhost:3000");

export default {
  name: "CreateView",
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      clients: {},
      playersData: null,
    };
  },

  created: function () {
    this.pollId = this.getPollId(); //detta är det pollID som ska skickas till alla views för denna!
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);

    socket.on("addedPlayer", (data) => this.getActivePlayers(data));
    socket.on("removedPlayer", (data) => this.getActivePlayers(data));


    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    
    socket.on("dataUpdate", (data) => (this.data = data));
    socket.on("pollCreated", (data) => (this.data = data));
  },

  methods: {
    createPoll: function () {
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang });
      this.$router.push('/createQuestion/'+this.pollId)
    },
    addQuestion: function () {
      socket.emit("addQuestion", {
        pollId: this.pollId,
        q: this.question,
        a: this.answers,
      });
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {
        pollId: this.pollId,
        questionNumber: this.questionNumber,
      });
    },
    getPollId: function () {
      return "" + Math.floor(Math.random() * 100000);
    },
    getActivePlayers: function (data) {
      this.playersData = data;
    },
    getName: function (playerData) {
      return playerData.userName;
    },
    getGreenFlag: function (playerData) {
      return playerData.greenFlag;
    },
  },
};
</script>
<style>
header {
  font-size: 60px;
  padding: 40px;
}
.thePollId {
  font-size: 30px;
  color: #1693;
  font-size: 40px;
  color: darkmagenta;

}

.createViewBody {
  background: linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114));
  min-height: 100vh;

}

.activePlayers {
  font-size: 35px;
  color: rgb(156, 10, 83);
}

.startGameButton{
margin: 20px;
}

.purpleButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  border: solid;
  border-color: rgb(94, 13, 87);
  padding: 15px;
  text-align: center;
  display: inline-block;
  font-size: 15px;
  margin: 7px 5px;
  border-radius: 15px;

}

.purpleButton:hover:enabled {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
    cursor: pointer;   
 }

 
</style>
