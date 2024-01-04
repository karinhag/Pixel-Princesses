<template>
  <section class="pollBody">
    <section
      class="enteringDetails"
      v-if="!this.userCreated && !this.answerSubmitted"
    >
      <div>
        <p id="roomId">{{ uiLabels.joinedRoom }} {{ this.pollId }}</p>
        <header>{{ uiLabels.theHeader }}</header>

        <QuestionComponent v-bind:question="question" />
        <p class="inputText">
          {{ uiLabels.userName }} <br />
          <input type="text" v-model="userInfo.userName" />
        </p>
<section class="greenFlag">
        <p class="inputText">
          {{ uiLabels.greenFlag }} <br />
          <input type="text" v-model="userInfo.greenFlag" />
        </p>

        <button v-on:click="getInfo" class="buttonInfo" v-if="!info">?</button>
      <button v-on:click="closeInfo" class="buttonClose" v-if="info">x</button>
      <section v-if="info"> {{ uiLabels.greenFlagInfo }}</section>
      
      
      
      </section>
      </div>
      <button
        class="purpleButton"
        v-on:click="joinDate"
        type="submit"
        :disabled="!userInfo.userName || !userInfo.greenFlag"
      >
        {{ uiLabels.participatePoll }}
      </button>
    </section>
  </section>

</template>

<script>
import QuestionComponent from "@/components/QuestionComponent.vue";
import io from "socket.io-client";
const socket = io("localhost:3000");
export default {
  name: "PollView",
  components: {
    QuestionComponent,
  },
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      uiLabels: {},

      userInfo: {
        userName: "",
        greenFlag: "",
        uniquePlayerId: this.getPlayerId(),
      },
      userCreated: false,
      question: "",

      pollId: "inactive poll",
      showInputBox: false,
      submittedAnswers: {},
      answerSubmitted: false,
      eliminatedPlayer: {},
      info: false,
    };
  },
  created: function () {
    this.pollId = this.$route.params.id;
    this.id = this.$route.params.id;
    this.showInputBox = false;

    socket.emit("pageLoaded", this.lang);
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

  },
  methods: {
    getPlayerId: function () {
      return "" + Math.floor(Math.random() * 100000);
    },

    joinDate: function () {
      socket.emit("joinDate", {
        userInfo: this.userInfo,
        pollId: this.pollId,
        uniquePlayerId:this.uniquePlayerId,
      });
      this.userCreated = true;
      this.$router.push({
        path: "/answerQuestion/" + this.pollId,
        query: {
          userName: this.userInfo.userName,
          greenFlag: this.userInfo.greenFlag,
          uniquePlayerId: this.userInfo.uniquePlayerId,
        },
      });
    },

    abandonDate: function () {
      this.userCreated = false;
      socket.emit("removePlayer", {
        pollId: this.pollId,
        userInfo: this.userInfo,
      });
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

.infinity {
  padding-top: 10%;
}
#roomId {
  padding: 0%;
  margin: 0%;
  text-align: right;
  padding-right: 1em;
  padding-top: 1em;
  color: rgb(202, 28, 135);
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
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='2560' height='1660' preserveAspectRatio='none' viewBox='0 0 2560 1660'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1035%26quot%3b)' fill='none'%3e%3crect width='2560' height='1660' x='0' y='0' fill='rgba(255%2c 152%2c 194%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c867.804C159.224%2c848.745%2c300.527%2c760.103%2c419.118%2c652.16C525.197%2c555.605%2c577.582%2c421.44%2c634.872%2c289.936C691.154%2c160.746%2c769.106%2c31.78%2c750.225%2c-107.866C731.291%2c-247.908%2c621.983%2c-352.076%2c533.203%2c-462.023C441.244%2c-575.906%2c355.65%2c-697.945%2c223.284%2c-760.437C78.208%2c-828.93%2c-93.352%2c-885.653%2c-243.306%2c-828.626C-391.814%2c-772.149%2c-432.785%2c-585.057%2c-541.804%2c-469.475C-657.472%2c-346.844%2c-874.009%2c-295.91%2c-902.489%2c-129.758C-930.859%2c35.751%2c-745.84%2c156.012%2c-675.124%2c308.319C-605.015%2c459.319%2c-617.16%2c654.63%2c-488.974%2c760.859C-357.854%2c869.52%2c-169.086%2c888.044%2c0%2c867.804' fill='%23ff5fa0'%3e%3c/path%3e%3cpath d='M2560 2587.05C2740.792 2612.359 2945.781 2595.084 3085.219 2477.256 3221.997 2361.675 3228.733 2158.964 3272.178 1985.241 3308.194 1841.222 3322.566 1699.529 3316.809 1551.187 3310.42 1386.5430000000001 3316.298 1217.87 3236.799 1073.55 3147 910.533 3027.262 725.204 2843.984 692.839 2659.814 660.317 2504.084 823.225 2341.374 915.429 2214.268 987.457 2098.74 1067.2649999999999 1997.453 1172.55 1891.076 1283.126 1798.892 1400.782 1738.679 1541.912 1662.382 1720.741 1519.135 1921.641 1603.019 2097.0389999999998 1687.213 2273.084 1947.789 2253.404 2121.485 2342.343 2273.559 2420.2110000000002 2390.799 2563.3630000000003 2560 2587.05' fill='%23ffd1e4'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1035'%3e%3crect width='2560' height='1660' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
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
.purpleButton, .gFInfo {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  border-color: rgb(94, 13, 87);
  padding: 15px;
  text-align: center;
  display: inline-block;
  font-size: 20px;
  margin: 7px 5px;
  border-radius: 15px;
  font-family: "Lilita One", sans-serif;
}



.purpleButton:disabled {
  cursor: not-allowed;
}

button:hover:enabled {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;
}
.inputText {
  font-size: x-large;
  text-align: center;
}
button:hover:enabled{
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  transform: scale(1.01);
  transition: all 0.3s ease;
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

</style>
