<template>
  <section class="endOfGameBody">

    <div class="perfectMatch">  <!-- loopar över gifen-->
      <img v-for="index in 5" :key="index" 
           src="https://media0.giphy.com/media/nR8frZBepl4VW/giphy.gif?cid=ecf05e47k7wzswsfziaaor2m2rrvq3jh21i1yhtc5nvou67d&ep=v1_gifs_related&rid=giphy.gif&ct=s"
      />

    <header>
    {{ uiLabels.perfectMatch }} 
    </header>

<h2>{{ this.userName }}</h2>
<h1>{{ uiLabels.hasGreenFlag }}</h1>
<h2>{{ this.greenFlag }}</h2>
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
      userName:"",
      greenFlag:"",
    };
  },
  created: function () {
    this.pollId = this.$route.params.pollId;
    socket.emit("pageLoaded", this.lang);
    socket.emit("joinPoll", this.pollId);
    // socket.on("trueMatch", 
    //   console.log("hello"));

    socket.emit("getMatchedPlayer", this.pollId);
    socket.on("returnMatchedPlayer", (data)=> this.handleMatch(data))

    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
    socket.on(
      "dataUpdate",
      (data) => (this.data = data),
  
    );
  },

  methods: {
    backToStart: function(){
    this.$router.push({
          path: "/",
        })
  },
  handleMatch: function(d){
    console.log("hello olivia")
    console.log(d)
          this.userName = d[0][0].userName;
          this.greenFlag = d[0][0].greenFlag;
  }
  },

}
</script>


<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");


header{
    font-size: 65px;
    font-family: "Lilita One", sans-serif;
    vertical-align: center;
    color:rgb(99, 15, 92);
}

.endOfGameBody{
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1007' height='560' preserveAspectRatio='none' viewBox='0 0 1007 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1409%26quot%3b)' fill='none'%3e%3crect width='1007' height='560' x='0' y='0' fill='rgba(255%2c 181%2c 236%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c346.142C84.274%2c344.369%2c173.63%2c426.07%2c245.213%2c381.559C316.545%2c337.204%2c284.982%2c222.481%2c320.947%2c146.572C357.689%2c69.024%2c460.607%2c20.016%2c457.131%2c-65.726C453.684%2c-150.741%2c363.661%2c-202.719%2c304.314%2c-263.69C248.42%2c-321.114%2c195.281%2c-381.811%2c120.767%2c-411.294C41.847%2c-442.52%2c-44.567%2c-452.135%2c-127.605%2c-434.584C-214.742%2c-416.167%2c-300.804%2c-378.475%2c-357.9%2c-310.122C-414.567%2c-242.284%2c-424.977%2c-150.402%2c-438.016%2c-62.977C-451.118%2c24.874%2c-467.316%2c115.847%2c-433.692%2c198.06C-399.458%2c281.765%2c-337.517%2c362.793%2c-251.933%2c392.015C-169.484%2c420.167%2c-87.104%2c347.974%2c0%2c346.142' fill='%23ff8ee2'%3e%3c/path%3e%3cpath d='M1007 1026.942C1097.585 1032.783 1191.068 1014.25 1266.05 963.0889999999999 1340.071 912.5830000000001 1377.85 827.847 1416.958 747.221 1456.934 664.8050000000001 1524.133 576.801 1495.6480000000001 489.743 1466.798 401.572 1344.56 389.903 1278.674 324.59299999999996 1220.038 266.47 1213.089 151.01299999999998 1133.14 130.406 1052.687 109.668 990.674 209.80599999999998 909.973 229.558 823.225 250.79000000000002 712.344 186.95499999999998 648.2 249.098 585.387 309.951 624.857 417.696 625.5070000000001 505.15 626.06 579.548 628.023 651.726 651.7149999999999 722.2529999999999 677.634 799.41 706.779 878.027 768.564 931.014 834.939 987.937 919.74 1021.316 1007 1026.942' fill='%23ffdcf6'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1409'%3e%3crect width='1007' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
  background-size: cover;
  min-height: 100vh;
}

.perfectMatch img{
  height: 10rem;
  margin-bottom: 0.4rem;
}

.buttonContainer{
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
  font-size: 15px;
  margin: 7px 5px;
  border-radius: 15px;

}

.purpleButton:hover {
  background: linear-gradient(to top, #b66af0 0%, #c3b0ff 100%);
  cursor: pointer;
}

</style>