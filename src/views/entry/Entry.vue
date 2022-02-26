<script lang="ts" setup></script>

<template>
	<div class="background h-full w-full overflow-x-auto items-center justify-center flex flex-row">
		<div class="flexcol gap-2 bg-surface-900 h-min p-3 w-11/12 sm:m-12 md:w-150">
			<router-view />
		</div>
		<svg width="768" height="768" viewBox="0 0 281 281" fill="none" xmlns="http://www.w3.org/2000/svg" class="hidden md:block">
			<path
				class="star"
				d="M211 151C214.866 151 218 147.866 218 144C218 140.134 214.866 137 211 137C207.134 137 204 140.134 204 144C204 147.866 207.134 151 211 151Z"
			/>
			<path
				class="star"
				d="M166 76.0002C169.866 76.0002 173 72.8662 173 69.0002C173 65.1343 169.866 62.0002 166 62.0002C162.134 62.0002 159 65.1343 159 69.0002C159 72.8662 162.134 76.0002 166 76.0002Z"
			/>
			<path
				class="star"
				d="M101 218C104.866 218 108 214.866 108 211C108 207.134 104.866 204 101 204C97.134 204 94 207.134 94 211C94 214.866 97.134 218 101 218Z"
			/>
			<path
				class="star"
				d="M110 52.0002C113.866 52.0002 117 48.8662 117 45.0002C117 41.1343 113.866 38.0002 110 38.0002C106.134 38.0002 103 41.1343 103 45.0002C103 48.8662 106.134 52.0002 110 52.0002Z"
			/>
			<path class="star" d="M58 137C61.866 137 65 133.866 65 130C65 126.134 61.866 123 58 123C54.134 123 51 126.134 51 130C51 133.866 54.134 137 58 137Z" />
			<path
				class="meteor"
				d="M215.469 55.2925L55.9723 202.281C52.2735 205.69 52.1551 211.492 55.7119 215.049C59.2687 218.606 65.0708 218.488 68.4796 214.789L215.469 55.2925Z"
				stroke-linejoin="round"
			/>
			<path
				class="meteor"
				d="M171.67 168.939L94.9391 245.67C93.3159 247.293 93.3159 249.925 94.9391 251.548C96.5623 253.171 99.194 253.171 100.817 251.548L177.548 174.817C179.171 173.194 179.171 170.562 177.548 168.939C175.925 167.316 173.293 167.316 171.67 168.939Z"
			/>
			<path
				class="meteor"
				d="M162.67 28.939L85.9391 105.67C84.3159 107.293 84.3159 109.925 85.9391 111.548C87.5623 113.171 90.194 113.171 91.8172 111.548L168.548 34.8172C170.171 33.194 170.171 30.5623 168.548 28.939C166.925 27.3158 164.293 27.3158 162.67 28.939Z"
			/>
			<path
				class="meteor"
				d="M132.67 93.939L55.9391 170.67C54.3159 172.293 54.3159 174.925 55.9391 176.548C57.5623 178.171 60.194 178.171 61.8172 176.548L138.548 99.8172C140.171 98.194 140.171 95.5623 138.548 93.939C136.925 92.3158 134.293 92.3158 132.67 93.939Z"
			/>
			<path
				class="meteor"
				d="M206.67 98.939L129.939 175.67C128.316 177.293 128.316 179.925 129.939 181.548C131.562 183.171 134.194 183.171 135.817 181.548L212.548 104.817C214.171 103.194 214.171 100.562 212.548 98.939C210.925 97.3158 208.293 97.3158 206.67 98.939Z"
			/>
		</svg>
	</div>
</template>

<style lang="postcss" scoped>
@keyframes fadeout {
	0% {
		@apply fill-primary-600 stroke-primary-600;
	}

	to {
		@apply fill-surface-900 stroke-surface-900;
	}
}
svg {
	--anim-speed: 0.25s;

	& > path {
		@apply fill-surface-900 transition duration-100;
		animation: fadeout 1s;

		&.meteor {
			@apply stroke-surface-900;
		}

		&:hover {
			@apply fill-primary-600 stroke-primary-600;
			animation: 0;
		}
	}

	.star:nth-child(1) {
		animation: fadeout infinite alternate calc(var(--anim-speed) * 5);
	}
	.star:nth-child(2) {
		animation: fadeout infinite alternate calc(var(--anim-speed) * 12);
	}
	.star:nth-child(3) {
		animation: fadeout infinite alternate calc(var(--anim-speed) * 15);
	}
	.star:nth-child(4) {
		animation: fadeout infinite alternate calc(var(--anim-speed) * 25);
	}
	.star:nth-child(5) {
		animation: fadeout infinite alternate calc(var(--anim-speed) * 10);
	}
}

.background {
	@apply bg-surface-800;
}
</style>
