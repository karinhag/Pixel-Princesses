<template>
  <section class="CAVbody">
    <header>{{ uiLabels.waitingAnswers }}</header>
    <h1>{{ uiLabels.chooseElimination }}</h1>

    <div class="scrollable" v-if="this.userAnswers.length!=0">
      <div class="userButtons"></div>
      <button
        class="playerAnswerB"
        type="submit"
        v-for="answerObject in this.userAnswers"
        :key="answerObject.playerID"
        v-on:click="choosePlayer(answerObject)"
      >
        <img
          v-if="!chosenAnswer.includes(answerObject)"
          src="/pink_heart1.png"
        />
        <img v-else src="/black_broken_heart1.png" />

        {{ answerObject.answer }}
      </button>
    </div>
    <button
        class="eliminatingButton"
        v-on:click="eliminatePlayer"
        :disabled="chosenAnswer.length === 0"
      >
        {{ uiLabels.eliminate }}
        {{ chosenAnswer.length > 0 ? chosenAnswer[0].answer : "..." }}
        <img src="/black_broken_heart1.png" />
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
      answers: "",
      questionNumber: 0,
      data: {},
      uiLabels: {},
      predefinedQuestions: ["Q1", "Q2", "Q3", "Q4"],
      playersData: null,
      userAnswers: [],
      chosenAnswer: [],
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on("dataUpdate", (data) => (this.data = data));
    socket.on("incomingAnswers", (data) => this.getAnswer(data));
  },
  methods: {
    getAnswer: function (d) {
      const answersCopy = [...d]; // tror ej vi använder??
      this.userAnswers.push(answersCopy.pop());
    },

    choosePlayer: function (answer) {
      if (!this.chosenAnswer.includes(answer)) {
        this.chosenAnswer.pop();
        this.chosenAnswer.push(answer); //answer är både svaret och idt
      }
      this.chosenAnswer;
    },
    eliminatePlayer: function () {
      this.$router.push("/eliminatedPlayer/" + this.pollId);
      socket.emit("eliminatedPlayer", {
        pollId: this.pollId,
        uniquePlayerId: this.chosenAnswer[0].playerID,
      });
      this.resetPage();
    },
    resetPage: function () {
      this.userAnswers = [];
      this.chosenAnswer = [];
      this.answers = "";
      this.playersData = null;
    },
  },
};
</script>

<style>
header {
  font-size: 70px;
  color: rgb(253, 252, 253);
}
header,
h1 {
  font-family: "Lilita One", sans-serif;
  letter-spacing: 3px;
  text-transform: uppercase;
}
h1 {
  font-size: 35px;
}

.CAVbody {
  background: linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114));
  /* min-height: 100vh; */
  height: 100vh;
}

.eliminatingButton {
  font-family: "Lilita One", sans-serif;
  text-align: center;
  display: inline-block;

  margin-top: 3%;
  font-size: 45px;
  min-width: 45%;
  padding-right: 20px;
  padding-left: 20px;
  border-radius: 12px;
  height: 70px;
}
.eliminatingButton:not([disabled]){
  background-color: rgb(253, 252, 253);
}
.eliminatingButton:hover:not([disabled]) {
  background: radial-gradient(
    circle at 50.4% 50.5%,
    rgb(251, 32, 86) 0%,
    rgb(155, 6, 43) 90%
  );
  border: solid;
  border-color: black;

  color: rgb(253, 252, 253);
  text-align: center;
  display: inline-block;


}
.playerAnswerB {
  font-size: 45px;
  display: block;
  margin: 10px;
  text-align: center;
  min-width: 25%;
  max-width: 90%;
  padding: 20px;
  border-radius: 12px;
  height: auto; /* Adjust to allow variable height */
  white-space: normal; /* Allow text to wrap to multiple lines */
  word-wrap: break-word; /* Break long words to fit */
  text-align: center;
  display: inline-block;
  background-color: rgb(253, 252, 253);
}

button:hover:not([disabled]) {
  color: rgb(244, 103, 139);
  cursor: pointer;
  display:block;
  text-align: center;
  display: inline-block;
}

.scrollable {
  display: flex;
  flex-direction: column;
  max-height: 40vh; 
  overflow-y: scroll; 
  border: 10px solid rgb(244, 103, 139);
  width: fit-content;
  min-width:650px; 
  min-height: 10vh;
  max-width: 80%;
  align-items: center;
  margin: auto;
  background-color: rgb(255, 154, 179);
  padding:20px; 
  padding-bottom: 40px;;

  scrollbar-width: thin; /* For Firefox */
  scrollbar-color:  rgb(244, 103, 139) rgb(255, 255, 255); /* For Firefox */

  /* WebKit (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgb(255, 227, 234); 
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(244, 103, 139);
    
  }
  &::-webkit-scrollbar-thumb:hover{
   background-color: rgb(234, 72, 112);
   cursor:pointer;
    
  }
}
.userButtons{
  text-align: center;
  display: inline-block;

}

button > img {
  width: 35px;
  vertical-align: middle;
}
</style>
