<template>
  <section class="savedScreen" v-if="saved">
    <div class="saved">
      <header class="savedHeader">{{ uiLabels.saved }}</header>
    </div>
  </section>

  <section class="eliScreen" v-if="!saved">
    <div class="eliminated">
      <header class="eliHeader">{{ uiLabels.eliminated }}</header>
    </div>

    <div class="buttonContainer" v-if="!saved">
      <button class="purpleButton" v-on:click="backToStart">
        {{ uiLabels.backToStart }}
      </button>
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
        saved: false,
        eliminated:false,
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
    this.userInfo.eliminated=true;

    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.uniquePlayerId);
    socket.emit("joinPoll", this.pollId);

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on("dataUpdate", (data) => (this.data = data));
    console.log("You have been eliminated, eliminated: ", this.userInfo.eliminated )
    socket.on("youHaveBeenSaved", () =>{this.savedPlayer()});
  },
  methods: {
    backToStart: function () {
      this.$router.push({
        path: "/",
      });
    },

    savedPlayer: function () {
      this.saved = true;
      this.userInfo.eliminated=false;
      socket.emit("joinDate", { userInfo: this.userInfo, pollId: this.pollId });

      const handleNewQuestion = () => {
        this.$router.push({
          path: "/waitingView/" + this.pollId,
          query: {
            userName: this.userInfo.userName,
            greenFlag: this.userInfo.greenFlag,
            uniquePlayerId: this.userInfo.uniquePlayerId,
            saved: this.saved,
            eliminated:this.userInfo.eliminated,
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
  background: radial-gradient(#ff2d30ff, #cb0505ff, rgb(98, 4, 4));
  color: rgb(254, 240, 252);
  overflow: hidden;
}
.savedScreen {
  background: radial-gradient(
    rgb(255, 187, 211),
    rgb(252, 132, 190),
    rgb(187, 90, 129)
  );
  overflow: hidden;
}
.savedHeader {
  font-size: 100px;
  font-family: "Lilita One", sans-serif;
  vertical-align: center;
  color: #252422;
}
.eliHeader {
  font-size: 100px;
  font-family: "Lilita One", sans-serif;
  vertical-align: center;
  color: rgba(255, 152, 194, 255);
}
.eliminated {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("/black_broken_heart1.png") center/contain no-repeat;
}
.saved {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("/heart_bandaid_png.png") center/contain no-repeat;
}
.buttonContainer {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
}
.purpleButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  border: solid;
  border-color: rgb(94, 13, 87);
  padding: 15px;
  text-align: center;
  font-family: "Lilita One", sans-serif;
  font-size: 15px;
  margin: 7px 5px;
  border-radius: 15px;
}
.purpleButton:hover {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;
}
/* .box {
  padding-top: 100px;
} */
@media screen and (max-width: 50em) {
 
  .eliHeader,
  .savedHeader {
    font-size: 50px;
    text-align: center;
  }
  .eliminated,
  .saved {
    background-size: contain;
  }
}

@keyframes pulsate { 
  0% {
    transform: scale(1);
  }
  10% {
    transform: scale(1.08);
  }
  20% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.15);
  }
  40% {
    transform: scale(1);
  }
  50% {
    transform: scale(1);
  }
  60% {
    transform: scale(1.08);
  }
  70% {
    transform: scale(1);
  }
  80% {
    transform: scale(1.15);
  }
  90% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
}

.eliminated, .saved {
  animation: pulsate 3s infinite;
}


</style>
