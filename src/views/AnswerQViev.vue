<template>
    <body>
        <p>
          {{ uiLabels.answer}}<input type="text" v-model="userInfo.answer" />
        </p>
    </body>



</template>


<script>
import QuestionComponent from "@/components/QuestionComponent.vue";
import io from "socket.io-client";
const socket = io("localhost:3000");



export default {
  name: "AnswerQView",
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en", //Löser språkinställning
      uiLabels: {}
    };
},
  created: function () {
    this.pollId = this.$route.params.id;
    this.id = this.$route.params.id;

    socket.emit("pageLoaded", this.lang); //Löser språkinställning
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.emit("joinPoll", this.pollId);
    socket.on("newQuestion", (q) => (this.question = q));
    socket.on("dataUpdate", (answers) => (this.submittedAnswers = answers));
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
  },
}

</script>
