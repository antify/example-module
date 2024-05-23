<script lang="ts" setup>
import {definePageMeta, useRouteGuard} from '#imports';

definePageMeta({
	middleware: [
		function (to) {
			return useRouteGuard('tenant', (to.params?.tenantId || null) as string | null, 'CAN_READ_CAR');
		}
	]
});
</script>

<template>
  <NuxtPage />
</template>
