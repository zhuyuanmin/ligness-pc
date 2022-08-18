import { ref } from 'vue'

export function useNow() {
  const now = ref(new Date())
  return now
}
