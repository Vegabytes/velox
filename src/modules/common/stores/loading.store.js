import { defineStore } from 'pinia'

export const loadingStore = defineStore("loading", {
  state: () => ({
    loading: false
  }),
  getters: {
    isLoading: state => state.loading
  },
  actions: {
    setLoading(param) {
      this.loading = param;
    }
  }
});
