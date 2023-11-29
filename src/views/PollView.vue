<template>
  <div class="pollBody">  <!--förut hade den här en body-tag, men det får den tydligen inte göra men nu blir färgen fel-->
  <div>

   Game ID: {{pollId}}
   
    <QuestionComponent v-bind:question="question"
              v-on:answer="submitAnswer($event)"/>
              <span>{{this.submittedAnswers}}</span>

            <p> {{ uiLabels.userName }}<input type="text" v-model="userInfo.userName"> </p>
            <p> {{ uiLabels.greenFlag }}<input type="text" v-model="userInfo.greenFlag"> </p>

      
  </div>
  <button v-on:click="joinDate" type="submit">
    Join date
  </button>
</div>
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
      lang: localStorage.getItem("lang") || "en", //Löser språkinställning
      uiLabels: {},
      
      userInfo: {
        userName: "",
        greenFlag: "",
        uniquePlayerId: this.getPlayerId() // playerID
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
    this.pollId = this.$route.params.id;
    this.id = this.$route.params.id;

    socket.emit("pageLoaded", this.lang); //Löser språkinställning
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
  methods: { getPlayerId: function(){
      return Math.floor((Math.random()) * 100000);
    }, 
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    },

    joinDate: function () {
      console.log("Before emitting joinDate:", this.userInfo);
      socket.emit("joinDate", { userInfo: this.userInfo , pollId: this.pollId});
      console.log("After emitting joinDate");
      console.log(this.userInfo);
      socket.emit("joiningDate", this.userInfo) //Hej
    },
    }
    
  }
  

</script>

<style>

.pollBody{
  background: linear-gradient(106.5deg, rgba(255, 215, 185, 0.91) 23%, rgba(223, 159, 247, 0.8) 93%);

}



</style>
