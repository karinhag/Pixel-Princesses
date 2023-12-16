<template>
  <section class="createViewBody">
    <header>{{ uiLabels.joinedRoom }}</header>
    <div class="thePollId">{{ this.pollId }}</div>
    <button class="purpleButton" v-on:click="createPoll">
      {{ uiLabels.startGame }}
    </button>
    <div class="playerContainer">
    <section class="activePlayers">
    <div class="onePlayer" v-for="(player) in playersData">
      {{ getName(player) }}
    </div>
  </section>
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
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      clients: {},
      playersData: null,
    };
  },

  created: function () {
    this.pollId = this.getPollId(); //detta är det pollID som ska skickas till alla views för denna!
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);

    socket.on("addedPlayer", (data) => this.playersData = data);
    socket.on("removedPlayer", (data) => this.playersData = data);

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
//     getRandomPosition: function () {
//   const container = document.querySelector('.playerContainer');
//   const containerRect = container.getBoundingClientRect();

//   let position;
//   do {
//     position = {
//       top: Math.random() * (containerRect.height - 200),
//       left: Math.random() * (containerRect.width - 200),
//     };
//   } while (this.checkOverlap(position));

//   return position;
// },
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
// getActivePlayers: function (data) {
//   this.playersData = this.playersData || [];

//   data.forEach((newPlayer) => {
//     const existingPlayer = this.playersData.find(
//       (player) => player.userName === newPlayer.userName
//     );

//     if (!existingPlayer) {
//       const position = this.getRandomPosition();
//       newPlayer.style = {
//         position: 'absolute',
//         top: position.top + 'px',
//         left: position.left + 'px',
//       };
//       this.playersData.push(newPlayer);
//     } else {
//       newPlayer.style = existingPlayer.style;
//     }
//   });

//   // Remove players that are not in the updated data
//   const playersToRemove = this.playersData.filter(
//     (player) => !data.some((newPlayer) => newPlayer.userName === player.userName)
//   );

//   playersToRemove.forEach((playerToRemove) => {
//     const index = this.playersData.indexOf(playerToRemove);
//     if (index !== -1) {
//       this.playersData.splice(index, 1);
//     }
//   });
// },


    getName: function (playerData) {
      return playerData.userName;
    },
    getGreenFlag: function (playerData) {
      return playerData.greenFlag;
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");

header {
  font-size: 50px;
  font-family: "Lilita One", sans-serif;
  vertical-align: center;
  padding: 20px;
  color: rgb(255, 201, 227);
}
.thePollId {
  font-family: "Lilita One", sans-serif;

  font-size: 100px;
  color: rgb(202, 28, 135);
 
}

.onePlayer {
  background-image: url("https://www.freeiconspng.com/thumbs/heart-png/heart-png-15.png");
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  padding: 50px;
  margin-bottom: 10px; /* Add margin to separate players */
}

.createViewBody {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='2560' height='1660' preserveAspectRatio='none' viewBox='0 0 2560 1660'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1002%26quot%3b)' fill='none'%3e%3crect width='2560' height='1660' x='0' y='0' fill='rgba(255%2c 96%2c 154%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c1015.008C193.108%2c1007.288%2c396.63%2c970.29%2c540.993%2c841.801C678.523%2c719.394%2c699.722%2c520.225%2c753.686%2c344.197C800.714%2c190.793%2c849.113%2c39.721%2c835.904%2c-120.185C822.105%2c-287.234%2c788.277%2c-461.276%2c676.811%2c-586.46C565.905%2c-711.014%2c385.097%2c-726.122%2c233.83%2c-796.352C50.64%2c-881.403%2c-105.21%2c-1062.629%2c-306.211%2c-1042.858C-511.238%2c-1022.691%2c-707.453%2c-877.804%2c-801.511%2c-694.513C-891.935%2c-518.304%2c-789.976%2c-310.61%2c-783.552%2c-112.658C-778.437%2c44.947%2c-800.635%2c196.362%2c-767.597%2c350.55C-726.888%2c540.539%2c-716.431%2c759.031%2c-569.525%2c886.198C-419.323%2c1016.218%2c-198.501%2c1022.944%2c0%2c1015.008' fill='%23ff2876'%3e%3c/path%3e%3cpath d='M2560 2757.432C2768.486 2763.5299999999997 2967.292 2679.55 3142.55 2566.466 3317.581 2453.529 3472.843 2305.842 3555.92 2114.822 3638.2 1925.636 3632.366 1714.24 3601.938 1510.192 3571.635 1306.983 3528.598 1091.6660000000002 3381.893 947.826 3238.832 807.559 3025.559 777.701 2827.067 750.454 2651.163 726.308 2483.824 778.781 2307.5860000000002 800.356 2091.185 826.847 1835.5839999999998 746.079 1673.326 891.693 1511.823 1036.629 1544.54 1294.789 1516.812 1510.012 1489.499 1722.014 1421.598 1944.9180000000001 1512.725 2138.274 1603.563 2331.018 1815.525 2424.58 1998.9450000000002 2533.0190000000002 2175.918 2637.647 2354.5 2751.422 2560 2757.432' fill='%23ff98be'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1002'%3e%3crect width='2560' height='1660' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
   background-size: cover;
  min-height: 100vh;

}
.activePlayers {
  font-family: "Lilita One", sans-serif;
  font-size: 40px;
  color: rgb(255, 195, 255);
  overflow-y: auto;
  max-height: 400px;

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
 }

 .playerContainer {
  position: relative; /* Ensure positioning context for absolute positioning */
  height: 400px; /* Adjust the height as needed */

}
</style>
