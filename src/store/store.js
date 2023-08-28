import { defineStore } from 'pinia'
import * as storage from "./storage";

export const appStore = defineStore('app', {
  state: () => ({
    currentUser: {},
    currentGroup: {},
    userGroups: [],
    currentLogs: [],
    currentLog: {},
    currentDevice: {},
    devicePosition: null,
    isAdmin: false,
    admin:false
  }),
  getters: {
    getCurrentUser: state => {
      return state.currentUser.id ? state.currentUser : storage.getCurrentUser()
    },
    getIsAdmin: state => state.isAdmin
  },
  actions: {
    setCurrentUser(params) {
      this.currentUser = params,
        storage.setCurrentUser(params)
    },
    setIsAdmin(params) {
      this.isAdmin = params
    }
  }
})
