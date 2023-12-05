<template>
  <body>
    <section class="enteringDetails" v-if="userCreated === false">
      <div>
        Game ID: {{ pollId }}

        <QuestionComponent v-bind:question="question" v-on:answer="submitAnswer($event)" />
        <!--<span>{{ this.submittedAnswers }}</span>-->
        <p>
          {{ uiLabels.userName
          }}<input type="text" v-model="userInfo.userName" />
        </p>

        <p>
          {{ uiLabels.greenFlag
          }}<input type="text" v-model="userInfo.greenFlag" />
        </p>


        <!--här får vi nog lägga in att username och green flag sparas-->
      </div>
      <button v-on:click="joinDate" type="submit">Join date</button>
    </section>

    <section class="waitingForStart" v-if="this.userCreated && this.showInputBox === false">
      <h1>{{ uiLabels.waitingForGame }}</h1>
      <button v-on:click="abandonDate" type="submit">
        {{ uiLabels.abandonDate }}
      </button>

    </section>

    <section class="answerQuestion" v-if="this.showInputBox">
      {{this.question[0]}}
      <p>
          {{ uiLabels.answer
          }}<input type="text" v-model="userInfo.answer" />
        </p>

        <button v-on:click="submitAnswer" type="submit">{{ uiLabels.sendAnswer }}</button>

      <button v-on:click="abandonDate" type="submit">
        {{ uiLabels.abandonDate }}
      </button>

    </section>

  </body>
</template>

<script>
// @ is an alias to /src
import QuestionComponent from "@/components/QuestionComponent.vue";
import io from "socket.io-client";
const socket = io("localhost:3000");

export default {
  name: "PollView",
  components: {
    QuestionComponent,
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en", //Löser språkinställning
      uiLabels: {},

      userInfo: {
        userName: "",
        greenFlag: "",
        answer: "",
        uniquePlayerId: this.getPlayerId(), // playerID
      },
      userCreated: false,
      question:"",

      pollId: "inactive poll",
      showInputBox: false,
      submittedAnswers: {},
    };
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.id = this.$route.params.id;
    this.showInputBox = false;

    socket.emit("pageLoaded", this.lang); //Löser språkinställning
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.emit("joinPoll", this.pollId);

    socket.on("newQuestion", (q) => {
      this.question = q;
      console.log(this.question);
      if (this.question.length > 0) {
    this.showInputBox = true;
  }
    });

    socket.on("dataUpdate", (answers) => (this.submittedAnswers = answers))
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
  },
  methods: {
    getPlayerId: function () {
      return "" + Math.floor(Math.random() * 100000);
    },
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", { pollId: this.pollId, userInfo: this.userInfo });
    },

    joinDate: function () {
      console.log("Before emitting joinDate: ", this.userInfo);
      socket.emit("joinDate", {
        userInfo: this.userInfo,
        pollId: this.pollId,
      });
      console.log("After emitting joinDate");
      console.log(this.userInfo);

      this.userCreated = true;
    },
  
    abandonDate: function () {
      this.userCreated = false;
      socket.emit("removePlayer", {
        pollId: this.pollId,
        userInfo: this.userInfo,
      });
    },

  },
};
</script>

<style>
body {
  background: linear-gradient(106.5deg,
      rgba(255, 215, 185, 0.91) 23%,
      rgba(223, 159, 247, 0.8) 93%);
}

.enteringDetails {
  font-size: 20px;
}

.waitingForStart {
  font-size: 40px;
  font-weight: bold;
}
</style>
