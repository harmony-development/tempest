<script lang="ts" setup>
import BaseButton from "~/components/base/BaseButton.vue";
import BaseSpinner from "~/components/base/BaseSpinner.vue";
import { useAuthManager } from "../../logic/api/auth";
import { useAuthRoute } from "../../logic/routeParams";
import Choices from "./Choices.vue";
import EntryForm from "./EntryForm.vue";
const params = useAuthRoute();
const { back, error, currentStepType, currentStep, sendChoice, sendForm } = useAuthManager(params.value.host);
</script>

<template>
	<base-button class="w-min" square variant="outlined" @click="back">
		<mdi-arrow-left />
	</base-button>
	<div class="text-center" v-if="currentStepType === 'fatal'">
		<mdi-alert class="text-3xl textgray-300" />
		<p>Failed to connect to server</p>
		<p class="text-sm text-gray-400 italic">{{ error }}</p>
	</div>
	<div class="p-2" v-else>
		<choices v-if="currentStep?.oneofKind === 'choice'" :choice="currentStep.choice" @done="sendChoice" :error="error" />
		<entry-form v-else-if="currentStep?.oneofKind === 'form'" :form="currentStep.form" @done="sendForm" :error="error" />
		<div v-if="currentStepType === 'loading'" class="text-center flexcol items-center gap-3">
			<base-spinner class="text-4xl" />
			<span class="font-bold uppercase">Loading</span>
		</div>
	</div>
</template>
