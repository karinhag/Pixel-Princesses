<template>
  <section class="CQVbody">
    <header>{{ uiLabels.writeQuestion }} {{ this.numberedQuestion }}</header>

    pOLLid; {{ this.pollId }}
    <div><textarea v-model="question" rows="4" cols="50"></textarea><br /></div>
    <div>
      {{ uiLabels.hardToDecide
      }}<button class="randomQuestionButton" @click="generateRandomQuestion">
        {{ uiLabels.randomQuestion }}
      </button>
    </div>
    <div>
      <button v-on:click="addQuestion" id="submitButton">
        {{ uiLabels.submitQuestion }}
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
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      originalPredefinedQuestions: [
        "Q1",
        "Q2",
        "Q3",
        "Q4",
        "Q5",
        "Q6",
        "Q7",
        "Q8",
        "Q9",
        "Q10",
        "Q11",
        "Q12",
      ],
      predefinedQuestions: [
        "Q1",
        "Q2",
        "Q3",
        "Q4",
        "Q5",
        "Q6",
        "Q7",
        "Q8",
        "Q9",
        "Q10",
        "Q11",
        "Q12",
      ],
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on("dataUpdate", (data) => (this.data = data));
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
      this.predefinedQuestions.splice(randomIndex, 1);
      if (this.predefinedQuestions.length === 0) {
        this.predefinedQuestions = this.originalPredefinedQuestions;
      }
    },

    addQuestion: function () {
      // this.$router.push("/chooseAnswer/" + this.pollId);
      socket.emit("addQuestion", { pollId: this.pollId, q: this.question });
      socket.emit("addQuestion", {
        pollId: this.pollId,
        q: this.question,
        a: this.answers,
      });
      this.$router.push("/chooseAnswer/" + this.pollId);
    },
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
};
</script>

<style>
header {
  font-size: 50px;
  color: black;
}

.CQVbody {
  background: linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114));
  min-height: 100vh;
}

.randomQuestionButton {
  background: radial-gradient(
    290px at 8.6% 46.4%,
    rgb(255, 148, 148) 7.8%,
    rgb(255, 223, 155) 32.2%,
    rgb(255, 247, 177) 48.1%,
    rgb(216, 255, 177) 61%,
    rgb(177, 255, 253) 75.3%
  );
  border: solid;
  border-color: rgb(94, 13, 87);
  padding: 15px;
  text-align: center;
  display: inline-block;
  font-size: 15px;
  margin: 7px 5px;
  border-radius: 15px;
}

.purpleButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  border: solid;
  border-color: rgb(94, 13, 87);
  padding: 15px;
  text-align: center;
  display: inline-block;
  font-size: 15px;
  margin: 7px 5px;
  border-radius: 15px;
}

button:hover {
  color: rgb(77, 5, 59);
  cursor: rgb(64, 4, 49);
}
</style>
