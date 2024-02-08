<script setup lang="ts">
const listingRouteName = 'tenants-tenantId-cars';
const detailRouteName = 'tenants-tenantId-cars-carId';
const route = useRoute();
const tenantId = computed(() => route.params?.tenantId);
const getDetailRouteParams = () => ({ tenantId: tenantId.value });
const getListingRouteParams = () => ({ tenantId: tenantId.value });
</script>

<template>
  <ExampleModuleCarListingPage
    provider="tenant"
    :tenant-id="$route.params.tenantId"
    :listing-route-name="listingRouteName"
    :detail-route-name="detailRouteName"
    :entity-identifier="'carId'"
    :get-detail-route-params="getDetailRouteParams"
    :get-listing-route-params="getListingRouteParams"
  >
    <NuxtPage />
  </ExampleModuleCarListingPage>
</template>
