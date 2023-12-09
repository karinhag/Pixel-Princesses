<template>
<section class="screen">
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
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    socket.emit("pageLoaded", this.lang, console.log("Hello 1"));
    socket.emit("joinPoll", this.pollId,console.log("Hello 2"));


    socket.on("init", (labels) => {
      this.uiLabels = labels; console.log("Hello 3")
    });
    socket.on("dataUpdate", (data) => (this.data = data), console.log("Hello 4"));
  },
  methods: {
 
   
    eliminatePlayer: function () {
      this.$router.push("/eliminatedPlayer/" + this.pollId);
      socket.emit("eliminatedPlayer", {pollId: this.pollId, uniquePlayerId: this.chosenAnswer[0].playerID}) 
    },
  },
};


</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");
template{
    background-color: red;
}
.screen{
    height: 1080px;
    background: radial-gradient(#FF2D30ff, #CB0505ff, rgb(98, 4, 4));
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


.box{
    padding-top:100px;
}
</style>