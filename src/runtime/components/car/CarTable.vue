<script lang="ts" setup>
// import type {TableHeader} from "@antify/ui-module";
import {type Car} from '../../glue/stores/car';
import {
	useCarListingStore,
	useCarRoutingStore,
	useCarDetailStore,
} from '../../stores/car';
import {
	onMounted,
	ref,
	useNuxtApp,
	useRoute,
	computed,
	useUi,
	showError,
	useFetch,
	useUiClient,
	useAuthResponseErrorHandler
} from '#imports';

defineProps<{
	showLightVersion: boolean
}>();

const detailStore = useCarDetailStore();
const routingStore = useCarRoutingStore();
const listingStore = useCarListingStore();
const {$uiModule} = useNuxtApp();
const route = useRoute();
const ui = useUi();
const uiClient = useUiClient();
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
const selectedRow = computed(() => route.params.carId ? listingStore.data?.cars?.find((car) => car._id === route.params.carId) : undefined);
const cars = computed(() => {
	return listingStore.data?.cars?.map((car) => {
		car.link = routingStore.routing.getDetailRoute(car._id);

		return car;
	}) || [];
});
const entityIdToDuplicate = ref<string | null>(null);
const {
	execute: executeDuplicate,
	status: duplicateStatus,
} = useFetch(
	() => `/api/components/cars/car-table/duplicate/${entityIdToDuplicate.value}`,
	{
		method: 'post',
		immediate: false,
		watch: false,
		async onResponse({response}) {
			useAuthResponseErrorHandler(response);

			switch (response.status) {
				case 500:
					showError(response._data);
					break;
				case 200:
					await uiClient.handler.handleNotFoundResponse(response, routingStore.routing.getListingRoute());

					routingStore.routing.goToDetailPage(response._data._id);
					listingStore.refresh(false);
					$uiModule.toaster.toastDuplicated();
					break;
			}
		}
	}
);

onMounted(() => listingStore.execute());

function openDeleteEntity(entity: Car) {
	entityToDelete.value = entity;
	deleteDialogOpen.value = true;
}

async function deleteEntity() {
	if (entityToDelete.value?._id) {
		await detailStore.executeDelete(entityToDelete.value._id);
		entityToDelete.value = null;
	}
}

function duplicateEntity(id: string) {
	entityIdToDuplicate.value = id;
	executeDuplicate();
}
</script>

<template>
  <AntTable
    :selected-row="selectedRow"
    :data="cars"
    :headers="tableHeaders"
    :loading="listingStore.pending || detailStore.deleteStatus === 'pending' || duplicateStatus === 'pending'"
    :show-light-version="showLightVersion"
  >
    <template #cellContent="{header, element}">
      <div
        v-if="header.identifier === 'actions'"
        class="flex justify-end gap-2.5"
      >
        <AntDuplicateButton
          icon-variant
          :size="ui.Size.sm"
          @click="() => duplicateEntity(element._id)"
        />

        <AntEditButton
          icon-variant
          :to="routingStore.routing.getDetailRoute(element._id)"
          :size="ui.Size.sm"
        />

        <AntDeleteButton
          icon-variant
          :size="ui.Size.sm"
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


