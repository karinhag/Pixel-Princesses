<template>
  <section class="CAVbody">
    <header>{{ uiLabels.waitingAnswers }}</header>
    {{ uiLabels.chooseElimination }}

  <div v-for="answer in this.userAnswers" :key="answer">{{ answer }}</div>

  <router-link to="/eliminatedPlayer/">
    <button class="eliminateButton" v-on:click="eliminatePlayer" type="submit">ELIMINATE</button>
  </router-link>
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
    addAnswer: function () {
      this.answers.push("");
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
    eliminatePlayer: function(){
      this.$router.push("/eliminatedPlayer/" + this.id);
    }
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
  background: radial-gradient(circle at 50.4% 50.5%, rgb(248, 76, 119) 0%,rgb(228, 19, 71) 90%);
  padding: 15px;
  color: white;
  border: solid;
  border-color: black;
  border-radius: 15px;
}

.eliminateButton:hover:enabled {
  background: radial-gradient(circle at 50.4% 50.5%, rgb(249, 70, 115) 0%,rgb(148, 2, 39)90%);    
  cursor: pointer;    
 }
</style>
