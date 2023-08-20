import { defineStore } from "pinia";
import axios from "axios";
import AuthService from '../services/auth.service'
const user = JSON.parse(localStorage.getItem('user'))
const initialState = user ? { isLoggedIn: true , ...user } : {  isLoggedIn: false, user: null }
console.log(initialState)


export const useMainStore = defineStore("main", {
  state: () => ({
    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,
    user : initialState,
    


    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: [],
    countries: [],
    states:[],
    cities:[],
    allies:[],
    jobPositions:[],
    currencies:[],
    members:[],
    branches:[],
    businessUnit:[],
    expense:[],
    profileActions:[],
    itemsMenu:[],
    profiles:[],
    categories:[],
    rates:[],
    languages:[],
    professions:[],
    personal:[],
    industries:[],
    clients:[],
    activities:[],
    projects:[],
    auditAproaches:[],
    listRisk:[],
    filesProjectApproaches:[],
    data: [],
  }),
  actions: {
    setUser(payload) {
      if (payload.name) {
        this.userName = payload.name;
      }
      if (payload.email) {
        this.userEmail = payload.email;
      }
      if (payload.avatar) {
        this.userAvatar = payload.avatar;
      }
    },

    fetch(sampleDataKey) {
      axios
        .get(`data-sources/${sampleDataKey}.json`)
        .then((r) => {
          if (r.data && r.data.data) {
            this[sampleDataKey] = r.data.data;
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    async signIn(user) {
      const self = this
      return new Promise((resolve, reject) => {
        AuthService.login(user)
          .then(user => {
            
            self.userName = user.userData.username;
            self.userEmail = user.userData.email;
            self.user = {...user, isLoggedIn : true}
            resolve(user)
          })
          .catch((error) => {
            reject(error.response)
          })
      })
    },
    async logout(user) {
      const self = this
      console.log('logout')
      await new Promise((resolve, reject) => {
        AuthService.logout(user)
          .then(response => {
            self.userName = null;
            self.userEmail = null;;
            self.user = {isLoggedIn:false}
            resolve(response)
          })
      })
    }
  },

});
