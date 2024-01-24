<script lang="ts" setup>
import type {TableHeader} from "@antify/ui-module";
import {faCopy, faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import {ref} from 'vue';
import {type Car} from "../../glue/plugins/car";
import {useFetch} from "nuxt/app";

defineProps<{
  showLightVersion: boolean
}>();

const {$cars, $uiModule} = useNuxtApp();
const route = useRoute();
const ui = useUi();
const {
  executeDelete,
  deleteStatus,
  deleteError
} = $cars.item;
const {
  execute,
  data,
  pending,
  error,
  refresh
} = $cars.listing;
const {
  getDetailRoute,
  goToDetailPage,
} = $cars.routing;
const deleteDialogOpen = ref(false);
const entityToDelete = ref<Car | null>(null);
const tableHeaders: TableHeader[] = [
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
const selectedRow = computed(() => route.params.carId ? data.value?.cars?.find((car) => car.id === route.params.carId) : undefined);
const cars = computed(() => {
  return data.value?.cars?.map((car) => {
    car.link = getDetailRoute(car.id);

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
    immediate: false,
    watch: false,
    onResponse({response}) {
      if (response.status === 200) {
        goToDetailPage(response._data.id);
        refresh(false);
        $uiModule.toaster.toastDuplicated();
      }
    }
  }
)

onMounted(execute);

watch(error, () => useUiClient().handler.handleResponseError(error));
watch(deleteError, () => useUiClient().handler.handleResponseError(deleteError));
watch(duplicateError, () => useUiClient().handler.handleResponseError(duplicateError));

function openDeleteEntity(entity: Car) {
  entityToDelete.value = entity;
  deleteDialogOpen.value = true;
}

async function deleteEntity() {
  if (entityToDelete.value?.id) {
    await executeDelete(entityToDelete.value.id);
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
    :loading="pending || deleteStatus === 'pending' || duplicateStatus === 'pending'"
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
          @click="() => duplicateEntity(element.id)"
        />

        <AntButton
          :to="getDetailRoute(element.id)"
          :icon-left="faPencil"
          :size="ui.Size.sm"
          filled
        />

        <AntButton
          :icon-left="faTrash"
          :size="ui.Size.sm"
          filled
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


