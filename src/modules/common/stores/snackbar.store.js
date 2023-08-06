import { defineStore } from 'pinia'

export const snackbarStore = defineStore('snackbar', {
  state: () => ({
    activate: false,
    text: '',
    color: 'blue-grey',
    timeout: 2000,
    location: 'top right',
  }),
  actions: {
    activateMessage(text, color, time) {
      this.activate = true;
      this.text = text;
      this.color = (color) ? color : 'blue-grey';
      this.timeout = (time) ? time : 2000
    }
  }
})
