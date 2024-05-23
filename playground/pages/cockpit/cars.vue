<script setup lang="ts">
const listingRouteName = 'cockpit-cars';
const detailRouteName = 'cockpit-cars-carId';
</script>

<template>
  <ExampleModuleCarListingPage
    :listing-route-name="listingRouteName"
    :detail-route-name="detailRouteName"
    :entity-identifier="'carId'"
    :get-detail-route="(carId) => ({ name: detailRouteName, params: { carId } })"
    :get-listing-route="() => ({ name: listingRouteName })"
  >
    <NuxtPage />
  </ExampleModuleCarListingPage>
</template>
