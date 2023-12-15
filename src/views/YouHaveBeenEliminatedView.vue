<template>
  <section class="savedScreen" v-if="saved">
    <!--Ta emot denna information från andra views-->
    <div class="box">
      <header>{{ uiLabels.saved }}</header>
      <div class="saved"></div>
    </div>
  </section>

  <section class="eliScreen" v-if="!saved">
    <div class="box">
      <div class="eliminated">
        <header>{{ uiLabels.eliminated }}</header>
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
      saved: false,
      userInfo: {
        userName: "",
        greenFlag: "",
        uniquePlayerId: "",
      },
      uniquePlayerId: "",
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    this.uniquePlayerId = this.$route.query.uniquePlayerId;
    this.userInfo.userName = this.$route.query.userName;
    this.userInfo.greenFlag = this.$route.query.greenFlag;
    this.userInfo.uniquePlayerId = this.$route.query.uniquePlayerId;

    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.uniquePlayerId);
    socket.emit("joinPoll", this.pollId);

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on("dataUpdate", (data) => (this.data = data));
    socket.on("youHaveBeenSaved", () => this.savedPlayer());
  },
  methods: {
    eliminatePlayer: function () {
      this.$router.push("/eliminatedPlayer/" + this.pollId);
      socket.emit("joinDate", {
        userInfo: this.userInfo,
        pollId: this.pollId,
      });
    },

    savedPlayer: function () {
      console.log("SAVE PLAYER ENBART EN G¨NG");
      this.saved = true;
      socket.emit("joinDate", { userInfo: this.userInfo, pollId: this.pollId });

      // Define a function to handle the newQuestionIncoming event
      const handleNewQuestion = () => {
        this.$router.push({
          path: "/answerQuestion/" + this.pollId,
          query: {
            userName: this.userInfo.userName,
            greenFlag: this.userInfo.greenFlag,
            uniquePlayerId: this.userInfo.uniquePlayerId,
          },
        });

        // Remove the event listener after it has been triggered once
        socket.off("newQuestionIncoming", handleNewQuestion);
      };

      // Add the event listener
      socket.on("newQuestionIncoming", handleNewQuestion);
    },
    // savedPlayer: function(){

    //   // console.log("SAVE PLAYER ENBART EN G¨NG")
    //   // this.saved=true
    //   // socket.emit("joinDate", {userInfo: this.userInfo, pollId: this.pollId,});
    //   // socket.on("newQuestionIncoming", ()=> this.$router.push({path:"/answerQuestion/" + this.pollId, query: {userName: this.userInfo.userName, greenFlag: this.userInfo.greenFlag, uniquePlayerId: this.userInfo.uniquePlayerId}}));
    // }
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");

.eliScreen {
  height: 1080px;
  background: radial-gradient(#ff2d30ff, #cb0505ff, rgb(98, 4, 4));
  color: rgb(254, 240, 252);
  font-size: 30px;
}
.savedScreen {
  height: 1080px;
  background: radial-gradient(
    rgb(255, 187, 211),
    rgb(252, 132, 190),
    rgb(187, 90, 129)
  );
  color: rgb(254, 240, 252);
  font-size: 30px;
}
header {
  font-size: 100px;
  font-family: "Lilita One", sans-serif;
  vertical-align: center;
}
.eliminated {
  padding: 15%;
  background-image: url("/black_broken_heart1.png");
  background-size: contain; /* Ensure the entire image fits within the box */
  background-position: center;
  background-repeat: no-repeat;
  background-size: 48%;
}
.saved {
  padding: 15%;
  background-image: url("/heart_bandaid_png.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.box {
  padding-top: 100px;
}
</style>
