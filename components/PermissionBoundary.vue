<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'PermissionBoundary',
  props: {
    node: {
      type: String,
      default: '',
    },
  },
  render(_h) {
    if (!this.node) {
      return this.$slots.default![0]
    }
    const hasNode = true // TMP
    if (hasNode) {
      return this.$slots.default![0]
    } else {
      if (this.$slots.noperm) {
        return this.$slots.noperm[0]
      }
      return null as any
    }
  },
})
</script>
