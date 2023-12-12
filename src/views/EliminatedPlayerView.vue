<template>
  <div class="topPage">
    <h1>{{ uiLabels.theEliminatedPlayer }}{{ this.userName }}</h1>

    <h3>{{ uiLabels.hasGreenFlag }}{{ this.greenFlag }}</h3>
  </div>

  <!-- {{ namn + greenFlag skicka från choose answerView mha id }} -->

  <div class="saveButton" v-on:click="savePlayer" v-if="availableLifeline">
    <button class="lifebouyButton">
      <img class="theLifebouy" src="/lifebouy1.png" />
      {{ uiLabels.savePlayer }}
    </button>
  </div>
  <button class="nextQButton" v-on:click="createQuestion">
    {{ uiLabels.nextQuestion }}
  </button>

  <div class="lifeBouyUsed" v-if="!availableLifeline">
    {{ uiLabels.lifebouySpent }}
  </div>
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
      const playerArrays = data;
//chatgpt
      // Ensure there is at least one inner array
      if (playerArrays.length > 0) {
        // Get the last inner array
        const lastPlayerArray = playerArrays[playerArrays.length - 1];

        // Ensure there is at least one player in the array
        if (lastPlayerArray.length > 0) {
          const playerInfo = lastPlayerArray[0];
          this.eliminatedPlayer = playerInfo;
          this.userName = playerInfo.userName;
          this.greenFlag = playerInfo.greenFlag;
          this.uniquePlayerId = playerInfo.uniquePlayerId;
        } else {
          // Handle the case when no player is present in the last array
          // You might want to set default values or handle it as per your requirements
          this.eliminatedPlayer = {};
          this.userName = "";
          this.greenFlag = "";
          this.uniquePlayerId = "";
        }
      } else {
        // Handle the case when there are no inner arrays
        // You might want to set default values or handle it as per your requirements
        this.eliminatedPlayer = {};
        this.userName = "";
        this.greenFlag = "";
        this.uniquePlayerId = "";
      }
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
      console.log(data);
    },
  },
};
</script>
<style>
header {
  font-size: 60px;
  font-family: "Lilita One", sans-serif;
}
h1 {
  font-family: "Lilita One", sans-serif;
  font-size: 20px;
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
}

.nextQButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  font-size: 20pt;
  color: black;
  width: 20%;
  border-radius: 15px;
}

lifebouyButton>img,
/*this part selects the img as a direct child of the button*/
lifebouyButton>span {
  /*this part selects the span as a direct child of the button*/
  vertical-align: middle;
  width: 25px;
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
