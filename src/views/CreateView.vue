<template>
  
  <div>
    <header>{{uiLabels.theHeader }}</header>
    <div class="thePollId">{{ this.pollId }}</div>
   
    {{console.log(this.pollId)}}

  </div>
  <button v-on:click="startGame">{{uiLabels.startGame}}</button>
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
      uiLabels: {}
    }
  },
  created: function () {
    console.log("CreateView component created");
    console.log("Socket connected:", socket.connected);
    this.id = this.$route.params.id;
    console.log("Current pollId:", this.pollId);
    socket.emit('joinPoll', this.pollId);
    socket.on("joinedDate", (data) => {
      console.log("Received joinedDate event in CreateView:", data);
    });
    socket.emit("pageLoaded", this.lang);
    socket.on('connect', () => {
          console.log("Socket connected:", socket.connected);
          socket.emit("pageLoaded", this.lang);
    });
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
    // startGame: function(){
    //   // socket.emit("createPoll", {pollId: this.pollId, lang: this.lang }, "hello") 
    // }
  }
}
</script>
<style>
header{
  font-size: 50px;
}
.thePollId{
  font-size: 30px;
  color:#1693;
}
</style>
