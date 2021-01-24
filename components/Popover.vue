<template>
  <div>
    <div ref="activator">
      <slot name="activator" :toggle="toggle" />
    </div>
    <portal to="destination">
      <div
        v-show="value"
        class="fixed w-screen h-screen top-0 left-0 z-10 overflow-auto"
        @click="toggle(0, 0)"
      ></div>
      <div
        v-show="value"
        ref="menuBody"
        class="fixed z-50"
        :style="{ top: `${y || posY}px`, left: `${x || posX}px` }"
      >
        <slot />
      </div>
    </portal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      posX: 0,
      posY: 0,
    }
  },
  methods: {
    async toggle(x?: number, y?: number) {
      this.$emit('input', !this.value)
      await this.$nextTick()
      const menuBody = this.$refs.menuBody as HTMLDivElement
      const activator = this.$refs.activator as HTMLDivElement
      const bbox = menuBody.getBoundingClientRect()
      if (x && y) {
        this.posX = x - bbox.width
        this.posY = y + bbox.height
      } else {
        const activatorBbox = activator.getBoundingClientRect()
        this.posX = activatorBbox.x - bbox.width + activatorBbox.width
        this.posY = activatorBbox.y + activatorBbox.height
      }
    },
  },
})
</script>
