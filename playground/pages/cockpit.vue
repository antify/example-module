<script lang="ts" setup>
import {
	definePageMeta,
	useRouteGuard,
	useAppContext
} from '#imports';

definePageMeta({
	middleware: [
		function () {
			useAppContext().value.setContext('core');

			return useRouteGuard({appId: 'core'}, 'CAN_READ_CAR');
		}
	]
});
</script>

<template>
  <NuxtPage />
</template>
