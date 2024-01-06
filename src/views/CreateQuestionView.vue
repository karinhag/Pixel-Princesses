<template>
  <section class="CQVbody">
    <header id="writeQuestion">{{ uiLabels.writeQuestion }}</header>
    <div><textarea v-model="question" rows="3" cols="40"></textarea><br /></div>
    <div>
      {{ uiLabels.hardToDecide}}
      <div class="arrowImg"></div>

      <button class="randomQuestionButton" @click="generateRandomQuestion">
        {{ uiLabels.randomQuestion }}
      </button>
    </div>
    <div>
      <button
        class="purpleButton"
        v-on:click="addQuestion"
        id="submitButton"
        :disabled="!question"
      >
        {{ uiLabels.submitQuestion }}
      </button>
    </div>
  </section>
</template>

<script>
import io from "socket.io-client";
const socket = io("localhost:3000");

export default {
  name: "CreateQuestionView",
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {},
      originalPredefinedQuestions: [
        "Q1",
        "Q2",
        "Q3",
        "Q4",
        "Q5",
        "Q6",
        "Q7",
        "Q8",
        "Q9",
        "Q10",
        "Q11",
        "Q12",
      ],
      predefinedQuestions: [
        "Q1",
        "Q2",
        "Q3",
        "Q4",
        "Q5",
        "Q6",
        "Q7",
        "Q8",
        "Q9",
        "Q10",
        "Q11",
        "Q12",
      ],
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on("dataUpdate", (data) => (this.data = data));
  },
  methods: {
    generateRandomQuestion() {
      const randomIndex = Math.floor(
        Math.random() * this.predefinedQuestions.length
      );
      this.question = this.uiLabels[this.predefinedQuestions[randomIndex]];
      this.predefinedQuestions.splice(randomIndex, 1);
      if (this.predefinedQuestions.length === 0) {
        this.predefinedQuestions = this.originalPredefinedQuestions;
      }
    },

    addQuestion: function () {
      console.log("Innuti createQuestionview, skickar ut addQuestion")
      socket.emit("addQuestion", { pollId: this.pollId, q: this.question });
      this.$router.push("/chooseAnswer/" + this.pollId);
    },
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
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");

textarea {
  padding:18px;
  margin:25px;
  font-family: "Lilita One", sans-serif;
  caret-color: #f06af0;
  font-size: 30px;
  color:#ff81bee8;
}

#writeQuestion {
  font-size: 50px;
  color:#252422;
}

.CQVbody {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='2560' height='1660' preserveAspectRatio='none' viewBox='0 0 2560 1660'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1006%26quot%3b)' fill='none'%3e%3crect width='2560' height='1660' x='0' y='0' fill='rgba(255%2c 96%2c 154%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c1127.616C201.364%2c1077%2c346.9%2c917.218%2c497.825%2c774.631C623.906%2c655.515%2c711.901%2c514.049%2c804.611%2c367.454C912.763%2c196.442%2c1080.556%2c46.035%2c1086.518%2c-156.218C1092.746%2c-367.5%2c968.277%2c-559.585%2c836.819%2c-725.108C701.251%2c-895.806%2c531.866%2c-1039.034%2c326.762%2c-1112.85C114.003%2c-1189.42%2c-130.086%2c-1238.849%2c-336.947%2c-1147.537C-538.366%2c-1058.627%2c-634.463%2c-834.622%2c-740.573%2c-641.71C-828.477%2c-481.896%2c-874.25%2c-309.942%2c-897.189%2c-128.996C-919.782%2c49.218%2c-902.997%2c221.407%2c-872.435%2c398.428C-831.975%2c632.782%2c-872.129%2c920.604%2c-689.652%2c1073.12C-509.057%2c1224.063%2c-228.267%2c1184.994%2c0%2c1127.616' fill='%23ff2876'%3e%3c/path%3e%3cpath d='M2560 2410.197C2715.075 2437.599 2885.9719999999998 2458.265 3021.779 2378.543 3158.889 2298.056 3208.717 2130.973 3278.779 1988.255 3350.867 1841.409 3467.559 1694.583 3436.373 1533.997 3405.325 1374.124 3257.549 1262.432 3120.682 1174.166 3005.879 1100.129 2864.71 1105.047 2730.637 1078.863 2610.552 1055.411 2496.915 1028.4479999999999 2374.561 1028.453 2208.5969999999998 1028.4589999999998 1994.874 950.783 1889.3690000000001 1078.895 1782.954 1208.112 1937.5720000000001 1402.115 1929.1570000000002 1569.298 1921.862 1714.222 1790.083 1852.288 1843.654 1987.144 1897.176 2121.879 2067.573 2158.267 2192.4049999999997 2231.989 2312.08 2302.666 2423.133 2386.0119999999997 2560 2410.197' fill='%23ff98be'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1006'%3e%3crect width='2560' height='1660' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
min-height: 100vh;
  font-family: "Lilita One", sans-serif;
}

.randomQuestionButton {
  background: radial-gradient(
    290px at 8.6% 46.4%,
    rgb(255, 148, 148) 7.8%,
    rgb(255, 223, 155) 32.2%,
    rgb(255, 247, 177) 48.1%,
    rgb(216, 255, 177) 61%,
    rgb(177, 255, 253) 75.3%
  );
  border: solid;
  border-color: rgb(94, 13, 87);
  text-align: center;
  display: inline-block;
  /* font-size: 15px; */
  margin: 7px 5px;
  border-radius: 15px;
  font-family: "Lilita One", sans-serif;
  text-transform: uppercase;
  font-size: 30px;
}

.purpleButton {
  background: linear-gradient(to top, #cd9cf2 0%, #f6f3ff 100%);
  border-color: rgb(94, 13, 87);
  padding: 15px;
  text-align: center;
  display: inline-block;
  /* font-size: 15px; */
  margin: 7px 5px;
  border-radius: 15px;
  font-family: "Lilita One", sans-serif;
  text-transform: uppercase;
  font-size: 30px;
}

.purpleButton:hover:enabled {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;
}

.randomQuestionButton:hover:enabled {
  background: radial-gradient(
    290px at 8.6% 46.4%,
    rgb(250, 112, 112) 7.8%,
    rgb(252, 208, 115) 32.2%,
    rgb(231, 252, 129) 48.1%,
    rgb(188, 249, 127) 61%,
    rgb(104, 232, 228) 75.3%
  );
  cursor: pointer;
}

.arrowImg {
  background-image: url("https://media1.giphy.com/media/3cnI4Mx8T8yCbTW4r1/giphy.gif?cid=ecf05e4728af6szxy69nnokhwhhpsuhsho6ov6j0i8cb02y9&ep=v1_stickers_search&rid=giphy.gif&ct=s");
  width:100px;
  height:50px;
  background-size: 100%;
  margin: 0 auto;
}
@media screen and (max-width: 50em) {
  textarea {
    width: 60%;
  }
  #writeQuestion{
    font-size: 250%;


  }
  
}
</style>