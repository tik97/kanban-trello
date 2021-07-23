import Vue from 'vue';
import App from './App.vue';
import axios from "axios";
import vuetify from './plugins/vuetify';
import router from './router';
import store from "./store/index";
import { nextFactory } from './middlewares'


router.beforeEach((to, from, next) => {3
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware)
            ? to.meta.middleware
            : [to.meta.middleware];

        const context = {
            from,
            next,
            router,
            to,
        };
        const nextMiddleware = nextFactory(context, middleware, 1);

        return middleware[0]({...context, next: nextMiddleware});
    }

    return next();
});

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
  created() {
    const userInfo = localStorage.getItem('userData');
    if (userInfo) {
      const userData = JSON.parse(userInfo);
      this.$store.commit('setUserData', userData)
    }
    axios.interceptors.response.use(
        response => response,
        error => {
          if (error.response.status === 401) {
            localStorage.removeItem("userData")
            this.$router.push('/signing')
          }
          return Promise.reject(error)
        }
    )
  }
}).$mount('#app')
