<script lang="ts" setup>
import {definePageMeta, useRouteGuard} from '#imports';

definePageMeta({
	middleware: [
		function () {
			return useRouteGuard('core', null, 'CAN_READ_CAR');
		}
	]
});
</script>

<template>
  <NuxtPage />
</template>
