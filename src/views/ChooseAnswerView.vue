<template>
  <section class="CAVbody">
    <header>{{ uiLabels.waitingAnswers }}</header>
    {{ uiLabels.chooseElimination }}

    <div class="button_container">
      <button
        class="playerAnswerB"
        type="submit"
        v-for="answer in this.userAnswers"
        :key="answer"
        v-on:click="choosePlayer(answer)"
      >
        <img v-if="!chosenAnswer.includes(answer)" src="/pink_heart1.png" />
        <img v-else src="/black_broken_heart1.png" />

        {{ answer }}
      </button>
      <button class="eliminatingButton" v-on:click="eliminatePlayer" :disabled="chosenAnswer.length === 0">
        {{ uiLabels.eliminate }}     
        {{ this.chosenAnswer.length > 0 ? this.chosenAnswer[0] : "..." }}
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
    createPoll: function () {
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang });
    },
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
      //  for (let i = 0; i < d.length; i++) {
      // const currentAnswer = d[i].answer;

      this.userAnswers.push(d.pop().answer); //skriv om!!!
      console.log(this.userAnswers);
    },
    choosePlayer: function (answer) {
      if (!this.chosenAnswer.includes(answer)) {
        this.chosenAnswer.pop();
        this.chosenAnswer.push(answer);
      }
      this.chosenAnswer;
    },
    eliminatePlayer:function(){ this.$router.push("/eliminatedPlayer/" + this.pollId);}
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

.eliminateButton {
  background: radial-gradient(
    circle at 50.4% 50.5%,
    rgb(251, 32, 86) 0%,
    rgb(135, 2, 35) 90%
  );
  border: solid;
  border-color: black;
  padding: 15px;
  color: lightgoldenrodyellow;
  text-align: center;
  display: inline-block;
  font-size: 15px;
  margin: 7px 5px;
  border-radius: 15px;
}

.playerAnswerB {
  font-size: 45px;
  display: block;
  margin: 10px;
  text-align: center;
  min-width: 35%;
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
.eliminatingButton {
  margin-top: 20%;
  font-size: 45px;
  min-width: 35%;
  padding-right: 20px;
  padding-left: 20px;
  border-radius: 12px;
  height: 70px;
}
</style>
