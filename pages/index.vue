<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {},
  beforeCreate() {
    this.$router.push('/entry/serverselect')
  },
})
</script>
