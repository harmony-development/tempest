<script lang="ts" setup>
import HImage from "~/components/HImage.vue";
import { userID } from "~/logics/app";
</script>

<template>
  <HImage :userid="userID" />
</template>
