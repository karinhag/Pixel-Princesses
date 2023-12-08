<template>
  <div class="topPage">
    <header>{{ uiLabels.theEliminatedPlayer }}</header>
  </div>

  <!-- {{ namn + greenFlag skicka från choose answerView mha id }} -->

  <div class="saveButton" v-on:click="savePlayer" v-if="!playerSaved">
    <button class="lifebouyButton">
        <img class="theLifebouy" src="/lifebouy1.png" />
      {{ uiLabels.savePlayer }}
    </button>
  </div>
  <button class="nextQButton" v-on:click="createQuestion">
{{ uiLabels.nextQuestion }}
</button>

  <div class="lifeBouyUsed" v-if="playerSaved">
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
      playerSaved: false,
    };
  },
  created: function () {
    this.id = this.$route.params.id;
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on("dataUpdate", (data) => (this.data = data));
  },
  methods: {
    savePlayer: function () {
      this.playerSaved = true;
      // socket.emit("lifelineUsed",{pollId: this.pollId} )
    },
  },
};
// createPoll: function () {
//       socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
//     },
</script>
<style>
header {
  font-size: 60px;
}

.lifebouyButton{
  background: radial-gradient(circle at 10% 20%, rgb(255, 200, 124) 0%, rgb(252, 251, 121) 90%);
  font-size: 20pt;
  color: black;
  width:20%;
  border-radius: 15px;
}

.nextQButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  font-size: 20pt;
  color: black;
  width:20%;
  border-radius: 15px;
}
button > img, /*this part selects the img as a direct child of the button*/
      button > span {
  /*this part selects the span as a direct child of the button*/
  vertical-align: middle;
  width: 25%;
}

.lifebouyButton:hover:enabled{
  background: linear-gradient(109.6deg, rgb(255, 207, 84) 11.2%, rgb(255, 158, 27) 91.1%);
  cursor: pointer;
}


.nextQButton:hover:enabled{
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;

}
</style>
