<template>
  <body>
  <div>

   Game ID: {{pollId}}
   
    <QuestionComponent v-bind:question="question"
              v-on:answer="submitAnswer($event)"/>
              <span>{{this.submittedAnswers}}</span>

            <p> {{ uiLabels.greenFlag }}<input type="text" v-model="userInfo.greenFlag"> </p>

            <p> {{ uiLabels.userName }}<input type="text" v-model="userInfo.userName"> </p>
      

            <!--här får vi nog lägga in att username och greenflag sparas-->

  </div>
  <button v-on:click="joinDate" type="submit">
    Join date
  </button>
</body>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'PollView',
  components: {
    QuestionComponent
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en", //uiLabel språk inställning
      uiLabels: {},
      userInfo: {
        userName: "",
        greenFlag: ""
      },
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      submittedAnswers: {},

    }
  },
  created: function () {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.connected);
    });
    this.pollId = this.$route.params.id;
    this.id = this.$route.params.id;

    socket.emit("pageLoaded", this.lang); //språkinställning(?)
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.emit('joinPoll', this.pollId)
    socket.on("newQuestion", q =>
      this.question = q
    )
    socket.on("dataUpdate", answers =>
      this.submittedAnswers = answers
    )
    socket.on("init", (labels) => {
    this.uiLabels = labels
    })
  },
  methods: {
    
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },
    joinDate: function () {
      console.log(this.userInfo);
      socket.emit("joiningDate", this.userInfo) //Hej
    }
    
  }


  
}
</script>

<style>

body{
  background: linear-gradient(106.5deg, rgba(255, 215, 185, 0.91) 23%, rgba(223, 159, 247, 0.8) 93%);

}



</style>
