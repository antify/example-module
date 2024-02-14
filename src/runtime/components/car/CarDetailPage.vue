<script setup lang="ts">
import {computed, useRoute, onMounted} from "#imports";
import {
  useCarRoutingStore,
  useCarDetailStore
} from "../../stores/car";

const carRoutingStore = useCarRoutingStore();
const carDetailStore = useCarDetailStore();
const route = useRoute()
const carId = carRoutingStore.routing.getEntityId();
const ui = useUi()
const tabItems = computed(() => ([
  {
    // TODO:: remove id if @antify/ui-module #11 is solved
    id: 'main-data',
    label: 'Main data',
    to: carRoutingStore.routing.getDetailRoute(carId),
    colorType: carDetailStore.validator.hasErrors('client-main-data') ? ui.TabItemColorType.danger : ui.TabItemColorType.base
  }, {
    id: 'engine',
    label: 'Engine',
    to: carRoutingStore.routing.getDetailSubRoute(carId, 'engine'),
    colorType: carDetailStore.validator.hasErrors('client-engine') ? ui.TabItemColorType.danger : ui.TabItemColorType.base
  }, {
    id: 'owners',
    label: 'Owners',
    to: carRoutingStore.routing.getDetailSubRoute(carId, 'owners'),
  }, {
    id: 'damages',
    label: 'Damages',
    to: carRoutingStore.routing.getDetailSubRoute(carId, 'damages'),
  },
]))

onMounted(() => {
  if (carRoutingStore.routing.isCreatePage.value) {
    carDetailStore.resetData()
  } else if (carId !== carDetailStore.entity._id) {
    carDetailStore.resetData()
    carDetailStore.executeRead()
  }
})
</script>

<template>
  <AntCrudDetail>
    <template #header>
      <AntCrudDetailNav
        :tab-items="tabItems"
        :get-entity-name="() => `${carDetailStore.entity.manufacturer} ${carDetailStore.entity.model}`"
        :disabled="carDetailStore.formDisabled"
        @delete="() => carDetailStore.executeDelete(carDetailStore.entity._id as string)"
      />
    </template>

    <slot />

    <template #footer>
      <AntCrudDetailActions
        :skeleton="carDetailStore.skeleton"
        :disabled="carDetailStore.formDisabled"
        @back="() => carRoutingStore.routing.goToListingPage()"
        @save="() => carDetailStore.save()"
        @save-and-new="() => carDetailStore.saveAndNew()"
      >
        <template #before-buttons-right>
          <AntButton
            v-if="$route.name === 'cockpit-cars-carId-engine'"
            :skeleton="carDetailStore.skeleton"
            :disabled="carDetailStore.formDisabled"
            filled
          >
            Print engine details
          </AntButton>
        </template>
      </AntCrudDetailActions>
    </template>
  </AntCrudDetail>
</template>
