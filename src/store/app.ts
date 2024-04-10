// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    preSignupDialogOpen: false,
    donationDialogOpen: false,
    loading: false,
    innerLoading: false,
    pageNotFound: false,
    tempError: null,
  }),
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },
    setInnerLoading(loading: boolean) {
      setTimeout(() => {
        this.innerLoading = loading
      }, 10)
    },
  },
})
