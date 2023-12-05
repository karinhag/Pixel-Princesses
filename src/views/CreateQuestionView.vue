<template>
  <section class="CQVbody">
    <header>{{uiLabels.writeQuestion}} {{ this.numberedQuestion }}</header>
    <div>
      <textarea v-model="question" rows="4" cols="50"></textarea><br>
    </div>
    <div>
      {{uiLabels.hardToDecide}}<button @click="generateRandomQuestion">{{ uiLabels.randomQuestion }}</button>
    </div>
    <div>
      <router-link to="/chooseAnswer/">
          <button v-on:click="addQuestion" id="submitButton" >{{uiLabels.submitQuestion}}
          </button> 
      </router-link> 
    </div>

<!--uiLabels.submitQuestion ska skickas med som qId på samma sätt som pollId skickas vidare (se data.json)-->
</section>
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
      originalPredefinedQuestions:["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12"],
      predefinedQuestions: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12"],

    }
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
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
      this.predefinedQuestions.splice(randomIndex, 1);
      if(this.predefinedQuestions.length === 0){
        this.predefinedQuestions = this.originalPredefinedQuestions
      }
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
  }}

</script>

<style>
header{
  font-size: 50px;
  color: black;
}

.CQVbody{
  background: linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114));
  min-height: 100vh;
}
</style>