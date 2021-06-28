import { debouncedWatch, useWindowSize } from "@vueuse/core";
import { ref, Ref, watch } from "vue";

export const useFloatingPos = (
  open: Ref<boolean>
): {
  x: Ref<number>;
  y: Ref<number>;
  activator: Ref<Element | null>;
  menu: Ref<HTMLDivElement | null>;
} => {
  const { width, height } = useWindowSize();

  const x = ref(0);
  const y = ref(0);
  const menu = ref<HTMLDivElement | null>(null);
  const activator = ref<Element | null>(null);

  debouncedWatch(
    [width, height],
    () => {
      if (open.value && activator) updateMenuPos(activator, menu, x, y);
    },
    {
      debounce: 150,
    }
  );

  return {
    x,
    y,
    menu,
    activator,
  };
};

export function updateMenuPos(
  activator: Ref<Element | null>,
  menu: Ref<HTMLDivElement | null>,
  x: Ref<number>,
  y: Ref<number>
) {
  const activatorBbox = activator.value!.getBoundingClientRect();
  const menuBbox = menu.value!.getBoundingClientRect();

  // we want a slight offset (12) to make menus look nicer when on the edge
  x.value = Math.max(
    activatorBbox.x - menuBbox.width + activatorBbox.width,
    12
  );
  y.value = Math.max(activatorBbox.y + activatorBbox.height, 12);
}
