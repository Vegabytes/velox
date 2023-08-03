import { defineStore } from 'pinia'

export const loginStore = defineStore('login', {
  state: () => ({
    loggedUser: {}
  }),
})
