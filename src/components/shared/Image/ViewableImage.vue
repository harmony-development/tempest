<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";
import { parseHMC } from "~/logic/utils/parsing";
import { useAppRoute } from "~/logic/location";
import HImage from "~/components/shared/Image/HImage.vue";

const props = defineProps<{
  imageSrc: string;
  fileName?: string;
  size?: number;
}>();

const dialogOpen = ref(false);

const route = useAppRoute();
const src = computed(() => parseHMC(props.imageSrc, route.value.host));
</script>

<template>
  <div>
    <h-dialog v-model="dialogOpen" unsized>
      <div class="flex flex-col gap-2">
        <div class="flex">
          <p
            class="
              text-gray-300
              w-full
              overflow-hidden overflow-ellipsis
              w-full
            "
          >
            {{ fileName }}
          </p>
          <p>{{ size }}</p>
        </div>
        <h-image :uri="src" class="w-50vw max-w-80vw max-h-80vh" />
        <div class="flex justify-between">
          <h-link
            v-t="'app.image-view.open-original'"
            target="_blank"
            :href="src"
          />
        </div>
      </div>
    </h-dialog>
    <h-image :uri="src" class="cursor-pointer" @click="dialogOpen = true" />
  </div>
</template>
