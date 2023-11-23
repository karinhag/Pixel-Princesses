<template>
  <body>
  <div>

   Game ID: {{pollId}}
   
    <QuestionComponent v-bind:question="question"
              v-on:answer="submitAnswer($event)"/>
              <span>{{submittedAnswers}}</span>

            <p> {{ uiLabels.greenFlag }}<input type="text" v-model="greenFlag"> </p>

            <p> {{ uiLabels.userName }}<input type="text" v-model="userName"> </p>

            <!--här får vi nog lägga in att username och greenflag sparas-->

  </div>
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
      uiLabels: {},
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
    }
    
  }


  
}
</script>

<style>

body{
  background: linear-gradient(106.5deg, rgba(255, 215, 185, 0.91) 23%, rgba(223, 159, 247, 0.8) 93%);

}



</style>
