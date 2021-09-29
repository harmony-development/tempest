<script lang="ts" setup>
import { useAuthRoute } from "../../logic/routeParams";
const params = useAuthRoute();
</script>

<template>
  {{ params.host }}
</template>
