<template>
  
  <div>
    <header>{{uiLabels.theHeader }}</header>
    <div class="thePollId">{{ this.pollId }}</div>
   
    {{console.log(this.pollId)}}
  </div>
  <router-link to="/createQuestion/">{{uiLabels.startGame}}</router-link>
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
      clients:[]
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
    socket.on("pollCreated", (data) =>
      this.data = data)
    this.getPollId()
  },
  methods: {
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
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
    getPollId: function(){
      return this.pollId=Math.floor((Math.random()) * 100000);
    },

    listenToClient: function(){
      socket.on("connectingClient",{clients}) //hej
      console.log("hello")
    }
    // startGame: function(){
    //   // socket.emit("createPoll", {pollId: this.pollId, lang: this.lang }, "hello") 
    // }
  }
}
</script>
<style>
header{
  font-size: 60px;
}
.thePollId{
  font-size: 40px;
  color: darkmagenta;
}
</style>
