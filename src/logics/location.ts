import { useRoute } from "vue-router";

export const useHashValue = () => {
  const route = useRoute();
  return decodeURIComponent(route.hash.substr(1));
};
