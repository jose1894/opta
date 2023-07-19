import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useMainStore } from "@/stores/main.js";
import { useStyleStore } from "@/stores/style.js";
import { darkModeKey, styleKey } from "@/config.js";
import Toast from "vue-toastification";
import i18n from "@/i18n";
import "./css/main.css";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import VueTailwindDatepicker from 'vue-tailwind-datepicker'
import VueNumeric from 'vue-numeric'
import moment from 'moment';
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

/* Init Pinia */
const pinia = createPinia();


/* Create Vue app */
const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('VueDatePicker', VueDatePicker);

app.use(router).use(pinia).use(i18n/*, {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      console.log(key)
      return key.split('.').reduce((o, i) => {        
        if (o) return o[i]
      }, options)
    }
  }
}*/).use(Toast).use(VueTailwindDatepicker).use(VueNumeric).use(moment).mount("#app");

/* Init Pinia stores */
const mainStore = useMainStore(pinia);
const styleStore = useStyleStore(pinia);

/* Fetch sample data */
mainStore.fetch("clients");
mainStore.fetch("history");

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? "basic");

/* Dark mode */
if (
  (!localStorage[darkModeKey] &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ||
  localStorage[darkModeKey] === "1"
) {
  styleStore.setDarkMode(true);
}

/* Default title tag */
const defaultDocumentTitle = "Admin One Vue 3 Tailwind";

/* Set document title from route meta */
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});
