<template>
    <section class="eliminatedPlayerViewBody">

  <div class="topPage">
    <h1>{{ uiLabels.theEliminatedPlayer }}</h1><h2>{{ this.userName }}</h2>

    <h3>{{ uiLabels.hasGreenFlag }}{{ this.greenFlag }}</h3>

    <h4 v-if="availableLifeline">{{ uiLabels.changedMind }} </h4>
  </div>

  <!-- {{ namn + greenFlag skicka från choose answerView mha id }} -->

  <div class="saveButton" v-on:click="savePlayer" v-if="availableLifeline">
    <button class="lifebouyButton">
      <img class="theLifebouy" src="/lifebouy1.png" /> <br>
      {{ uiLabels.savePlayer }}
    </button>
  </div>
  <button class="nextQButton" v-on:click="createQuestion">
    {{ uiLabels.nextQuestion }}
  </button>

  <div class="lifeBouyUsed" v-if="!availableLifeline">
    {{ uiLabels.lifebouySpent }}
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
      availableLifeline: Boolean,
      eliminatedPlayer: {},
      userName: "",
      greenFlag: "",
      uniquePlayerId: "",
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);
    socket.emit("getEliminatedPlayer", this.pollId);
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
  },
};
</script>
<style>
.eliminatedPlayerViewBody{
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='2560' height='1660' preserveAspectRatio='none' viewBox='0 0 2560 1660'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1090%26quot%3b)' fill='none'%3e%3crect width='2560' height='1660' x='0' y='0' fill='rgba(235%2c 133%2c 189%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c847.787C155.73%2c859.484%2c251.124%2c677.787%2c372.184%2c579.13C478.393%2c492.575%2c596.764%2c422.29%2c666.692%2c304.468C741.851%2c177.831%2c784.013%2c34.721%2c782.689%2c-112.534C781.236%2c-274.059%2c763.41%2c-447.771%2c658.82%2c-570.871C553.943%2c-694.308%2c385.812%2c-744.568%2c225.576%2c-768.24C78.736%2c-789.933%2c-59.931%2c-729.466%2c-205.099%2c-698.501C-363.914%2c-664.625%2c-544.079%2c-684.102%2c-666.901%2c-577.873C-794.484%2c-467.527%2c-856.246%2c-293.098%2c-868.356%2c-124.851C-880.057%2c37.713%2c-835.564%2c208.233%2c-732.577%2c334.557C-638.294%2c450.203%2c-460.11%2c440.18%2c-337.907%2c525.794C-207.847%2c616.912%2c-158.356%2c835.893%2c0%2c847.787' fill='%23dc298b'%3e%3c/path%3e%3cpath d='M2560 2522.934C2780.263 2532.3 2994.3 2738.908 3195.6059999999998 2649.022 3393.9809999999998 2560.445 3430.025 2296.091 3515.4210000000003 2096.326 3598.706 1901.499 3692.364 1709.691 3687.709 1497.8600000000001 3682.683 1269.146 3665.9790000000003 999.673 3488.16 855.744 3309.337 711.002 3039.6639999999998 841.103 2815.017 791.491 2612.535 746.774 2450.061 567.6980000000001 2243.113 580.7829999999999 2017.624 595.04 1790.272 694.07 1643.192 865.581 1496.36 1036.8029999999999 1444.219 1275.634 1453.994 1500.98 1462.903 1706.352 1608.842 1868.393 1694.7939999999999 2055.126 1780.4279999999999 2241.169 1778.0529999999999 2498.995 1958.21 2596.404 2139.65 2694.507 2353.922 2514.1710000000003 2560 2522.934' fill='%23fae1ef'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1090'%3e%3crect width='2560' height='1660' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
   min-height: 100vh;
  padding: 20px;
}

header {
  font-size: 60px;
  font-family: "Lilita One", sans-serif;
  font-variant: small-caps;
}
h1 {
  padding-top: 1em;
  font-family: "Lilita One", sans-serif;
  font-size: 35px;
  color: black;

}

h3 {
  font-family: "Lilita One", sans-serif;
  font-size: 30px;
  color:rgb(254, 221, 255);
}
h2 {
  font-family: "Lilita One", sans-serif;
  font-size: 80px;
  color:rgb(237, 93, 177);

}


.lifeBouyUsed{
  font-family: "Lilita One", sans-serif;
  font-size: 30px;
  color:rgb(254, 221, 255);
  font-size: 20px;
}

h4{
  font-size: 25px;
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
  );  min-height: 100vh;
}

.lifebouyButton {
  background: radial-gradient(
    circle at 10% 20%,
    rgb(255, 200, 124) 0%,
    rgb(252, 251, 121) 90%
  );
  font-size: 20pt;
  color: black;
  width: 20%;
  border-radius: 15px;
  text-align: center;
  font-family: "Lilita One", sans-serif;
  display: inline-block;
  padding-bottom: 1em;
}
.theLifebouy {
  width: 6em;
}

.nextQButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  font-size: 20pt;
  color: black;
  width: 20%;
  border-radius: 15px;
  font-family: "Lilita One", sans-serif;
  margin-top: 1em;
  display: inline-block;
}

lifebouyButton>img,
/*this part selects the img as a direct child of the button*/
lifebouyButton>span {
  /*this part selects the span as a direct child of the button*/
  vertical-align: middle;
  width: 25px;
  margin-bottom: 20px;

}

.lifebouyButton:hover:enabled {
  background: linear-gradient(
    109.6deg,
    rgb(255, 207, 84) 11.2%,
    rgb(255, 158, 27) 91.1%
  );
  cursor: pointer;
}

.nextQButton:hover:enabled {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;
}
</style>
