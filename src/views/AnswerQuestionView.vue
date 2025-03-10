<template>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
  />
  <section class="pollBody" v-if="!this.timeOver">
    <section class="answerQuestion">
      <div v-if="!this.timeOver" id="roomId">
        {{ uiLabels.joinedRoom }} {{ this.pollId }}
      </div>
      <div v-if="!this.timeOver" class="question">
        {{ this.question }}
      </div>
      <div class="timer-container">
        <div class="base-timer">
          <svg
            class="base-timer__svg"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g class="base-timer__circle">
              <circle
                class="base-timer__path-elapsed"
                cx="50"
                cy="50"
                r="45"
              ></circle>
              <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                :class="{
                  'base-timer__path-remaining': true,
                  [remainingPathColor]: true,
                }"
                d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
              ></path>
            </g>
          </svg>
          <span id="base-timer-label" class="base-timer__label">
            {{ this.formatTimeLeft(timeLeft) }}
          </span>
        </div>
      </div>

      <p v-if="!this.timeOver" id="answer">
        {{ uiLabels.answer }} <br />
        <input class="inputField" type="text" v-model="userInfo.answer" />
      </p>

      <button
        v-if="!this.timeOver"
        class="purpleButton"
        v-on:click="submitAnswer"
        type="submit"
        :disabled="!userInfo.answer"
      >
        {{ uiLabels.sendAnswer }}
      </button>
    </section>
  </section>

  <section class="timeOverScreen" v-if="this.timeOver">
    <section class="timeText">{{ uiLabels.timeIsUp }}</section>
  </section>
</template>

<script>

import io from "socket.io-client";
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: "AnswerQuestionView",
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en", //Löser språkinställning
      uiLabels: {},

      userInfo: {
        userName: "",
        greenFlag: "",
        uniquePlayerId: "",
        saved: false,
        eliminated: false,
      },

      question: "",
      pollId: "",
      TIME_LIMIT: 30,
      timePassed: 0,
      timeLeft: 30,
      timerInterval: null,
      remainingPathColor: "green",
      timeOver: false,
      timerStopped: false,
    };
  },
  created: function () {
    this.id = this.$route.params.id;
    this.pollId = this.$route.params.pollId;
    socket.emit("joinPoll", this.pollId);

    this.userInfo.userName = this.$route.query.userName;
    this.userInfo.greenFlag = this.$route.query.greenFlag;
    this.userInfo.uniquePlayerId = this.$route.query.uniquePlayerId;
    this.userInfo.saved = this.$route.query.saved;
    this.userInfo.eliminated = this.$route.query.eliminated;

    socket.emit("joinPoll", this.userInfo.uniquePlayerId);

    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.emit("retrieveQ", this.pollId);
    socket.on("theQuestion", (data) => (this.question = data));

    this.startTimer();
  },
  methods: {
    checkIfSaved: function () {
      const savedPlayerQueryParam = this.$route.query.savedPlayer;

      if (
        savedPlayerQueryParam &&
        savedPlayerQueryParam.toLowerCase() === "true"
      ) {
        this.resetPage();
      }
    },
    submitAnswer: function () {
      this.resetTime();
      this.timerStopped = false;
      this.$router.push({
        path: "/waitingView/" + this.pollId,
        query: {
          userName: this.userInfo.userName,
          greenFlag: this.userInfo.greenFlag,
          uniquePlayerId: this.userInfo.uniquePlayerId,
          eliminated: this.userInfo.eliminated,
        },
      });
      socket.emit("submitAnswer", {
        pollId: this.pollId,
        userInfo: this.userInfo,
      });
    },
    abandonDate: function () {
      socket.emit("removePlayer", {
        pollId: this.pollId,
        userInfo: this.userInfo,
      });
      this.$router.push({ path: "/" });
    },

    nextQuestion: function (data) {
      this.question = data;
      if (this.question.length > 0) {
        this.resetPage();
      }
    },

    resetPage: function () {
      this.question = "";
      this.userInfo.answer = "";
      this.TIME_LIMIT = 30;
      this.timePassed = 0;
      this.timeLeft = 30;
      this.stopTimer();
      this.timerInterval = null;
    },

    formatTimeLeft: function (time) {
      // cred för timern till instruktionen: https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/
      if (time === this.uiLabels.timeIsUp) {
        return this.uiLabels.timeIsUp;
      } else {
        let seconds = time % 60;
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
        return `${seconds}`;
      }
    },
    startTimer: function () {
      this.timerInterval = setInterval(() => {
        this.timePassed = this.timePassed += 1;
        this.timeLeft = this.TIME_LIMIT - this.timePassed;

        if (!this.timerStopped) {
          if (this.timeLeft <= 0) {
            this.timeLeft = this.uiLabels.timeIsUp;
            this.timeIsUp();
          }

          this.updateColor(this.timeLeft);
          document.getElementById("base-timer-label").innerHTML =
            this.formatTimeLeft(this.timeLeft);
          this.setCircleDasharray();
        }
      }, 1000);
    },

    timeIsUp: function () {
      this.timeOver = true;
      this.stopTimer();
      setTimeout(() => {
        this.$router.push({
          path: "/youAreEliminated/" + this.pollId,
          query: {
            userName: this.userInfo.userName,
            greenFlag: this.userInfo.greenFlag,
            uniquePlayerId: this.userInfo.uniquePlayerId,
          },
        });
        socket.emit("eliminatedPlayer", {
          pollId: this.pollId,
          uniquePlayerId: this.userInfo.uniquePlayerId,
        });
        this.resetTime();
      }, 2000);
    },

    stopTimer: function () {
      this.timerStopped = true;
      clearInterval(this.timerInterval);
    },

    resetTime: function () {
      this.stopTimer();
      this.TIME_LIMIT = 30;
      this.timePassed = 0;
      this.timeLeft = 30;
      this.timerInterval = null;
      this.timeOver = false;
      this.timerStopped = false;
    },

    calculateTimeFraction: function () {
      const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
      return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
    },

    setCircleDasharray: function () {
      const FULL_DASH_ARRAY = 283;
      const circleDasharray = `${(
        this.calculateTimeFraction() * FULL_DASH_ARRAY
      ).toFixed(0)} 283`;

      document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
    },

    updateColor: function (timeLeft) {
      if (timeLeft > 22) {
        this.remainingPathColor = "green";
      } else if (timeLeft > 18) {
        this.remainingPathColor = "green2";
      } else if (timeLeft > 10) {
        this.remainingPathColor = "green3";
      } else if (timeLeft > 8) {
        this.remainingPathColor = "green4";
      } else if (timeLeft > 6) {
        this.remainingPathColor = "warning";
      } else if (timeLeft > 0) {
        this.remainingPathColor = "alert";
      }
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");

.timeText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  font-family: "Lilita One", sans-serif;
  vertical-align: center;
  color: rgba(255, 152, 194, 255);
}

.timer-container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 250px;
  width: 250px;
  margin-top: 22vh;
}

.base-timer {
  height: 100%;
  width: 100%;
}

.base-timer__circle {
  fill: none;
  stroke: none;
}

.base-timer__path-elapsed {
  stroke-width: 10px;
  stroke: #ced4da;
  opacity: 0.3;
}

.base-timer__label {
  position: absolute;

  width: 250px;
  height: 250px;

  top: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 80px;
  left: 50%;
  transform: translateX(-50%);
}

.base-timer__path-remaining {
  stroke-width: 10px;

  stroke-linecap: round;

  transform: rotate(90deg);
  transform-origin: center;

  transition: 1s linear all;
}

.green {
  stroke: #55a630;
}

.green2 {
  stroke: #55a630;
}
.green3 {
  stroke: #80b918;
}
.green4 {
  stroke: #bfd200;
}

.alert {
  stroke: #ff0000;
}
.warning {
  stroke: #ffee32;
}

.base-timer__svg {
  transform: scaleX(-1);
}

#roomId {
  padding: 0%;
  margin: 0%;
  text-align: right;
  padding-right: 1em;
  padding-top: 1em;
  color: rgb(202, 28, 135);
  font-size: medium;
}

h1,
.question {
  text-align: center;
  letter-spacing: 2.5px;
  padding-top: 0.5em;
  padding-left: 3em;
  padding-right: 3em;
  margin: 30px;
  font-size: 70px;
  color: #ffffff;
}

.pollBody {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='2560' height='1660' preserveAspectRatio='none' viewBox='0 0 2560 1660'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1047%26quot%3b)' fill='none'%3e%3crect width='2560' height='1660' x='0' y='0' fill='rgba(255%2c 152%2c 194%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c955.486C176.431%2c930.366%2c338.98%2c856.208%2c481.45%2c749.151C616.427%2c647.724%2c705.408%2c506.787%2c790.887%2c361.186C885.583%2c199.885%2c982.116%2c40.819%2c1006.192%2c-144.669C1035.801%2c-372.789%2c1081.058%2c-633.227%2c943.931%2c-817.921C806.257%2c-1003.352%2c541.456%2c-1026.589%2c315.596%2c-1074.82C104.283%2c-1119.944%2c-109.392%2c-1138.644%2c-319.375%2c-1087.691C-536.659%2c-1034.966%2c-780.656%2c-968.927%2c-899.998%2c-779.852C-1017.607%2c-593.522%2c-902.901%2c-352.089%2c-922.219%2c-132.595C-940.111%2c70.693%2c-1073.66%2c267.26%2c-1009.199%2c460.886C-943.088%2c659.465%2c-766.369%2c807.95%2c-578.431%2c900.057C-400.907%2c987.06%2c-195.724%2c983.353%2c0%2c955.486' fill='%23ff5fa0'%3e%3c/path%3e%3cpath d='M2560 2907.648C2791.1 2911.79 2908.6639999999998 2625.846 3083.702 2474.8959999999997 3230.551 2348.255 3422.832 2267.2 3505.8540000000003 2091.957 3589.3379999999997 1915.74 3557.406 1713.477 3536.2619999999997 1519.635 3514.428 1319.464 3481.453 1123.075 3381.126 948.491 3264.812 746.087 3146.068 489.80999999999995 2917.417 442.75 2686.872 395.30099999999993 2504.924 639.425 2284.83 722.858 2087.1549999999997 797.793 1815.9009999999998 736.519 1691.524 907.461 1565.8229999999999 1080.222 1714.902 1322.843 1693.6019999999999 1535.431 1673.617 1734.898 1498.827 1924.647 1570.866 2111.7219999999998 1642.848 2298.649 1892.167 2330.7619999999997 2048.225 2456.337 2229.091 2601.874 2327.887 2903.4880000000003 2560 2907.648' fill='%23ffd1e4'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1047'%3e%3crect width='2560' height='1660' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
  min-height: 100vh;
  font-family: "Lilita One", sans-serif;
  margin: 0; /* Set margin to 0 */
  padding: 0; /* Set padding to 0 */
}

.timeOverScreen {
  background: radial-gradient(#ff2d30ff, #cb0505ff, rgb(98, 4, 4));
  height: 100vh;
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

#h1 {
  margin: 0px;
  padding: 20px;
}

#answer {
  margin-top: -10vh;
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
.purpleButton:disabled {
  cursor: not-allowed;
}

.purpleButton:hover:enabled {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;
}

.nextRound {
  padding-top: 7rem;
}

.waitingForQuestion {
  color: white;
  font-size: 2rem;
}

.goBackButton {
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

button:hover {
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  transform: scale(1.01);
  transition: all 0.3s ease;
}

@media screen and (max-width: 50em) {
  .timeText {
    font-size: 50px;
  }

  .question {
    font-size: 50px;
    padding-left: 0.2vw;
    padding-right: 0.2vw;
    margin: 5px;
  }
  #h1 {
    font-size: 100%;
    padding-top: 2em;
  }

  .timer-container {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 150px;
    width: 150px;
    margin-top: 18vh;
    margin-bottom: 8vh;
  }

  .base-timer {
    height: 100%;
    width: 100%;
  }

  .base-timer__path-elapsed {
    stroke-width: 6px;
    stroke: #ced4da;
    opacity: 0.3;
  }

  .base-timer__label {
    position: absolute;

    width: 150px;
    height: 150px;

    top: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 50px;
    left: 50%;
    transform: translateX(-50%);
  }

  .base-timer__path-remaining {
    stroke-width: 6px;

    stroke-linecap: round;

    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
  }
  input {
    width: 80vw;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
  }

  #answer {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    display: block;
    width: 80vw;
  }
  #inputDiv {
    align-items: left;
  }
  #inputField {
    width: 2000px;
  }
}
</style>
