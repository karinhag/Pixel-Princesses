<template>
  <section class="CAVbody">
    <header id="header" v-if="this.userAnswers.length != this.numbPlayers">
      {{ uiLabels.waitingAnswers }}
    </header>
    <header id="header" v-if="this.userAnswers.length === this.numbPlayers">
      {{ uiLabels.chooseElimination }}
    </header>
    <div class="numbAnswers">
      {{ this.userAnswers.length }} / {{ this.numbPlayers }}
    </div>

    <section class="yourQ">
      <h1 id="h1YourQ">{{ uiLabels.yourQuestion }}</h1>
      <p id="thisQ">{{ this.question }}</p>
    </section>

    <div class="scrollable" v-if="this.userAnswers.length != 0">
      <div class="userButtons"></div>
      <button
        class="playerAnswerB"
        type="submit"
        v-for="answerObject in this.userAnswers"
        :key="answerObject.playerID"
        v-on:click="choosePlayer(answerObject)"
        :disabled="this.numbPlayers !== this.userAnswers.length"
      >
        <img
          v-if="!chosenAnswer.includes(answerObject)"
          src="/pink_heart1.png"
        />
        <img v-else src="/black_broken_heart1.png" />

        {{ answerObject.answer }}
      </button>
    </div>

    <button
      class="eliminatingButton"
      v-on:click="eliminatePlayer"
      :disabled="
        this.numbPlayers !== this.userAnswers.length ||
        this.chosenAnswer.length === 0
      "
    >
      {{ uiLabels.eliminate }}
      {{ chosenAnswer.length > 0 ? chosenAnswer[0].answer : "..." }}
      <img src="/black_broken_heart1.png" />
    </button>
  </section>
</template>

<script>
import io from "socket.io-client";
const socket = io("localhost:3000");

export default {
  name: "ChooseAnswerView",
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: "",
      questionNumber: 0,
      data: {},
      uiLabels: {},
      predefinedQuestions: ["Q1", "Q2", "Q3", "Q4"],
      playersData: null,
      userAnswers: [],
      chosenAnswer: [],
      numbPlayers: 0,
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);
    socket.emit("getPlayersLeft", this.pollId);
    socket.emit("retrieveQ", this.pollId);
    socket.on("thePlayersLeft", (data) => {
      this.numbPlayers = data.length;
    });
    socket.on("abandonedPlayer", (eliminatedPlayerId) =>
      this.playerAbandoned(eliminatedPlayerId)
    );

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on("dataUpdate", (data) => (this.data = data));
    socket.on("incomingAnswers", (data) => this.getAnswer(data));
    socket.on(
      "theQuestion",
      (data) => (this.question = data),
      console.log(this.question)
    );
  },
  methods: {
    getAnswer: function (d) {
      const answersCopy = [...d]; // tror ej vi använder?? jo!
      this.userAnswers.push(answersCopy.pop());
    },

    choosePlayer: function (answer) {
      if (!this.chosenAnswer.includes(answer)) {
        this.chosenAnswer.pop();
        this.chosenAnswer.push(answer); //answer är både svaret och idt
      }
      this.chosenAnswer;
    },
    eliminatePlayer: function () {
      const eliminatedPlayerId = this.chosenAnswer[0].playerID;
      this.userAnswers = this.userAnswers.filter(
        (answer) => answer.playerID !== eliminatedPlayerId
      );
      this.$router.push("/eliminatedPlayer/" + this.pollId);
      socket.emit("eliminatedPlayer", {
        pollId: this.pollId,
        uniquePlayerId: eliminatedPlayerId,
      });
      this.resetPage();
    },
    resetPage: function () {
      this.userAnswers = [];
      this.chosenAnswer = [];
      this.answers = "";
      this.playersData = null;
    },

    playerAbandoned: function (pId) {
      this.numbPlayers -= 1;
      this.userAnswers = this.userAnswers.filter(
        (answer) => answer.playerID !== pId
      );
      socket.emit("getPlayersLeft", this.pollId);

      if (this.numbPlayers === 1) {
        socket.emit("getPlayersLeft", this.pollId);


        socket.on("thePlayersLeft", (player) => {
          console.log("SPlear", player);
        

        socket.emit("theTrueMatchPlayer", {
          pollId: this.pollId,
          matchedPlayer: player,
        });
      });
        this.$router.push("/endOfGame/" + this.pollId);
      }
    },
  },
};
</script>

<style>
#header,
.numbAnswers {
  font-family: "Lilita One", sans-serif;
  font-size: 70px;
  color: rgb(253, 252, 253);
  text-transform: uppercase;
}
#header,
#h1YourQ,
#thisQ {
  font-family: "Lilita One", sans-serif;
  letter-spacing: 3px;
}
#h1YourQ {
  font-size: 35px;
  text-transform: uppercase;
  color:#252422;
  text-align: center;

}
#thisQ {
  margin-top: -10px;
  font-size: 40px;
  color: rgb(246, 178, 246);
  text-align: center;

}

.CAVbody {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='2560' height='1660' preserveAspectRatio='none' viewBox='0 0 2560 1660'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1010%26quot%3b)' fill='none'%3e%3crect width='2560' height='1660' x='0' y='0' fill='rgba(255%2c 96%2c 154%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c1013.585C208.941%2c1032.63%2c434.221%2c1063.573%2c613.908%2c955.26C794.984%2c846.11%2c912.763%2c643.72%2c956.687%2c436.904C996.947%2c247.341%2c863.746%2c71.489%2c842.516%2c-121.136C820.241%2c-323.239%2c956.782%2c-560.196%2c829.329%2c-718.618C702.63%2c-876.103%2c453.015%2c-842.575%2c251.335%2c-855.967C85.794%2c-866.959%2c-68.273%2c-817.684%2c-231.693%2c-789.073C-419.199%2c-756.245%2c-625.408%2c-787.183%2c-779.549%2c-675.483C-947.414%2c-553.838%2c-1090.118%2c-365.405%2c-1101.943%2c-158.436C-1113.627%2c46.053%2c-938.989%2c204.295%2c-840.063%2c383.644C-749.529%2c547.779%2c-695.931%2c737.079%2c-545.963%2c849.536C-390.79%2c965.896%2c-193.153%2c995.979%2c0%2c1013.585' fill='%23ff2876'%3e%3c/path%3e%3cpath d='M2560 2779.9449999999997C2780.266 2770.749 3003.287 2757.089 3194.139 2646.739 3390.249 2533.349 3545.893 2359.264 3642.1949999999997 2154.2219999999998 3739.1310000000003 1947.8319999999999 3770.1530000000002 1716.371 3737.068 1490.763 3704.042 1265.559 3607.471 1053.5030000000002 3455.876 883.719 3305.665 715.485 3106.295 599.864 2888.689 540.588 2673.87 482.0719999999999 2451.098 500.02099999999996 2234.362 550.98 2007.6599999999999 604.2819999999999 1752.598 653.137 1614.007 840.293 1476.983 1025.3319999999999 1516.56 1280.825 1523.479 1510.971 1529.392 1707.654 1593.088 1887.05 1651.13 2075.067 1718.411 2293.0119999999997 1710.653 2561.3630000000003 1890.894 2701.149 2072.024 2841.625 2330.9809999999998 2789.5060000000003 2560 2779.9449999999997' fill='%23ff98be'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1010'%3e%3crect width='2560' height='1660' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
  min-height: 100vh;
  font-family: "Lilita One", sans-serif;
}
.yourQ {
  white-space: normal;
  word-wrap: break-word;
  width: 70vh;
  text-align: center;
  margin: 0 auto;
  display: block;
  /* display: flex; Add this line to use flexbox for vertical alignment */
  align-items: center;
  justify-content: center; /* Add this line to center the element vertically */
}

.eliminatingButton {
  font-family: "Lilita One", sans-serif;
  text-align: center;
  display: inline-block;
  text-transform: uppercase;
  margin-bottom: 3%;
  margin-top: 3%;
  font-size: 45px;
  min-width: 45%;
  padding-right: 20px;
  padding-left: 20px;
  border-radius: 12px;
  background-color: rgb(253, 252, 253);
  height: 70px;
}
.eliminatingButton:not([disabled]) {
  background-color: rgb(253, 252, 253);
}
.eliminatingButton:hover:not([disabled]) {
  background: radial-gradient(
    circle at 50.4% 50.5%,
    rgb(251, 32, 86) 0%,
    rgb(155, 6, 43) 90%
  );
  border: solid;
  border-color: #252422;

  color: rgb(253, 252, 253);
  text-align: center;
  display: inline-block;
}

.eliminatingButton:disabled {
  cursor: not-allowed;
}
.playerAnswerB {
  font-family: "Lilita One", sans-serif;
  text-transform: uppercase;
  font-size: 45px;
  display: block;
  margin: 10px;
  text-align: center;
  min-width: 65%;
  max-width: 90%;
  padding: 20px;
  border-radius: 12px;
  height: auto; /* Adjust to allow variable height */
  white-space: normal; /* Allow text to wrap to multiple lines */
  word-wrap: break-word; /* Break long words to fit */
  text-align: center;
  display: inline-block;
  background-color: rgb(253, 252, 253);
}

.playerAnswerB:hover:not([disabled]) {
  color: rgb(244, 103, 139);
  cursor: pointer;
  display: block;
  text-align: center;
  display: inline-block;
}

.scrollable {
  display: flex;
  font-family: "Lilita One", sans-serif;
  flex-direction: column;
  max-height: 40vh;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 0 60px 15px rgb(252, 48, 123);
  width: fit-content;
  min-height: 10vh;
  max-width:80vh;
  width: 90vh;
  align-items: center;
  margin: auto;
  margin-top: 2.5em;
  background: radial-gradient(
    rgb(243, 225, 231),
    rgb(253, 162, 199),
    rgb(253, 122, 172)
  );
  padding-bottom: 40px;

  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: rgb(244, 103, 139) rgb(255, 255, 255); /* For Firefox */

  /* WebKit (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgb(255, 227, 234);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(244, 103, 139);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgb(234, 72, 112);
    cursor: pointer;
  }
}
.userButtons {
  text-align: center;
  display: inline-block;
}

button > img {
  width: 35px;
  vertical-align: middle;
}

@media screen and (max-width: 50em) {

.CQVbody{
  min-height:100vh;
  background-size: cover;
}

.yourQ{
  width: 80%
}

#header, 
#h1YourQ,
.eliminatingButton {
  font-size: 2rem;
  vertical-align: middle;
  text-align: center;
}

#thisQ{
  font-size: 1.2rem;
  text-align: center;

}
.scrollable {
display: flex;
width:40vh;
padding:1rem;
max-width:80vh;

}

.playerAnswerB, .userButtons {
  width: 100%; 
  font-size: 1.2rem;

}
.eliminatingButton:hover:not([disabled]) {
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  transform: scale(1.01);
  transition: all 0.3s ease;
}
}
</style>
