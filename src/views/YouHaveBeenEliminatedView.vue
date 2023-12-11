<template>
<section class="savedScreen" v-if="saved"> <!--Ta emot denna information från andra views-->
  <div class="box">
    <header> {{ uiLabels.saved }}</header>
  <div class="saved">
</div>
</div>
</section>


<section class="eliScreen" v-if="!saved">
    <div class="box">
    <div class="eliminated">
<header> {{ uiLabels.eliminated }}</header>
</div>
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
      data: {},
      uiLabels: {},
      uniquePlayerId: "",
      saved:false
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    this.uniquePlayerId = this.$route.query.uniquePlayerId;
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.uniquePlayerId);

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on(
      "dataUpdate",
      (data) => (this.data = data),
  
    );
    socket.on("youHaveBeenSaved", () => this.savedPlayer());
  },
  methods: {
    eliminatePlayer: function () {
      this.$router.push("/eliminatedPlayer/" + this.pollId);
      socket.emit("eliminatedPlayer", {
        pollId: this.pollId,
        uniquePlayerId: this.chosenAnswer[0].playerID,
      });
    },
    savedPlayer: function(){
      console.log("Jag har räddats!!!!")
      this.saved=true
    }
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");

.eliScreen{
    height: 1080px;
    background: radial-gradient(#FF2D30ff, #CB0505ff, rgb(98, 4, 4));
    color:rgb(254, 240, 252);
    font-size: 30px;
}
.savedScreen{
    height: 1080px;
    background: radial-gradient(rgb(255, 187, 226), rgb(252, 132, 216), rgb(187, 90, 144));
    color:rgb(254, 240, 252);
    font-size: 30px;
}
header{
    font-size: 100px;
    font-family: "Lilita One", sans-serif;
    vertical-align: center;
}
.eliminated{   
    padding:15%;
    background-image: url("/black_broken_heart1.png");
    background-size: contain; /* Ensure the entire image fits within the box */
    background-position: center;
    background-repeat: no-repeat;}
.saved{   
    padding:15%;
    background-image: url("/heart_bandaid_png.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;}


.box{
    padding-top:100px;
}
</style>