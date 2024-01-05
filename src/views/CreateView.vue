<template>
  <section class="createViewBody">
    <div class="theButton">
      <button v-on:click="getInfo" class="buttonInfo" v-if="!info">i</button>
      <button v-on:click="closeInfo" class="buttonClose" v-if="info">x</button>
      <section v-if="info">{{ uiLabels.minimumPlayers }}</section>
    </div>
    <header class="roomHeader">{{ uiLabels.joinedRoom }}</header>
    <div class="thePollId">{{ this.pollId }}</div>
    <button
      class="purpleButton"
      v-on:click="createPoll"
      :disabled="!moreThanThreePlayers"
    >
      {{ uiLabels.startGame }}
    </button>

    <div class="playerContainer">
      <section class="activePlayers">
        <div class="onePlayer" v-for="player in playersData">
          {{ getName(player) }}
        </div>
      </section>
    </div>
    <div class="information"></div>
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
      clients: {},
      playersData: null,
      info: false,
      moreThanThreePlayers: false,
    };
  },

  created: function () {
    this.pollId = this.getPollId(); //detta är det pollID som ska skickas till alla views för denna!
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);

    socket.on(
      "addedPlayer",
      (data) => ((this.playersData = data), this.checkNumberOfPlayers())
    );
    socket.on("removedPlayer", (data) => (this.playersData = data));

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.on("dataUpdate", (data) => (this.data = data));
    socket.on("pollCreated", (data) => (this.data = data));
  },

  methods: {
    createPoll: function () {
      socket.emit("createPoll", { pollId: this.pollId, lang: this.lang });
      this.$router.push("/createQuestion/" + this.pollId);
    },
    addQuestion: function () {
      socket.emit("addQuestion", {
        pollId: this.pollId,
        q: this.question,
        a: this.answers,
      });
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {
        pollId: this.pollId,
        questionNumber: this.questionNumber,
      });
    },
    getPollId: function () {
      return "" + Math.floor(Math.random() * 100000);
    },
    checkOverlap: function (newPosition) {
      return this.playersData.some((player) => {
        const playerRect = {
          top: parseFloat(player.style.top),
          left: parseFloat(player.style.left),
          width: 200,
          height: 200,
        };

        const overlap =
          newPosition.left < playerRect.left + playerRect.width &&
          newPosition.left + 200 > playerRect.left &&
          newPosition.top < playerRect.top + playerRect.height &&
          newPosition.top + 200 > playerRect.top;

        return overlap;
      });
    },

    checkNumberOfPlayers: function () {
      if (this.playersData.length >= 3) {
        this.moreThanThreePlayers = true;
      }
    },

    getName: function (playerData) {
      return playerData.userName;
    },
    getGreenFlag: function (playerData) {
      return playerData.greenFlag;
    },

    getInfo: function () {
      this.info = true;
    },
    closeInfo: function () {
      this.info = false;
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");
@import url("https://unpkg.com/css.gg@2.0.0/icons/css/info.css");
@import url("https://unpkg.com/css.gg@2.0.0/icons/css/close.css");

.roomHeader {
  font-size: 50px;
  font-family: "Lilita One", sans-serif;
  vertical-align: center;
  padding: 20px;
  color: rgb(255, 201, 227);
}
.thePollId {
  font-family: "Lilita One", sans-serif;

  font-size: 100px;
  color: #252422;
}

.onePlayer {
  padding: 100px;
  margin-bottom: 10px;

  @media screen and (min-width: 960px) {
    background-image: url("https://www.freeiconspng.com/thumbs/heart-png/heart-png-15.png");
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    padding: 50px;
    animation: spin 4s infinite linear;
  }
}

@keyframes spin {
  0% {
    rotate: 0deg;
  }
  25% {
    rotate: 18deg;
  }
  50% {
    rotate: 0deg;
  }
  75% {
    rotate: -18deg;
  }
  100% {
    rotate: 0deg;
  }
}

.createViewBody {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1000' height='560' preserveAspectRatio='none' viewBox='0 0 1000 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1023%26quot%3b)' fill='none'%3e%3crect width='1000' height='560' x='0' y='0' fill='rgba(251%2c 100%2c 169%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c202.733C39.944%2c202.83%2c77.402%2c192.485%2c114.954%2c178.871C162.286%2c161.712%2c219.681%2c154.997%2c247.472%2c113.016C275.729%2c70.33%2c266.025%2c13.462%2c257.911%2c-37.082C249.899%2c-86.988%2c231.33%2c-133.773%2c201.321%2c-174.446C169.475%2c-217.609%2c134.362%2c-269.354%2c81.21%2c-276.575C28.081%2c-283.793%2c-13.572%2c-233.784%2c-61.715%2c-210.183C-100.598%2c-191.122%2c-140.475%2c-177.987%2c-174.513%2c-151.216C-215.162%2c-119.246%2c-264.586%2c-89.901%2c-278.112%2c-39.986C-291.963%2c11.13%2c-277.671%2c69.922%2c-245.921%2c112.308C-215.942%2c152.331%2c-161.528%2c161.055%2c-114.594%2c178.312C-77.18%2c192.069%2c-39.863%2c202.636%2c0%2c202.733' fill='%23f92385'%3e%3c/path%3e%3cpath d='M1000 911.396C1087.777 933.049 1174.848 994.597 1260.271 964.99 1347.425 934.7819999999999 1406.96 846.8330000000001 1437.45 759.777 1466.806 675.9590000000001 1450.3899999999999 583.74 1423.433 499.12 1399.378 423.608 1344.025 366.755 1292.946 306.161 1241.123 244.68599999999998 1201.035 160.19400000000002 1122.646 142.30599999999998 1044.534 124.481 977.913 202.00599999999997 899.075 216.27999999999997 806.3050000000001 233.07600000000002 693.06 170.37599999999998 622.466 232.865 553.652 293.779 582.9169999999999 407.66499999999996 579.135 499.489 575.725 582.274 556.162 672.638 601.494 741.992 645.723 809.658 736.563 822.528 810.9590000000001 854.154 872.803 880.444 934.756 895.302 1000 911.396' fill='%23fda5cd'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1023'%3e%3crect width='1000' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
  min-height: 100vh;
}
.activePlayers {
  font-family: "Lilita One", sans-serif;
  font-size: 40px;
  color: rgb(255, 195, 255);
  overflow-y: auto;
  max-height: 400px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  padding: 20px;
}
.buttonInfo,
.buttonClose {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  border: solid;
  border-color: rgb(94, 13, 87);

  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 50px;
  font-family: "Lilita One", sans-serif;
  cursor: pointer;
  font-size: 20px;
}

.theButton {
  padding: 0%;
  margin: 0% 20px 0% 0%;
  text-align: right;
  padding-right: 1em;
  padding-top: 1em;
  color: rgb(202, 28, 135);
  font-size: medium;
}
.theButton section {
  font-family: "Lilita One", sans-serif;
  font-size: 20px;
  color: rgb(255, 201, 227);
}

.purpleButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  border: solid;
  border-color: rgb(94, 13, 87);
  padding: 15px;
  text-align: center;
  display: inline-block;
  font-size: 20px;
  margin: 50px 5px;
  border-radius: 15px;
  font-family: "Lilita One", sans-serif;
}

.purpleButton:hover:enabled {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;
  vertical-align: middle;
  cursor: pointer;
  font-family: "Lilita One", sans-serif;
}

.purpleButton:disabled {
  cursor: not-allowed;
}

.playerContainer {
  position: relative; /* Ensure positioning context for absolute positioning */
  height: 400px; /* Adjust the height as needed */
}

@media screen and (max-width: 50em) {
  
.onePlayer {
  padding: 10px;
  margin-bottom: 10px;
}
.activePlayers {
  max-height: 350px;
}
}
</style>
