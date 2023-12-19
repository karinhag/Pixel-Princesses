<template>
  <section class="savedScreen" v-if="saved">
 
      <div class="saved">
      
      <header class="savedHeader">{{ uiLabels.saved }}</header>
    </div> 
      
  </section>

  <section class="eliScreen" v-if="!saved">
    <div class="box">
      <div class="eliminated">
        <header class="eliHeader">{{ uiLabels.eliminated }}</header>
      </div>
    </div>
  </section>
</template>

<script>
import io from "socket.io-client";
const socket = io("localhost:3000");

export default {
  name: "YouHaveBeenEliminatedView",
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
      this.saved = true;
      socket.emit("joinDate", { userInfo: this.userInfo, pollId: this.pollId });

      const handleNewQuestion = () => {
        this.$router.push({
          path: "/answerQuestion/" + this.pollId,
          query: {
            userName: this.userInfo.userName,
            greenFlag: this.userInfo.greenFlag,
            uniquePlayerId: this.userInfo.uniquePlayerId,
          },
        });

        socket.off("newQuestionIncoming", handleNewQuestion);
      };

      socket.on("newQuestionIncoming", handleNewQuestion);
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");

.eliScreen {
  height: 1080px;
  background: radial-gradient(#ff2d30ff, #cb0505ff, rgb(98, 4, 4));
  color: rgb(254, 240, 252);
}
.savedScreen {
  height: 1080px;
  background: radial-gradient(
    rgb(255, 187, 211),
    rgb(252, 132, 190),
    rgb(187, 90, 129)
  );
}
.savedHeader {
  font-size: 100px;
  font-family: "Lilita One", sans-serif;
  vertical-align: center;
  color:#252422;

}
.eliHeader {
  font-size: 100px;
  font-family: "Lilita One", sans-serif;
  vertical-align: center;
  color:rgba(255,152,194,255);

}
.eliminated {
  padding: 15%;
  background-image: url("/black_broken_heart1.png");
  background-size: contain; 
  background-position: center;
  background-repeat: no-repeat;
  background-size: 48%;
}
.saved {
  padding: 15%;
  padding-top:20%;
  background-image: url("/heart_bandaid_png.png");
  background-size: contain; 
  background-size: 48%;
  background-position: center;
  background-repeat: no-repeat;
}

.box {
  padding-top: 100px;
}
@media screen and (max-width: 50em) {
  .eliHeader,
  .savedHeader{
    font-size:50px;
    text-align:center;
  }
  .eliminated ,
  .saved {
    background-size: contain; 
  }
}
</style>
