<template>
    <section class="winnerBody">
      <div class="winnerBox">
        <div class="headerContainer">
          <header class="congratsHeader">{{ uiLabels.congrats }}</header>
          <header class="winnerHeader">{{ uiLabels.winner }}</header>
        </div>
      </div>
        <div class="buttonContainer">
        <button class="purpleButton" v-on:click="backToStart">{{ uiLabels.backToStart }}</button>
      
      </div>
      
    </section>
  </template>

  <script>
  import io from "socket.io-client";
  const socket = io(sessionStorage.getItem("dataServer"));
  
  export default {
    name: "WinnerView",
    data: function () {
      return {
        lang: localStorage.getItem("lang") || "en",
        pollId: "",
        data: {},
        uiLabels: {},
        uniquePlayerId: "",
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
      socket.on("results", () => this.savedPlayer()); 
    },
    methods: {
      backToStart: function(){
      this.$router.push({
            path: "/",
          })
    },
    }
  }
  </script>
  
  
  <style>
  @import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");


.headerContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%; 
}
  .congratsHeader{
    font-size: 100px;
    font-family: "Lilita One", sans-serif;
    vertical-align: center;
    color:rgb(99, 15, 92);
    text-align: center;

  }
  .winnerHeader{
    font-size: 50px;
    font-family: "Lilita One", sans-serif;
    vertical-align: center;
    color:rgb(99, 15, 92);
    text-align: center;


  }
  .winnerBody{
    overflow: hidden;
    background-size: contain;
    background: radial-gradient(
    rgb(245, 193, 211),
    rgb(255, 163, 187),
    rgb(243, 108, 155)  );
    

  }
  
  .winnerBox {
    height:100vh;
    background-image: url("https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/34216/heart-arrow-clipart-xl.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}
  
  .buttonContainer{
    position: fixed;
    bottom: 2rem;
    right: 2rem;
  }
  
  .purpleButton {
    font-family: "Lilita One", sans-serif;
    background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
    border: solid;
    border-color: rgb(94, 13, 87);
    padding: 15px;
    text-align: center;
    font-size: 15px;
    margin: 7px 5px;
    border-radius: 15px;
  }
  
  .purpleButton:hover {
    background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
    cursor: pointer;
  }
  @media screen and (max-width: 89em) {
  .congratsHeader{
    font-size:2em;
  }
  .winnerHeader {
    font-size:1em;
  }
  
}


@keyframes pulsate { 
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(2deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.headerContainer{
  animation: pulsate 2.2s infinite; 
}
.winnerBox {
  animation: spin 3s infinite;
  transform-origin: center center;
  backface-visibility: hidden;
}  


  </style>