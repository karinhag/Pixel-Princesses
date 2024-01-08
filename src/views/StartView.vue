<template>
  <body>
  
    <header id="startHeader">

      <div v-bind:class="['hamburger', {'close': !hideNav}]" 
         v-on:click="toggleNav">
    </div>
      
      <div class="logo">
        <img
          src="https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/1024px/1fa77.png"
        id="img1"/> 
        Romance Roulette
        <img
          src="https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/1024px/1fa77.png"
        id="img2"/>
      </div>
      <hr>
    </header>
   

    <ResponsiveNav id="nav" v-bind:hideNav="hideNav">
      <button class="langButton" v-on:click="switchLanguage">{{ uiLabels.changeLanguage }}</button>
      <button v-on:click="about">{{ uiLabels.about }}</button>
      <button v-on:click="FAQ">FAQ</button>
    </ResponsiveNav>
    
    <div v-if="showAbout" class="FAQtext">
  <button class="closeButton" v-on:click="showAbout=false">x</button>
  <b class="FAQheader">{{ uiLabels.aboutText }}</b>
  <br />{{ uiLabels.aboutText1 }} <br />{{ uiLabels.aboutText2 }}
</div>
<div v-if="showFAQ" class="FAQtext">
  <button class="closeButton" v-on:click="showFAQ=false">x</button>
  <b class="FAQheader"> {{ uiLabels.FAQ }} </b>
  <br />{{ uiLabels.FAQ1 }} <br />{{ uiLabels.FAQ2 }} <br />{{ uiLabels.FAQ3 }}
</div>

    <section class="bodywrapper">
      <h1 id="salesPitch"> {{ uiLabels.salespitch }} </h1> 
       <h2 id="subHeading"> {{ uiLabels.subHeading }}</h2>

      <div class="boxes-container">
        <div class="box-a">
          <button class="startGameButton" v-on:click="beginGame">
            <p id="buttonText">{{ uiLabels.createPoll }}!</p>
          </button>
        </div>

        <div class="box-b">
          <label>
            {{ uiLabels.writePollId }}<br />
            <input type="text" v-model="id" /> <br />
          </label>
          <button class="joinDateButton" v-on:click="joinDate" :disabled="!id">
            <p id="buttonText">{{ uiLabels.participatePoll }}! </p>
          </button>
        
        </div>
      </div>
    </section>
  </body>
</template>

<script>
import ResponsiveNav from "@/components/ResponsiveNav.vue";
import io from "socket.io-client";
sessionStorage.setItem("dataServer", "localhost:3000");
// sessionStorage.setItem("dataServer", "192.168.0.31:3000"); Hannas IP
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: "StartView",
  components: {
    ResponsiveNav,
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      showAbout: false,
      showFAQ: false,
    };
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels;
    });
  },
  methods: {
    switchLanguage: function () {
      if (this.lang === "en") {
        this.lang = "sv";
      } else {
        this.lang = "en";
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang);
      socket.emit("init", this.lang);
    },
    toggleNav: function () {
      this.hideNav = !this.hideNav;
    },
    about: function () {
      this.showAbout = !this.showAbout;
      this.showFAQ = false;
    },
    FAQ: function () {
      this.showFAQ = !this.showFAQ;
      this.showAbout = false;
    },
    beginGame: function () {
      socket.emit("beginGame", { pollId: this.pollId, lang: this.lang });
      this.$router.push("/create/");
    },
    joinDate: function () {
     this.$router.push("/poll/" + this.id);
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Rochester&family=Satisfy&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Lilita+One&family=Rochester&family=Satisfy&display=swap");

body {
  font-weight: lighter;
  font-family: "Lilita One", sans-serif;
  letter-spacing: 2.5px;
  height: 100vh;

}
hr {
  border: 0;
  height: 8px;
  width: 50%;
  position: relative;
  margin: 5px auto;
 background:  radial-gradient(#FED5E5ff,#FFB4CF, #FF95BB, #FF6099,  #FF6099ff);

}
input {
  font-family: "Lilita One", sans-serif;
  caret-color: #f06af0;
  font-size: 20px;
  color: #fd8dc4e8;
}
#salesPitch,
#subHeading,
#startHeader, 
div {
  font-family: "Lilita One", sans-serif;
  font-size: 38px;
  margin: 0px;
  padding: 5px;
}
#salesPitch{
  padding-top: 25px;
color: white}
.boxes-container {
  display: flex;
  justify-content: space-between;
}
.bodywrapper {
  height: 100%;
  background: rgba(255,152,190,255);
  color:rgba(255,41,118,255);

}

.box-a,
.box-b {
  color:#252422;
  margin-top: 50px;
  font-size: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 48%; 
  height: 350px;
  background-image: url("https://pngimg.com/d/heart_PNG51183.png");
  background-size: contain; 
  background-position: center;
  background-repeat: no-repeat;
}
#buttonText{
  margin:1px;
}

.box-a router-link,
.box-b router-link {
  display: block;
  text-align: center;
}

#startHeader {
  background: rgba(255, 96, 154, 1);
  width: 100%;
  box-sizing: border-box; 
}
.logo {

  letter-spacing: 0.2em;
  font-weight: bolder;
  font-size: 5.5rem;
  color: rgb(255, 213, 230);
  padding: 0.2em;
  font-family: "Rochester", cursive;
  text-align: center;
  
}
#img1 {
  height: 4.2rem;
  vertical-align: bottom;
  margin-right: 0.5rem;
  margin-bottom: 0.4rem;
  animation: spinAndPulsateClockwise 2s infinite linear;
}
#img2 {
  height: 4.2rem;
  vertical-align: bottom;
  margin-right: 0.5rem;
  margin-bottom: 0.4rem;
  animation: spinAndPulsateCounterClockwise 2s infinite linear;
}

@keyframes spinAndPulsateClockwise {
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.2) rotate(18deg);
  }
  50% {
    transform: scale(1) rotate(0deg);
  }
  75% {
    transform: scale(1.2) rotate(-18deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}
@keyframes spinAndPulsateCounterClockwise {
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.2) rotate(-18deg);
  }
  50% {
    transform: scale(1) rotate(0deg);
  }
  75% {
    transform: scale(1.2) rotate(18deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.hamburger {
  color: rgb(255, 213, 230);
  width: 1em;
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0.5rem;
  top: 0;
  left: 0;
  height: 2rem;
  cursor: pointer;
  font-size: 1.5rem;
}
#nav {
  background: rgba(255, 96, 154, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#nav button {
  margin: 0.3rem;
  font-family: "Lilita One", sans-serif;
  height:45px;
  width:200px;
  font-size: larger;
}

#nav button:hover {
  cursor: pointer;
  background: linear-gradient(
    0deg,
    rgb(255, 213, 230) 23.8%,
    rgb(252, 175, 211) 92%
  );
}
.closeButton:hover {
  cursor: pointer;
  font-weight: bold;
}

.langButton:hover

.aboutText,
.FAQtext {
  background-color: rgb(255, 213, 230);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  font-size: 1em;
  font-family: 'Quicksand', sans-serif;
  letter-spacing: normal;
}
.FAQheader{
  font-size: 20px;
  font-family: "Lilita One", sans-serif;;
}


.startGameButton,
.joinDateButton {
  background: linear-gradient(
    0deg,
    rgb(255, 213, 230) 23.8%,
    rgb(252, 221, 234) 92%
  );
  padding: 3px;
  text-align: center;
  display: inline-block;
  margin: 7px 5px;
  border-radius: 10px;
  width: 200px;
  padding: 10px;
  font-size: 25px;
  font-family: "Lilita One", sans-serif;;
}

.startGameButton:hover:enabled,
.joinDateButton:hover:enabled {
  cursor: pointer;
  background: linear-gradient(
    0deg,
    rgb(255, 213, 230) 23.8%,
    rgb(252, 175, 211) 92%
  );
  color:#252422;
}

.joinDateButton:disabled{
  cursor:not-allowed

}
.closeButton {
  position: absolute;
  top: center;
  right: 10px;
  font-size: 20px;
  background: none;
  border: none;
  color: #000000; 
}

@media screen and (max-width: 849px) {
  .logo {
    font-size: 170%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo img{
    size:1em;  
  }


}

@media screen and (max-width: 50em) {

  #nav button {
  margin: 0.3rem;
  font-family: "Lilita One", sans-serif;
  height:35px;
  width:80%;
  font-size: large;}
  .logo {
    font-size: 83%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hamburger::before {
    content: "☰";
  }
  .close::before {
    content: "✕";
  }
  .hide {
    left: -12em;
  }
  .startGameButton,
  .joinDateButton {
    width:60%;
    font-size: 140%;
  }
  #buttonText{
    font-size:0.6em;
  }
  .box-a,
  .box-b{
    width:40%;
    font-size: 43%;
  }
  
#salesPitch,
#subHeading{
  font-size: 140%;
}
#nav{
  opacity:85%;
  flex-direction: column; 
}

input { 
    width: 80%; 
  }


button:hover:enabled{
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  transform: scale(1.01);
  transition: all 0.3s ease;
}

}



</style>