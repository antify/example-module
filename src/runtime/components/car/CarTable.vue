<script lang="ts" setup>
// import type {TableHeader} from "@antify/ui-module";
import {faCopy, faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import {type Car} from "../../glue/plugins/car";
import {useFetch} from "nuxt/app";
import {useCarListingStore, useCarRoutingStore, useCarDetailStore, useCarContextStore} from "../../stores/car";
import {watch, onMounted, ref, useNuxtApp, useRoute, computed} from "#imports";
import {storeToRefs} from "pinia";

defineProps<{
  showLightVersion: boolean
}>();

const carDetailStore = useCarDetailStore();
const carRoutingStore = useCarRoutingStore();
const carListingStore = useCarListingStore();
const carContextStore = useCarContextStore();
const {headers} = storeToRefs(useCarContextStore());
const {$uiModule} = useNuxtApp();
// const carCrud = useCarCrud().value;
const route = useRoute();
const ui = useUi();
// const {
//   execute,
//   data,
//   pending,
//   error,
//   refresh
// } = carCrud.listing;
// const {
//   getDetailRoute,
//   goToDetailPage,
// } = carCrud.routing;
const deleteDialogOpen = ref(false);
const entityToDelete = ref<Car | null>(null);
// const tableHeaders: TableHeader[] = [
const tableHeaders = [
  {
    title: 'Manufacturer',
    identifier: 'manufacturer',
    toProp: 'link',
    type: ui.AntTableRowTypes.link,
    lightVersion: true,
  },
  {
    title: 'Model',
    identifier: 'model',
    toProp: 'link',
    type: ui.AntTableRowTypes.link,
    lightVersion: true,
  },
  {
    title: 'Type',
    identifier: 'type',
    type: ui.AntTableRowTypes.text,
  },
  {
    title: 'Color',
    identifier: 'color',
    type: ui.AntTableRowTypes.text,
  },
  {
    identifier: 'actions',
    type: ui.AntTableRowTypes.slot,
  },
];
const selectedRow = computed(() => route.params.carId ? carListingStore.data?.cars?.find((car) => car._id === route.params.carId) : undefined);
const cars = computed(() => {
  return carListingStore.data?.cars?.map((car) => {
    car.link = carRoutingStore.routing.getDetailRoute(car._id);

    return car;
  }) || [];
});
const entityIdToDuplicate = ref<string | null>(null);
const {
  error: duplicateError,
  execute: executeDuplicate,
  status: duplicateStatus,
} = useFetch(
  () => `/api/components/cars/car-table/duplicate/${entityIdToDuplicate.value}`,
  {
    method: 'post',
    headers: carContextStore.headers,
    immediate: false,
    watch: false,
    onResponse({response}) {
      if (response.status === 200) {
        carRoutingStore.routing.goToDetailPage(response._data._id);
        carListingStore.refresh(false);
        $uiModule.toaster.toastDuplicated();
      }
    }
  }
)

onMounted(() => carListingStore.execute());

watch(duplicateError, () => useUiClient().handler.handleResponseError(duplicateError));

function openDeleteEntity(entity: Car) {
  entityToDelete.value = entity;
  deleteDialogOpen.value = true;
}

async function deleteEntity() {
  if (entityToDelete.value?._id) {
    await carDetailStore.executeDelete(entityToDelete.value._id);
    entityToDelete.value = null;
  }
}

function duplicateEntity(id: string) {
  entityIdToDuplicate.value = id;
  executeDuplicate()
}
</script>

<template>
  <AntTable
    :selected-row="selectedRow"
    :data="cars"
    :headers="tableHeaders"
    :loading="carListingStore.pending || carDetailStore.deleteStatus === 'pending' || duplicateStatus === 'pending'"
    :show-light-version="showLightVersion"
  >
    <template #cellContent="{header, element}">
      <div
        v-if="header.identifier === 'actions'"
        class="flex justify-end gap-2.5"
      >
        <AntButton
          :icon-left="faCopy"
          :size="ui.Size.sm"
          filled
          data-e2e="duplicate-button"
          @click="() => duplicateEntity(element._id)"
        />

        <AntButton
          :to="carRoutingStore.routing.getDetailRoute(element._id)"
          :icon-left="faPencil"
          :size="ui.Size.sm"
          data-e2e="edit-button"
          filled
        />

        <AntButton
          :icon-left="faTrash"
          :size="ui.Size.sm"
          filled
          data-e2e="delete-button"
          @click="() => openDeleteEntity(element)"
        />
      </div>
    </template>
  </AntTable>

  <AntDeleteDialog
    v-model:open="deleteDialogOpen"
    :entity="`${entityToDelete?.manufacturer} ${entityToDelete?.model}`"
    @confirm="deleteEntity"
  />
</template>


