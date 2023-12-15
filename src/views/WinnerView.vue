<template>

    <section class="winnerBody"> 
        <div class="winnerBox">
 
      <header class="congratsHeader">
      {{ uiLabels.congrats }} 
      </header>

      <header class="winnerHeader">
      {{ uiLabels.winner }} 
      </header>
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
    name: "WinnerView",
    data: function () {
      return {
        lang: localStorage.getItem("lang") || "en",
        pollId: "",
        data: {},
        uiLabels: {},
        uniquePlayerId: "",
      };
    },
    created: function () {
      this.pollId = this.$route.params.pollId;
      this.uniquePlayerId = this.$route.query.uniquePlayerId;
      socket.emit("pageLoaded", this.lang);
      socket.emit("joinPoll", this.uniquePlayerId);
  
      socket.on("init", (labels) => {
        this.uiLabels = labels;
      });
      socket.on(
        "dataUpdate",
        (data) => (this.data = data),
    
      );
      socket.on("results", () => this.savedPlayer());  //skriv nån metod här som lyssnar på om det bara är en spelare kvar
    },
    methods: {
      backToStart: function(){
      this.$router.push({
            path: "/",
          })
    },
    }
  }
  </script>
  
  
  <style>
  @import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");
  
  .congratsHeader{
    font-size: 100px;
    font-family: "Lilita One", sans-serif;
    vertical-align: center;
      color:rgb(99, 15, 92);
      text-align: center;

  }
  .winnerHeader{
    font-size: 50px;
    font-family: "Lilita One", sans-serif;
    vertical-align: center;
      color:rgb(99, 15, 92);
      text-align: center;

  }
  .winnerBody{
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1000' height='560' preserveAspectRatio='none' viewBox='0 0 1000 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1011%26quot%3b)' fill='none'%3e%3crect width='1000' height='560' x='0' y='0' fill='rgba(255%2c 172%2c 210%2c 1)'%3e%3c/rect%3e%3cpath d='M0%2c349.627C63.695%2c359.213%2c111.142%2c292.065%2c164.76%2c256.372C217.407%2c221.326%2c279.101%2c196.572%2c311.508%2c142.261C345.604%2c85.119%2c357.524%2c15.819%2c347.551%2c-49.97C337.618%2c-115.497%2c303.84%2c-175.91%2c256.28%2c-222.068C210.969%2c-266.043%2c149.923%2c-286.771%2c88.496%2c-301.389C29.622%2c-315.4%2c-34.933%2c-330.787%2c-89.357%2c-304.321C-142%2c-278.722%2c-151.049%2c-208.288%2c-190.98%2c-165.485C-233.169%2c-120.262%2c-305.217%2c-104.362%2c-329.118%2c-47.32C-354.687%2c13.703%2c-361.56%2c94.043%2c-321.919%2c147.016C-281.771%2c200.666%2c-192.41%2c175.458%2c-135.699%2c211.151C-79.873%2c246.287%2c-65.228%2c339.81%2c0%2c349.627' fill='%23ff5ba6'%3e%3c/path%3e%3cpath d='M1000 875.3589999999999C1058.745 871.729 1112.866 844.0350000000001 1159.272 807.833 1202.877 773.816 1237.373 728.8720000000001 1254.981 676.446 1271.564 627.073 1265.1399999999999 574.413 1254.818 523.363 1244.975 474.68399999999997 1231.965 424.56 1196.933 389.356 1162.897 355.153 1111.887 349.98 1066.364 333.983 1017.993 316.985 972.043 284.11 921.473 292.56 869.096 301.312 831.487 344.246 792.059 379.818 747.435 420.077 696.11 456.65999999999997 676.5799999999999 513.499 655.2760000000001 575.503 651.576 647.057 679.925 706.173 708.114 764.957 769.917 797.865 827.554 828.331 881.318 856.75 939.303 879.11 1000 875.3589999999999' fill='%23fffdfe'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1011'%3e%3crect width='1000' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
    background-size: cover;
    min-height: 100vh;
    vertical-align: center;
    

  }
  
  .winnerBox {
  background-image: url("https://media1.giphy.com/media/Z63IGkT6bmiEg3vo8o/giphy.gif?cid=ecf05e47gn4yhbu52omibmbg9u52x8lnuazr0brpt1ky5h4w&ep=v1_stickers_search&rid=giphy.gif&ct=s");
  height: 600px;
  background-repeat: no-repeat;
  vertical-align: center;
  padding:100px;

}
  
  .buttonContainer{
    position: fixed;
    bottom: 2rem;
    right: 2rem;
  }
  
  .purpleButton {
    font-family: "Lilita One", sans-serif;
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