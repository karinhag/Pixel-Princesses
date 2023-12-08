<template>
  <section class="CAVbody">
    <header>{{ uiLabels.waitingAnswers }}</header>
    {{ uiLabels.chooseElimination }}

    <div class="button_container">
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

      <button class="eliminatingButton" v-on:click="eliminatePlayer" :disabled="chosenAnswer.length === 0" >
        {{ uiLabels.eliminate }}  {{chosenAnswer.length > 0 ? chosenAnswer[0].answer : "..."}} 
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
    socket.emit("pageLoaded", this.lang, console.log("Hello 1"));
    socket.emit("joinPoll", this.pollId,console.log("Hello 2"));


    socket.on("init", (labels) => {
      this.uiLabels = labels; console.log("Hello 3")
    });
    socket.on("dataUpdate", (data) => (this.data = data), console.log("Hello 4"));
    socket.on("incomingAnswers", (data) => this.getAnswer(data));
  },
  methods: {
    // createPoll: function () {
    //   socket.emit("createPoll", { pollId: this.pollId, lang: this.lang });
    // },
    generateRandomQuestion() {
      const randomIndex = Math.floor(
        Math.random() * this.predefinedQuestions.length
      );
      this.question = this.uiLabels[this.predefinedQuestions[randomIndex]];
    },
    addQuestion: function () {
      socket.emit("addQuestion", {
        pollId: this.pollId,
        q: this.question,
        a: this.answers,
      });
    },

    runQuestion: function () {
      socket.emit("runQuestion", {
        pollId: this.pollId,
        questionNumber: this.questionNumber,
      });
    },
    getAnswer: function (d) {
      this.userAnswers.push(d.pop()); 
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
      socket.emit("eliminatedPlayer", {pollId: this.pollId, uniquePlayerId: this.chosenAnswer[0].playerID}) 
    },
  },
};
</script>

<style>
header {
  font-size: 50px;
  color: black;
}

.CAVbody {
  background: linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114));
  min-height: 100vh;
}

.eliminatingButton {
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
