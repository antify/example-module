<script setup lang="ts">
import {computed} from "vue";

const {$cars} = useNuxtApp();
const {
  executeRead,
  resetData,
  isCreateContext,
  data,
  skeleton,
  save,
  saveAndNew,
  formDisabled,
  executeDelete,
  validator,
} = $cars.item
const {
  goToListingPage
} = $cars.routing
const carId = useRoute().params?.carId;
const ui = useUi()
const route = useRoute()

const tabItems = computed(() => ([
  {
    // TODO:: remove id if #11 is solved
    id: 'main-data',
    label: 'Main data',
    to: {name: 'cars-carId', params: {carId: carId}, query: route.query},
    colorType: validator.hasErrors('client-main-data') ? ui.TabItemColorType.danger : ui.TabItemColorType.base
  }, {
    id: 'engine',
    label: 'Engine',
    to: {name: 'cars-carId-engine', params: {carId: carId}, query: route.query},
    colorType: validator.hasErrors('client-engine') ? ui.TabItemColorType.danger : ui.TabItemColorType.base
  }, {
    id: 'owners',
    label: 'Owners',
    to: {name: 'cars-carId-owners', params: {carId: carId}, query: route.query},
  }, {
    id: 'damages',
    label: 'Damages',
    to: {name: 'cars-carId-damages', params: {carId: carId}, query: route.query},
  },
]))

onMounted(() => {
  if (isCreateContext.value) {
    resetData()
  } else if (carId !== data.value.id) {
    resetData()
    executeRead()
  }
})
</script>

<template>
  <AntCrudDetail>
    <template #header>
      <AntCrudDetailNav
        :tab-items="tabItems"
        :get-entity-name="() => `${data.manufacturer} ${data.model}`"
        :disabled="formDisabled"
        @delete="() => executeDelete(data.id as string)"
      />
    </template>

    <slot/>

    <template #footer>
      <AntCrudDetailActions
        :skeleton="skeleton"
        :disabled="formDisabled"
        @back="goToListingPage"
        @save="save"
        @save-and-new="saveAndNew"
      >
        <template #before-buttons-right>
          <AntButton
            v-if="$route.name === 'cars-carId-engine'"
            :skeleton="skeleton"
            :disabled="formDisabled"
            filled
          >Print engine details</AntButton>
        </template>
      </AntCrudDetailActions>
    </template>
  </AntCrudDetail>
</template>
