<template>
  <section class="pollBody">
    <section
      class="waitingForStart"
      v-if="
        !this.showInputBox && !this.answerSubmitted && !this.goingToNextRound
      "
    >
      <h1>{{ uiLabels.waitingForGame }}</h1>
      pollId: {{ this.pollId }}
      <button class="purpleButton" v-on:click="abandonDate" type="submit">
        {{ uiLabels.abandonDate }}
      </button>
    </section>
    <section
      class="answerQuestion"
      v-if="
        this.showInputBox && !this.answerSubmitted && !this.goingToNextRound
      "
    >
      {{ (this.userInformation, this.userFlag) }}
      {{ this.question }}
      pollId: {{ this.pollId }}
      <p>
        {{ uiLabels.answer }}<input type="text" v-model="userInfo.answer" />
      </p>

      <button class="purpleButton" v-on:click="submitAnswer" type="submit">
        {{ uiLabels.sendAnswer }}
      </button>

      <button class="purpleButton" v-on:click="abandonDate" type="submit">
        {{ uiLabels.abandonDate }}
      </button>
    </section>
    <section
      v-if="this.answerSubmitted && !this.goingToNextRound"
      class="waitingForChoice"
    >
      <h1>{{ uiLabels.waitingForChoice }}</h1>

      <div class="infinity">
        <l-infinity
          size="400"
          stroke="20"
          stroke-length="0.15"
          bg-opacity="0.3"
          speed="1.8"
          color="#f5f5f5; ;"
        ></l-infinity>
      </div>
    </section>

    <section v-if="this.goingToNextRound">
      <h1>YOU SURVIVED, MADE IT TO NEXT ROUND</h1>
    </section>
  </section>
</template>

<script>
// @ is an alias to /src
import { infinity } from "ldrs"; //måste importera package för att använda i think; koden; npm install ldrs

import QuestionComponent from "@/components/QuestionComponent.vue";
import io from "socket.io-client";
const socket = io("localhost:3000");
infinity.register();
export default {
  name: "PollView",
  components: {
    QuestionComponent,
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en", //Löser språkinställning
      uiLabels: {},

      userInfo: {
        userName: "",
        greenFlag: "",
        uniquePlayerId: "",
      },
      userInformation: {},
      userFlag: "",
      userCreated: false,
      question: "",

      pollId: "inactive poll",
      showInputBox: false,
      submittedAnswers: {},
      answerSubmitted: false,
      eliminatedPlayer: {},
      goingToNextRound: false,
    };
  },
  created: function () {
    this.id = this.$route.params.id;
    this.pollId = this.$route.params.pollId;

    this.userInfo.userName = this.$route.query.userName;
    this.userInfo.greenFlag = this.$route.query.greenFlag;
    this.userInfo.uniquePlayerId = this.$route.query.uniquePlayerId;

    this.showInputBox = false;
    socket.on("pollsId", (pollId) => {
      this.pollId = pollId;
    });

    socket.emit("pageLoaded", this.lang); //Löser språkinställning
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.emit("joinPoll", this.pollId);

    socket.on("newQuestion", (q) => {
      this.question = q;
      if (this.question.length > 0) {
        this.showInputBox = true;
      }
    });

    socket.on("dataUpdate", (answers) => (this.submittedAnswers = answers));
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });

    socket.on("hejKomOKyssMig", (data) => {
      this.getPlayer(data);
    });
    socket.on("newQuestionIncoming", ()=>this.resetPage());
  },
  methods: {
    submitAnswer: function () {
      socket.emit("submitAnswer", {
        pollId: this.pollId,
        userInfo: this.userInfo,
      });
      this.answerSubmitted = true;
    },
    abandonDate: function () {
      this.userCreated = false;
      socket.emit("removePlayer", {
        pollId: this.pollId,
        userInfo: this.userInfo,
      });
    },
    getPlayer: function (data) {
      this.eliminatedPlayer = data;
      console.log("Mitt userId:", this.userInfo.uniquePlayerId)
      console.log("Eliminerad spelare;", this.eliminatedPlayer)
      if (
        this.userInfo.uniquePlayerId == this.eliminatedPlayer.uniquePlayerId
      ) {
   
        this.eliminated = true;
        this.$router.push({
          path: "/youAreEliminated/" + this.pollId,
          query: {userName: this.userInfo.userName, greenFlag: this.userInfo.greenFlag, uniquePlayerId: this.userInfo.uniquePlayerId},
        });
        this.goingToNextRound = false;
      } else {
        this.goingToNextRound = true;
      }
    },
    nextQuestion: function (data) {
      this.question = data;
      if (this.question.length > 0) {
        this.showInputBox = true;
        this.resetPage();
      }
    },
    resetPage: function () {
      this.answerSubmitted = false;
      this.goingToNextRound = false;
      this.answerSubmitted = false;
      this.question="";
      this.userInfo.answer="";
     
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");

/* .infinity{
    padding-top:10%;
  
  } */
#roomId {
  padding: 0%;
  margin: 0%;
  padding: 20px;
  text-align: left;
  padding-top: 20px;
}

header,
h1 {
  letter-spacing: 2.5px;
  margin: 50px;
  font-size: 60px;
  color: #f5f5f5;
}

.pollBody {
  /* background: linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%); */
  /* background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='2400' height='1600' preserveAspectRatio='none' viewBox='0 0 2400 1600'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1136%26quot%3b)' fill='none'%3e%3crect width='2400' height='1600' x='0' y='0' fill='rgba(241%2c 93%2c 209%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c1070.01C198.109%2c1074.75%2c277.857%2c798.387%2c449.964%2c700.157C636.906%2c593.46%2c949.748%2c670.351%2c1041.438%2c475.609C1132.769%2c281.629%2c908.491%2c81.629%2c836.227%2c-120.231C780.377%2c-276.239%2c771.22%2c-449.042%2c664.915%2c-576.152C557.63%2c-704.434%2c388.729%2c-746.255%2c243.429%2c-829.044C47.872%2c-940.469%2c-118.309%2c-1201.098%2c-336.756%2c-1146.886C-552.351%2c-1093.382%2c-552.255%2c-772.125%2c-689.557%2c-597.505C-817.56%2c-434.711%2c-1044.287%2c-355.438%2c-1112.741%2c-159.988C-1185.844%2c48.738%2c-1208.774%2c316.467%2c-1069.962%2c488.635C-928.682%2c663.864%2c-634.115%2c571.487%2c-436.336%2c678.952C-261.175%2c774.127%2c-199.291%2c1065.242%2c0%2c1070.01' fill='%23e714b9'%3e%3c/path%3e%3cpath d='M2400 2531.571C2587.782 2530.002 2805.319 2573.893 2945.783 2449.255 3086.44 2324.446 3045.223 2098.384 3093.127 1916.541 3131.654 1770.2930000000001 3197.332 1636.224 3199.802 1485.006 3202.62 1312.505 3191.8869999999997 1137.171 3108.323 986.235 3013.42 814.817 2884.274 645.326 2699.242 580.874 2511.658 515.5329999999999 2307.726 580.892 2118.55 641.469 1933.136 700.842 1722.417 759.059 1621.972 925.835 1523.557 1089.24 1634.216 1297.201 1609.685 1486.37 1585.653 1671.69 1435.512 1838.637 1480.066 2020.12 1526.502 2209.272 1678.094 2363.785 1848.3229999999999 2458.427 2013.804 2550.429 2210.671 2533.1530000000002 2400 2531.571' fill='%23f8aae7'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1136'%3e%3crect width='2400' height='1600' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e"); */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='900' preserveAspectRatio='none' viewBox='0 0 1440 900'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1160%26quot%3b)' fill='none'%3e%3crect width='1440' height='900' x='0' y='0' fill='rgba(255%2c 162%2c 187%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c697.894C128.133%2c689.825%2c212.215%2c567.678%2c320.78%2c499.144C430.467%2c429.902%2c571.795%2c402.362%2c641.472%2c292.95C714.355%2c178.503%2c737.162%2c30.239%2c703.02%2c-101.079C670.128%2c-227.59%2c565.848%2c-321.225%2c461.365%2c-399.775C371.374%2c-467.43%2c256.499%2c-475.284%2c151.439%2c-515.755C34.473%2c-560.813%2c-69.237%2c-680.092%2c-191.196%2c-651.155C-312.662%2c-622.335%2c-353.361%2c-471.372%2c-434.713%2c-376.681C-515.635%2c-282.491%2c-640.748%2c-217.187%2c-668.097%2c-96.058C-695.928%2c27.209%2c-636.254%2c151.74%2c-579.513%2c264.655C-524.396%2c374.338%2c-446.157%2c467.751%2c-347.841%2c541.251C-243.889%2c618.965%2c-129.533%2c706.052%2c0%2c697.894' fill='%23ff4275'%3e%3c/path%3e%3cpath d='M1440 1566.147C1565.594 1556.467 1701.23 1533.641 1789.402 1443.6799999999998 1873.388 1357.99 1858.415 1221.444 1891.022 1105.975 1917.901 1010.79 1958.2820000000002 923.358 1964.216 824.629 1971.3609999999999 705.758 1985.774 581.005 1928.863 476.398 1866.396 361.578 1768.272 237.39300000000003 1638.126 225.24400000000003 1505.868 212.89800000000002 1416.011 355.91700000000003 1298.337 417.541 1208.717 464.473 1110.943 484.405 1029.2640000000001 544.095 928.482 617.745 797.511 681.915 769.97 803.664 742.388 925.594 844.937 1034.442 892.157 1150.192 941.74 1271.733 949.636 1420.966 1054.182 1500.344 1160.237 1580.867 1307.234 1576.379 1440 1566.147' fill='white'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1160'%3e%3crect width='1440' height='900' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
  /* //https://bgjar.com/simple-shiny hemsidan för att skapa! */
  min-height: 100vh;
  font-family: "Lilita One", sans-serif;
}

input {
  font-family: "Lilita One", sans-serif;
  caret-color: #f06af0;
  font-size: 40px;
  color: #ff81bee8;
  /* padding:10px;  */
}

.waitingForStart {
  font-size: 40px;
  font-weight: bold;
  margin: 0px;
}

h1 {
  margin: 0px;
  padding: 20px;
}

.purpleButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  border: solid;
  border-color: rgb(94, 13, 87);
  padding: 15px;
  text-align: center;
  display: inline-block;
  font-size: 15px;
  margin: 7px 5px;
  border-radius: 15px;
}

button:hover:enabled {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;
}
</style>
