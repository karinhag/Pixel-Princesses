<template>
  <section class="eliminatedPlayerViewBody">
    <div class="topPage">
      <h1 id="h1" v-if="!lifeButtonPressed">{{ uiLabels.theEliminatedPlayer }}</h1>
      <h1 id="h1" v-if="lifeButtonPressed">{{ uiLabels.youHaveSaved }}</h1>
      <h2 id="h2">{{ this.userName }}</h2>

      <h1 id="h1">{{ uiLabels.hasGreenFlag }}</h1>
      <h3>{{ this.greenFlag }}</h3>

      <h4 v-if="availableLifeline">{{ uiLabels.changedMind }}</h4>
    </div>

    <div class="saveButton" v-on:click="savePlayer" v-if="availableLifeline">
      <button class="lifebouyButton">
        {{ uiLabels.savePlayer }}
      </button>
    </div>
    <button
      class="nextQButton"
      v-on:click="createQuestion"
      v-if="!onePlayerLeft || (onePlayerLeft && lifeButtonPressed)"
    >
      {{ uiLabels.nextQuestion }}
    </button>

    <div class="lifeBouyUsed" v-if="!availableLifeline && !onePlayerLeft">
      {{ uiLabels.lifebouySpent }}
    </div>
    <button
      class="lastPlayer"
      v-if="onePlayerLeft && !lifeButtonPressed"
      v-on:click="getTrueMatch"
    >
      {{ uiLabels.showTrueMatch }}
    </button>
  </section>
</template>

<script>
import io from "socket.io-client";
const socket = io("localhost:3000");

export default {
  name: "EliminatedPlayerView",
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      availableLifeline: Boolean,
      eliminatedPlayer: {},
      userName: "",
      greenFlag: "",
      uniquePlayerId: "",
      playerArray: [],
      onePlayerLeft: false,
      lifeButtonPressed: false,
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);
    socket.emit("getEliminatedPlayer", this.pollId);
    socket.emit("getPlayersLeft", this.pollId);
    socket.on("thePlayersLeft", (data) => this.checkPlayerArray(data));
    socket.on("hejKomOKyssMig", (data) => this.getPlayer(data));
    socket.emit("checkIfLifelineUsed", this.pollId);
    socket.on("statusLifeline", (data) => this.checkLifeline(data));

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on("dataUpdate", (data) => (this.data = data));
  },
  methods: {
    savePlayer: function () {
      this.playerSaved = true;
      this.lifeButtonPressed = true;
      socket.emit("lifelineUsed", {
        pollId: this.pollId,
        uniquePlayerId: this.uniquePlayerId,
        userInfo: this.eliminatedPlayer[0],
      });
    },
    getPlayer: function (data) {
      this.eliminatedPlayer = data;
      this.userName = data.userName;
      this.greenFlag = data.greenFlag;
      this.uniquePlayerId = data.uniquePlayerId;
    },
    checkPlayerArray: function (data) {
      if (data.length == 1) {
        this.onePlayerLeft = true;
      }
      this.playerArray = data;
    },

    createQuestion: function () {
      this.eliminatedPlayer = "";
      this.userName = "";
      this.greenFlag = "";
      this.uniquePlayerId = "";
      this.$router.push("/createQuestion/" + this.pollId);
      socket.emit("newIncomingQuestion", { pollId: this.pollId });
    },
    checkLifeline: function (data) {
      this.availableLifeline = data;
    },
    getTrueMatch: function () {
      this.$router.push("/endOfGame/" + this.pollId);
      socket.emit("theTrueMatchPlayer", {
        pollId: this.pollId,
        matchedPlayer: this.playerArray,
      });
    },
  },
};
</script>
<style>
.eliminatedPlayerViewBody {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='2560' height='1660' preserveAspectRatio='none' viewBox='0 0 2560 1660'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1014%26quot%3b)' fill='none'%3e%3crect width='2560' height='1660' x='0' y='0' fill='rgba(255%2c 96%2c 154%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c1026.973C227.278%2c1047.243%2c489.108%2c1181.744%2c670.477%2c1043.283C854.577%2c902.737%2c754.872%2c599.117%2c841.708%2c384.395C922.881%2c183.677%2c1184.363%2c48.357%2c1159.832%2c-166.759C1135.393%2c-381.069%2c863.323%2c-462.749%2c726.125%2c-629.191C584.095%2c-801.495%2c558.426%2c-1110.716%2c340.738%2c-1160.447C119.668%2c-1210.951%2c-39.8%2c-936.724%2c-250.241%2c-852.244C-432.62%2c-779.029%2c-668.388%2c-838.543%2c-807.334%2c-699.559C-947.422%2c-559.432%2c-971.14%2c-336.566%2c-963.727%2c-138.563C-957.019%2c40.607%2c-826.094%2c181.111%2c-768.012%2c350.739C-701.452%2c545.127%2c-751.994%2c794.39%2c-597.785%2c930.171C-443.154%2c1066.324%2c-205.215%2c1008.671%2c0%2c1026.973' fill='%23ff2876'%3e%3c/path%3e%3cpath d='M2560 2829.3779999999997C2773.9 2868.781 3002.632 2733.383 3143.11 2567.3360000000002 3274.057 2412.555 3221.65 2181.864 3273.601 1985.891 3314.674 1830.954 3411.1059999999998 1697.092 3416.277 1536.886 3422.14 1355.259 3392.815 1173.562 3304.958 1014.49 3203.589 830.953 3088.545 595.875 2880.818 567.396 2667.541 538.156 2523.523 784.155 2331.264 880.998 2182.61 955.877 2013.1219999999998 970.612 1880.5410000000002 1071.246 1724.354 1189.798 1558.471 1319.685 1504.833 1508.29 1448.826 1705.227 1470.768 1935.728 1586.693 2104.495 1698.542 2267.328 1941.905 2257.248 2100.34 2375.245 2276.654 2506.557 2343.798 2789.551 2560 2829.3779999999997' fill='%23ff98be'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1014'%3e%3crect width='2560' height='1660' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  min-height: 100vh;
  padding: 10px;
  background-size: cover;
  min-height: 100vh;
}

#h1 {
  font-family: "Lilita One", sans-serif;
  font-size: 25px;
  color: rgb(254, 221, 255);
}

#h2 {
  font-family: "Lilita One", sans-serif;
  font-size: 50px;
  color: #252422;
}

h3 {
  font-family: "Lilita One", sans-serif;
  font-size: 50px;
  color: rgb(20, 150, 20);
}

.lifeBouyUsed {
  font-family: "Lilita One", sans-serif;
  color: rgb(254, 221, 255);
  font-size: 20px;
}

h4 {
  font-size: 25px;
  color: rgb(254, 221, 255);
  font-family: "Lilita One", sans-serif;

  margin-top: 1em;
}

.lifeBouyUsed {
  font-size: 25px;
}

.eliminatedBody {
  margin-top: 0em;
  background: radial-gradient(
    circle at 10% 20%,
    rgb(248, 236, 146) 0%,
    rgb(252, 121, 158) 90%
  );
  min-height: 100vh;
}

.lifebouyButton {
  background: url("/lifebouy1.png") 15px center no-repeat,
    /* PNG background image */
      linear-gradient(
        200deg,
        #90f1efff,
        #ffd6e0ff,
        #ffef9fff,
        #c1fba4ff,
        #7bf1a8ff
      );
  background-size: contain;
  border-radius: 15px;
  text-align: center;
  font-family: "Lilita One", sans-serif;
  display: inline-block;
  padding: 2%;
  text-transform: uppercase;
  color: #252422;
  font-size: 20pt;
  min-width: 300px;
  text-align: right;
  padding: 1em;
}

.nextQButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  font-size: 20pt;
  color: #252422;
  width: 20%;
  border-radius: 15px;
  font-family: "Lilita One", sans-serif;
  margin-top: 1em;
  display: inline-block;
}

.lastPlayer {
  background: linear-gradient(
    180.8deg,
    rgb(140, 247, 177) -0.8%,
    rgb(147, 219, 250) 99%
  );
  font-size: 20pt;
  color: #252422;
  width: 20%;
  border-radius: 15px;
  font-family: "Lilita One", sans-serif;
  margin-top: 1em;
  display: inline-block;
  padding: 2rem;
}

.lifebouyButton:hover {
  background: url("/lifebouy1.png") 15px center no-repeat,
    linear-gradient(200deg, #00ffcc, #ff80bf, #ffcc00, #00ff80, #00ccff);

  background-size: contain;
  border-radius: 15px;
  text-align: center;
  font-family: "Lilita One", sans-serif;
  display: inline-block;
  padding: 2%;
  text-transform: uppercase;
  color: #252422;
  font-size: 20pt;
  width: 18%;
  text-align: right;
  padding: 1em;
  
}
.lastPlayer:hover {
  background: linear-gradient(
    180.8deg,
    rgb(70, 234, 127) -0.8%,
    rgb(101, 194, 233) 99%
  );
  cursor: pointer;
}
.nextQButton:hover {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;
}
@media screen and (max-width: 50em) {
  .lastPlayer,
  .nextQButton {
    width: 50%;
  }
}

#h2,
h3 {
  text-transform: uppercase;
  letter-spacing: 5px;
}
button:hover{
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  transform: scale(1.01);
  transition: all 0.3s ease;
}

</style>
