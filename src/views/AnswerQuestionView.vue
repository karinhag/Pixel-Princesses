<template>
  <section class="pollBody">
    <section
      class="waitingForStart"
      v-if="
        !this.showInputBox && !this.answerSubmitted && !this.goingToNextRound
      "
    >
        <div id="roomId">{{uiLabels.joinedRoom}} {{ this.pollId }} </div>
      <h1>{{ uiLabels.waitingForGame }}</h1>
      
      <button class="purpleButton" v-on:click="abandonDate" type="submit">
        {{ uiLabels.abandonDate }}
      </button>
    </section>
    <section
      class="answerQuestion"
      v-if="
        this.showInputBox && !this.answerSubmitted && !this.goingToNextRound
      "
    >
    <div id="roomId">
        {{uiLabels.joinedRoom}} {{ this.pollId }}
    </div>
    <div class="question">
      {{ this.question }}
    </div>

      <p id="answer">
        {{ uiLabels.answer }} <br>
        <input type="text" v-model="userInfo.answer" /> 
      </p>

      <button class="purpleButton" v-on:click="submitAnswer" type="submit" :disabled="!userInfo.answer">
        {{ uiLabels.sendAnswer }}
      </button>

    </section>
    <section
      v-if="this.answerSubmitted && !this.goingToNextRound"
      class="waitingForChoice"
    >
      <h1>{{ uiLabels.waitingForChoice }}</h1>

      <div class="infinity">
        <l-infinity
          size="400"
          stroke="20"
          stroke-length="0.15"
          bg-opacity="0.3"
          speed="1.8"
          color="#f5f5f5; ;"
        ></l-infinity>
      </div>
    </section>

    <section v-if="this.goingToNextRound">
      <h1 class="nextRound">{{uiLabels.nextRound }}</h1>
      <p class="waitingForQuestion"> {{ uiLabels.waitingForQuestion }}</p>
    </section>
  </section>
</template>

<script>
// @ is an alias to /src
import { infinity } from "ldrs"; //måste importera package för att använda i think; koden; npm install ldrs

import QuestionComponent from "@/components/QuestionComponent.vue";
import io from "socket.io-client";
const socket = io("localhost:3000");
infinity.register();
export default {
  name: "AnswerQuestionView",
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
        uniquePlayerId: "",
      },
      userInformation: {},
      userFlag: "",
      userCreated: false,
      question: "",

      pollId: "inactive poll",
      showInputBox: false,
      submittedAnswers: {},
      answerSubmitted: false,
      eliminatedPlayer: {},
      goingToNextRound: false,
    };
  },
  created: function () {
    this.id = this.$route.params.id;
    this.pollId = this.$route.params.pollId;
    socket.emit("joinPoll", this.pollId);
  

    this.userInfo.userName = this.$route.query.userName;
    this.userInfo.greenFlag = this.$route.query.greenFlag;
    this.userInfo.uniquePlayerId = this.$route.query.uniquePlayerId;
    socket.emit("joinPoll", this.userInfo.uniquePlayerId)

    this.showInputBox = false;
    socket.on("pollsId", (pollId) => {
      this.pollId = pollId;
    });

    socket.emit("pageLoaded", this.lang); //Löser språkinställning
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
   

    socket.on("newQuestion", (q) => {
      this.question = q;
      if (this.question.length > 0) {
        this.showInputBox = true;
      }
    });

    socket.on("dataUpdate", (answers) => (this.submittedAnswers = answers));
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.on("hejKomOKyssMig", (data) => {
      this.getPlayer(data);
    });
    socket.on("newQuestionIncoming", ()=>this.resetPage());

   

  socket.on("youAreTrueMatch",()=> this.$router.push("/winnerView/" + this.pollId));

  },
  methods: {
    submitAnswer: function () {
      socket.emit("submitAnswer", {
        pollId: this.pollId,
        userInfo: this.userInfo,
      });
      this.answerSubmitted = true;
    },
    abandonDate: function () {
      this.userCreated = false;
      socket.emit("removePlayer", {
        pollId: this.pollId,
        userInfo: this.userInfo,
      });
      this.$router.push({path:"/"})
    },
    getPlayer: function (data) {
      this.eliminatedPlayer = data;
      if (
        this.userInfo.uniquePlayerId == this.eliminatedPlayer.uniquePlayerId
      ) {
   
        this.eliminated = true;
        this.$router.push({
          path: "/youAreEliminated/" + this.pollId,
          query: {userName: this.userInfo.userName, greenFlag: this.userInfo.greenFlag, uniquePlayerId: this.userInfo.uniquePlayerId},
        });
        this.goingToNextRound = false;
      } else {
        this.goingToNextRound = true;
      }
    },
    nextQuestion: function (data) {
      this.question = data;
      if (this.question.length > 0) {
        this.showInputBox = true;
        this.resetPage();
      }
    },
    resetPage: function () {
      this.answerSubmitted = false;
      this.goingToNextRound = false;
      this.answerSubmitted = false;
      this.question="";
      this.userInfo.answer="";
     
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");


#roomId {
  padding: 0%;
  margin: 0%;
  text-align: right;
  padding-right: 1em;
  padding-top: 1em;
  color: #252422;
  font-size: medium;
  
}

header,
h1 {
  letter-spacing: 2.5px;
  margin: 50px;
  font-size: 60px;
  color:#252422;
}

.pollBody {
background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='2560' height='1660' preserveAspectRatio='none' viewBox='0 0 2560 1660'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1047%26quot%3b)' fill='none'%3e%3crect width='2560' height='1660' x='0' y='0' fill='rgba(255%2c 152%2c 194%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c955.486C176.431%2c930.366%2c338.98%2c856.208%2c481.45%2c749.151C616.427%2c647.724%2c705.408%2c506.787%2c790.887%2c361.186C885.583%2c199.885%2c982.116%2c40.819%2c1006.192%2c-144.669C1035.801%2c-372.789%2c1081.058%2c-633.227%2c943.931%2c-817.921C806.257%2c-1003.352%2c541.456%2c-1026.589%2c315.596%2c-1074.82C104.283%2c-1119.944%2c-109.392%2c-1138.644%2c-319.375%2c-1087.691C-536.659%2c-1034.966%2c-780.656%2c-968.927%2c-899.998%2c-779.852C-1017.607%2c-593.522%2c-902.901%2c-352.089%2c-922.219%2c-132.595C-940.111%2c70.693%2c-1073.66%2c267.26%2c-1009.199%2c460.886C-943.088%2c659.465%2c-766.369%2c807.95%2c-578.431%2c900.057C-400.907%2c987.06%2c-195.724%2c983.353%2c0%2c955.486' fill='%23ff5fa0'%3e%3c/path%3e%3cpath d='M2560 2907.648C2791.1 2911.79 2908.6639999999998 2625.846 3083.702 2474.8959999999997 3230.551 2348.255 3422.832 2267.2 3505.8540000000003 2091.957 3589.3379999999997 1915.74 3557.406 1713.477 3536.2619999999997 1519.635 3514.428 1319.464 3481.453 1123.075 3381.126 948.491 3264.812 746.087 3146.068 489.80999999999995 2917.417 442.75 2686.872 395.30099999999993 2504.924 639.425 2284.83 722.858 2087.1549999999997 797.793 1815.9009999999998 736.519 1691.524 907.461 1565.8229999999999 1080.222 1714.902 1322.843 1693.6019999999999 1535.431 1673.617 1734.898 1498.827 1924.647 1570.866 2111.7219999999998 1642.848 2298.649 1892.167 2330.7619999999997 2048.225 2456.337 2229.091 2601.874 2327.887 2903.4880000000003 2560 2907.648' fill='%23ffd1e4'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1047'%3e%3crect width='2560' height='1660' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
  /* //https://bgjar.com/simple-shiny hemsidan för att skapa! */
  min-height: 100vh;
  font-family: "Lilita One", sans-serif;
  margin-top: 0em;
}

input {
  font-family: "Lilita One", sans-serif;
  caret-color: #f06af0;
  font-size: 40px;
  color: #ff81bee8;
}

.waitingForStart {
  font-size: 40px;
  font-weight: bold;
  margin: 0px;
}

h1 {
  margin: 0px;
  padding: 20px;
}
.question {
 font-size: 40px; 
 text-align: center;
 padding-top: 1em;
 padding-left: 3em;
 padding-right: 3em;
 color: #f5f5f5;
}
#answer {
  text-align: center;  

}

.purpleButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  border-color: rgb(94, 13, 87);
  padding: 15px;
  text-align: center;
  display: inline-block;
  font-size: 15px;
  margin: 7px 5px;
  border-radius: 15px;
  font-family: "Lilita One", sans-serif;
}
.purpleButton:disabled{
  cursor:not-allowed
}

.purpleButton:hover:enabled {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;
}

.nextRound{
  padding-top: 7rem;
}

.waitingForQuestion{
  color: white;
  font-size: 2rem;


}


.goBackButton{
  background: linear-gradient(to top, #dfe9f3 0%, white 100%);
  border: solid;
  border-color: rgb(94, 13, 87);
  padding: 15px;
  text-align: center;
  display: inline-block;
  font-size: 15px;
  margin: 7px 5px;
  border-radius: 15px;
  font-family: "Lilita One", sans-serif;
}


</style>
