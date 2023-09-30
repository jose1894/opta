// useLoading.js
import { ref } from 'vue'
import { useLoading } from 'vue3-loading-overlay'

export default function useLoadingOverlay() {
  const isLoading = ref(false)
  const $loading = useLoading()

  const showLoading = () => {
    isLoading.value = true
    $loading.show()
  }

  const hideLoading = () => {
    isLoading.value = false
    $loading.hide()
  }

  return {
    isLoading,
    showLoading,
    hideLoading
  }
}