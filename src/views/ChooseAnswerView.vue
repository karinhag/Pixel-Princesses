<template>
    <header>{{uiLabels.waitingAnswers}}</header>
    {{uiLabels.chooseElimination}}


    <div class="onePlayer" v-for="player in playersData">
      {{ getAnswer(player) }}
    </div>
   
    <router-link to="/eliminatedPlayer/">
      <button v-on:click="eliminatePlayer" type="submit">ELIMINATE</button>
      </router-link>
 
</template>


<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      predefinedQuestions: ["Q1", "Q2", "Q3", "Q4"],
      playersData: null,
    }
  },
  created: function () {
    this.id = this.$route.params.id;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
      this.data = data
    )
  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
    },
    generateRandomQuestion() {
        const randomIndex = Math.floor(Math.random() * this.predefinedQuestions.length);
      this.question = this.uiLabels[this.predefinedQuestions[randomIndex]];
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    },
    getAnswer: function (playerData) {
      return playerData.answer;
    },
  }
}
</script>

<style>
header{
  font-size: 50px;
  color: black;
}
</style>