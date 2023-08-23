import { defineStore } from 'pinia'
import * as storage from "./storage";

export const appStore = defineStore('app', {
  state: () => ({
    currentUser: {},
    currentGroup: {},
    userGroups: [],
    currentLogs: [],
    currentLog:{},
    devicePosition: null,
    admin: false
  }),
  getters: {
    getCurrentUser: state => state.currentUser.name ? state.currentUser : storage.getCurrentUser(),
    getIsAdmin: () => state.isAdmin
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
