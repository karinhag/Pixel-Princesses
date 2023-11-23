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
    <a href="">{{uiLabels.about}}</a>
    <a href="">FAQ</a>
  </ResponsiveNav>
  <h1>{{ uiLabels["sales-pitch"] }}</h1>
  <h2>{{ uiLabels.subHeading }}</h2>

  <div class="boxes-container">
  <div class ="box-a">
  <router-link to="/create/">{{uiLabels.createPoll}}</router-link>
  </div>

  <div class="box-b">
  <label>
    Write poll id: <br>
    <input type="text" v-model="id"> <br>
  </label>
  <router-link v-bind:to="'/poll/'+id">{{uiLabels.participatePoll}}</router-link>
</div>
</div>

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
      hideNav: true
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
    }
  }
}
</script>
<style scoped>
.boxes-container {
    display: flex;
    justify-content: space-between;
  }

  .box-a,
  .box-b {
    border: 1px solid #ccc;
    padding: 10px;
    width: 48%; /* Adjust the width as needed */
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
