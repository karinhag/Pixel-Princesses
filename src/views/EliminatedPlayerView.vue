<template>
  <div class="topPage">
    <header>{{uiLabels.theEliminatedPlayer}}</header>
  </div>

    <!-- {{ namn + greenFlag skicka från choose answerView mha id }} -->

  <div class="saveButton" v-on:click="savePlayer" v-if="!playerSaved">
    <button>
        <img class="theLifebouy" src="/lifebouy1.png" />
      {{ uiLabels.savePlayer }}
    </button>
  </div>
  <router-link to="/createQuestion/">
          <button id="button" > {{ uiLabels.nextQuestion }}</button> 
      </router-link>

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
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on("dataUpdate", (data) => (this.data = data));
  },
  methods: {
    savePlayer: function(){
        this.playerSaved=true;
        // socket.emit("lifelineUsed",{pollId: this.pollId} )
        console.log(this.data, "<- pollID")
    },
  },
};
// createPoll: function () {
//       socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
//     },
</script>
<style>

header{
    font-size: 60px;
}

button {
  /* The button*/
  
  font-family: "Bungee Inline", sans-serif;
  font-size: 20pt;
  color: black;
  width:20%;
}
button > img, /*this part selects the img as a direct child of the button*/
      button > span {
  /*this part selects the span as a direct child of the button*/
   vertical-align: middle; 
  width:25%;
}
button:hover{
    background: rgb(243, 204, 221);
   
  cursor: grab;

}
</style>
