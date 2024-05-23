<script lang="ts" setup>
import {
	definePageMeta,
	useAppContext,
	useRouteGuard,
} from '#imports';

definePageMeta({
	middleware: [
		function (to) {
			const tenantId = (to.params?.tenantId || null) as string | null;

			useAppContext().value.setContext('tenant', tenantId);

			return useRouteGuard({appId: 'tenant', tenantId}, 'CAN_READ_CAR');
		}
	]
});
</script>

<template>
  <NuxtPage />
</template>
