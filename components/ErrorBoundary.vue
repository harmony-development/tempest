<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ErrorBoundary',
  data: () => ({
    error: false,
    description: undefined as string | undefined,
  }),
  errorCaptured(err, _vm, _info) {
    this.error = true
    this.description = err.message
  },
  render(_h) {
    if (this.error) {
      return this.$slots.error![0]
    }
    return this.$slots.default![0]
  },
})
</script>
