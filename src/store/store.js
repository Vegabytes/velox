import { defineStore } from 'pinia'

export const appStore = defineStore('app', {
  state: () => ({
    showMenu : false
  }),
})