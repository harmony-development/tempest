import { computed, Ref, toRefs } from "vue";
import { RouteParams, useRoute } from "vue-router";

export function useParams<T extends RouteParams>() {
  const route = useRoute();
  return computed(() => route.params as T);
}

export const useAuthRoute = () => {
  return useParams<{
    host: string;
  }>();
};
