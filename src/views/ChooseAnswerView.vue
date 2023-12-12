<template>
  <section class="CAVbody">
    <header>{{ uiLabels.waitingAnswers }}</header>
    <h1>{{ uiLabels.chooseElimination }}</h1>

    <div class="button_container">
      {{ this.userAnswers }}
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

      <button
        class="eliminatingButton"
        v-on:click="eliminatePlayer"
        :disabled="chosenAnswer.length === 0"
      >
        {{ uiLabels.eliminate }}
        {{ chosenAnswer.length > 0 ? chosenAnswer[0].answer : "..." }}
        <img src="/black_broken_heart1.png" />
      </button>
    </div>
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
      // \this.userAnswers.push(d.pop());
      const answersCopy = [...d]; // Create a shallow copy of the array
  this.userAnswers.push(answersCopy.pop());
      console.log("data i getAnswer;", d)
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
      console.log("hello chosen answer", this.chosenAnswer)
      this.userAnswers = [];
      this.chosenAnswer = [];
      console.log("hello 2 chosen answer", this.chosenAnswer)
      this.answers = "";
      this.playersData= null;
    },
  },
};
</script>

<style>
header {
  font-size: 50px;
  color: black;
}
header,
h1 {
  font-family: "Lilita One", sans-serif;
  letter-spacing: 2px;
}
h1 {
  font-size: 30px;
}

.CAVbody {
  background: linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114));
  min-height: 100vh;
}

.eliminatingButton {
  font-family: "Lilita One", sans-serif;
  text-align: center;
  display: inline-block;

  margin-top: 20%;
  font-size: 45px;
  min-width: 45%;
  padding-right: 20px;
  padding-left: 20px;
  border-radius: 12px;
  height: 70px;
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

  margin-top: 20%;
  font-size: 45px;
  min-width: 45%;
  padding-right: 20px;
  padding-left: 20px;
  border-radius: 12px;
  height: 70px;
}

.playerAnswerB {
  font-size: 45px;
  display: block;
  margin: 10px;
  text-align: center;
  min-width: 25%;
  padding-right: 20px;
  padding-left: 20px;
  border-radius: 12px;
  height: 70px;
}
button:hover:not([disabled]) {
  color: rgb(244, 103, 139);
  cursor: pointer;
}
.button_container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button > img {
  /*this part selects the img as a direct child of the button*/

  /*this part selects the span as a direct child of the button*/

  width: 35px;
  vertical-align: middle;
}
</style>