<template>
  <header>
    <div v-bind:class="['hamburger', {'close': !hideNav}]" 
         v-on:click="toggleNav">
    </div>
    <div class="logo">
      <img src="https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/1024px/1fa77.png">
      Romance Roulette 
      <img src="https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/1024px/1fa77.png">
    </div>
  </header>
  <ResponsiveNav id="nav" v-bind:hideNav="hideNav">
    <button v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>
    <button v-on:click="about">{{uiLabels.about}}</button>
    <button v-on:click="FAQ">FAQ</button>
  </ResponsiveNav>
  <div v-if="showAbout"  class="aboutText"> 
    <b>{{uiLabels.aboutText}}</b>
    <br>{{uiLabels.aboutText1}}
    <br>{{uiLabels.aboutText2}}
  </div>
  <div v-if="showFAQ" class="FAQtext"> 
    <b> {{uiLabels.FAQ}} </b>
    <br>{{uiLabels.FAQ1}}
    <br>{{uiLabels.FAQ2}}
    <br>{{uiLabels.FAQ3}}

  </div>

  <section class="bodywrapper">

  <h1>{{ uiLabels["sales-pitch"] }}</h1>
  <h2>{{ uiLabels.subHeading }}</h2>

  <div class="boxes-container">
  <div class ="box-a">
  <router-link to="/create/">{{uiLabels.createPoll}}</router-link>
  </div>

  <div class="box-b">
  <label>
    {{uiLabels.writePollId}}<br>
    <input type="text" v-model="id"> <br>
  </label>
  <router-link v-bind:to="'/poll/'+id">{{uiLabels.participatePoll}}</router-link>
</div>
</div>
</section>

</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      showAbout: false,
      showFAQ: false,
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv";
      }
      else {
        this.lang = "en";
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang);
      socket.emit("init", this.lang);
    },
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    },
    about: function() {
      this.showAbout = !this.showAbout;
      this.showFAQ = false;
    },
    FAQ: function() {
      this.showFAQ = !this.showFAQ;
      this.showAbout = false;
    }
  }
}
</script>
<style scoped>

h1{
  margin: 0px;
  padding: 20px;
}
.boxes-container {
    display: flex;
    justify-content: space-between;

  }

  .bodywrapper{
    min-height: 100vh;
    background: linear-gradient(179.4deg, rgb(253, 240, 233) 2.2%, rgb(255, 194, 203) 96.2%);
  }

  .box-a,
  .box-b {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    width: 48%; /* Adjust the width as needed */
    height: 200px;
    background-image: url('https://pngimg.com/d/heart_PNG51183.png');
    background-size: contain; /* Ensure the entire image fits within the box */
    background-position: center;
    background-repeat: no-repeat;
  }

  .box-a router-link,
  .box-b router-link {
    display: block;
    text-align: center;
  }

  header {
    background: linear-gradient(106.5deg, rgba(253, 141, 196, 0.91) 23%, rgba(245, 81, 125, 0.8) 93%);
    width: 100%;
    display: grid;
    grid-template-columns: 2em auto;
  }
  .logo {
    letter-spacing: 0.15em;
    font-weight: bold;
    font-size: 2.8rem;
    color: white;
    padding-top:0.2em;
    font-family: "Brush Script MT";
  }
  .logo img {
    height:2.5rem;
    vertical-align: bottom;
    margin-right: 0.5rem;
    margin-bottom: 0.4rem;
  }
  .hamburger {
    color:white;
    width:1em;
    display: flex;
    align-items: center;
    justify-content: left;
    padding:0.5rem;
    top:0;
    left:0;
    height: 2rem;
    cursor: pointer;
    font-size: 1.5rem;
  }
  #nav {
    background-color: palevioletred;
  }
  #nav button{
    background-color: rgb(240, 188, 196);
    
    margin: 0.3rem;
  
  }
  .aboutText, .FAQtext {
    background-color: lightpink;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: left;
    
  }

@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
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
    left:-12em;
  }
}
</style>