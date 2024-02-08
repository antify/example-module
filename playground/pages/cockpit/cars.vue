<script setup lang="ts">
const listingRouteName = 'cockpit-cars';
const detailRouteName = 'cockpit-cars-carId';
</script>

<template>
  <ExampleModuleCarListingPage
    provider="core"
    :listingRouteName="listingRouteName"
    :detailRouteName="detailRouteName"
    :entityIdentifier="'carId'"
    :getDetailRoute="(carId) => ({ name: detailRouteName, params: { carId } })"
    :getListingRoute="() => ({ name: listingRouteName })"
  >
    <NuxtPage/>
  </ExampleModuleCarListingPage>
</template>
