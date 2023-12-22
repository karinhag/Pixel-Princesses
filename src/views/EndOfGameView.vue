<template>
  <section class="endOfGameBody">
    <div class="perfectMatch">
      <!-- loopar över gifen-->
      <img
        v-for="index in 5"
        :key="index"
        src="https://media0.giphy.com/media/nR8frZBepl4VW/giphy.gif?cid=ecf05e47k7wzswsfziaaor2m2rrvq3jh21i1yhtc5nvou67d&ep=v1_gifs_related&rid=giphy.gif&ct=s"
      />
<section class="winner">
      <header>
        {{ uiLabels.perfectMatch }}
      </header>

<h2 id="userName">{{ this.userName }}</h2>
<h1 id="hasGreenFlag">{{ uiLabels.hasGreenFlag }}</h1>
<h3 id="GreenFlag">{{ this.greenFlag }}</h3>
</section>
  </div>


    <div class="buttonContainer">
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
  name: "EndOfGameView",
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      data: {},
      uiLabels: {},
      userName: "",
      greenFlag: "",
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);

    socket.emit("getMatchedPlayer", this.pollId);
    socket.on("returnMatchedPlayer", (data) => this.handleMatch(data));

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on("dataUpdate", (data) => (this.data = data));
  },

  methods: {
    backToStart: function () {
      this.$router.push({
        path: "/",
      });
    },
    handleMatch: function (d) {
      this.userName = d[0][0].userName;
      this.greenFlag = d[0][0].greenFlag;
    },
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");


header{
    font-size: 65px;
    font-family: "Lilita One", sans-serif;
    vertical-align: center;
    color:rgb(254, 221, 255);
}

.endOfGameBody{
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='2560' height='1660' preserveAspectRatio='none' viewBox='0 0 2560 1660'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1017%26quot%3b)' fill='none'%3e%3crect width='2560' height='1660' x='0' y='0' fill='rgba(255%2c 96%2c 154%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c795.774C147.627%2c793.579%2c203.177%2c588.894%2c331.237%2c515.415C469.956%2c435.82%2c675.82%2c480.267%2c772.245%2c352.672C868.724%2c225.006%2c845.708%2c39.4%2c808.6%2c-116.259C773.351%2c-264.12%2c670.786%2c-380.114%2c570.353%2c-494.214C470.651%2c-607.484%2c375.925%2c-746.91%2c227.862%2c-776.026C81.854%2c-804.738%2c-46.376%2c-686.113%2c-188.957%2c-643.53C-330.67%2c-601.206%2c-497.976%2c-625.764%2c-607.617%2c-526.503C-720.588%2c-424.228%2c-745.345%2c-260.817%2c-776.471%2c-111.64C-809.417%2c46.259%2c-884.551%2c229.34%2c-793.042%2c362.17C-699.666%2c497.709%2c-482.041%2c446.4%2c-337.628%2c525.36C-208.498%2c595.963%2c-147.155%2c797.962%2c0%2c795.774' fill='%23ff2876'%3e%3c/path%3e%3cpath d='M2560 2645.255C2735.898 2598.831 2844.145 2435.69 2982.876 2318.008 3101.32 2217.534 3234.212 2137.451 3315.006 2004.8 3402.9719999999998 1860.375 3461.634 1699.313 3462.703 1530.211 3463.883 1343.616 3436.0969999999998 1147.433 3321.359 1000.278 3204.3469999999998 850.206 3013.317 790.149 2834.632 724.689 2644.561 655.057 2446.403 554.749 2251.169 608.22 2055.116 661.915 1937.488 851.633 1805.786 1006.47 1675.274 1159.908 1476.363 1304.7060000000001 1487.682 1505.824 1499.205 1710.576 1777.799 1791.789 1860.5430000000001 1979.431 1945.1309999999999 2171.255 1812.52 2442.275 1964.368 2586.821 2111.852 2727.2129999999997 2363.121 2697.217 2560 2645.255' fill='%23ff98be'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1017'%3e%3crect width='2560' height='1660' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
  min-height: 100vh;
}

/* gifen */
.perfectMatch img{
  height: 10rem;
  margin-bottom: 0.4rem;
  background-repeat: no-repeat;
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
#hasGreenFlag {
  font-family: "Lilita One", sans-serif;
  font-size: 25px;
  color:rgb(254, 221, 255);

}

#userName {
  font-family: "Lilita One", sans-serif;
  font-size: 50px;
  color: rgb(255, 195, 255);
  background-image: url("https://www.freeiconspng.com/thumbs/heart-png/heart-png-15.png");
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  padding: 50px;
  margin-bottom: 10px;

}

#greenFlag {
  font-family: "Lilita One", sans-serif;
  font-size: 50px;
  color:rgb(116, 196, 116);

}
@media screen and (max-width: 89.8em) {
  .perfectMatch img{
    width:0;
    height:0;
/* tar bort gifen vid små skärmar - skulle kke kunna lösa det på annat sätt om vi vill */

  }
}

.winner{
  text-transform:uppercase;
  letter-spacing: 5px;
}
</style>
