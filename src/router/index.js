import { createRouter, createWebHistory } from "vue-router";
import StartView from "../views/StartView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Start",
      component: StartView,
    },
    {
      path: "/poll/:id",
      name: "PollView",
      component: () => import("../views/PollView.vue"),
    },
    {
      path: "/create/",
      name: "CreateView",
      component: () => import("../views/CreateView.vue"),
    },
    {
      path: "/createQuestion/:pollId",
      name: "CreateQuestionView",
      component: () => import("@/views/CreateQuestionView.vue"),
    },
    {
      path: "/result/:id",
      name: "ResultView",
      component: () => import("../views/ResultView.vue"),
    },
    {
      path: "/chooseAnswer/:pollId",
      name: "chooseAnswerView",
      component: () => import("@/views/chooseAnswerView.vue"),
    },
    {
      path: "/eliminatedPlayer/:pollId",
      name: "eliminatedPlayer",
      component: () => import("@/views/EliminatedPlayerView.vue"),
    },
    {
      path: "/youAreEliminated/:pollId",
      name: "YouHaveBeenEliminatedView",
      component: () => import("@/views/YouHaveBeenEliminatedView.vue"),
    },
    {
      path: "/answerQuestion/:pollId",
      name: "AnswerQuestionView",
      component: () => import("@/views/AnswerQuestionView.vue"),
    },
    {
      path: "/endOfGame/:pollId",
      name: "EndOfGameView",
      component: () => import("@/views/EndOfGameView.vue"),
    },

  ],
});

export default router;
