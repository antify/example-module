<script setup lang="ts">
// import {type SelectOption} from "@antify/ui-module";
import {useRouteQuery} from '@vueuse/router';
import CarTable from './CarTable.vue';
import {
	useCarListingStore,
	useCarRoutingStore,
} from '../../stores/car';
import {
	watch,
	computed,
	useRoute,
	useUiClient
} from '#imports';
import type {RouteParams} from 'vue-router';

const props = defineProps<{
	detailRouteName: string
	listingRouteName: string
	getDetailRouteParams?: () => RouteParams,
	getListingRouteParams?: () => RouteParams,
	entityIdentifier?: string
	createEntityIdentifier?: string
}>();
const routingStore = useCarRoutingStore();
const listingStore = useCarListingStore();

routingStore.options = props;

const route = useRoute();
const uiClient = useUiClient();
const filterColor = useRouteQuery<string | null>('color', null, {
	transform(val) {
		return val || null;
	},
});
const filterType = useRouteQuery<string | null>('type', null, {
	transform(val) {
		return val || null;
	},
});

// const filterColorOptions = computed<SelectOption[]>(() => allColors.value.map((color) => ({
//   label: color,
//   value: color
// })))
// const filterTypeOptions = computed<SelectOption[]>(() => allTypes.value.map((color) => ({
//   label: color,
//   value: color
// })))

const filterColorOptions = computed(() => listingStore.allColors.map((color) => ({
	label: color,
	value: color
})));
const filterTypeOptions = computed(() => listingStore.allTypes.map((color) => ({
	label: color,
	value: color
})));

watch(() => route.query, (to, from) => {
	if (uiClient.utils.queryChanged(from, to, ['color', 'type'])) {
		listingStore.refresh();
	}
});

function resetFilters() {
	filterColor.value = null;
	filterType.value = null;

	setTimeout(() => {
		listingStore.refresh();
	}, 200);
}
</script>

<template>
  <AntCrud :show-detail="routingStore.routing.isDetailPage.value">
    <template #search-section>
      <AntCrudTableFilter
        :full-width="routingStore.routing.isListingPage.value"
        :has-filter="filterColor !== null || filterType !== null"
        :skeleton="listingStore.skeleton"
        @search="() => listingStore.refresh()"
        @create="() => routingStore.routing.goToDetailPage()"
        @remove-filter="() => resetFilters()"
      >
        <template #dropdownContent>
          <!-- TODO:: Build example with multiple colors selectable (when AntTagInput is finished) -->
          <AntFormGroup>
            <AntSelect
              v-model="filterColor"
              label="Color"
              :options="filterColorOptions"
              nullable
            />

            <AntSelect
              v-model="filterType"
              label="Type"
              :options="filterTypeOptions"
              nullable
            />
          </AntFormGroup>
        </template>
      </AntCrudTableFilter>
    </template>

    <template #table-section>
      <CarTable :show-light-version="routingStore.routing.isDetailPage.value" />
    </template>

    <template #table-nav-section>
      <AntCrudTableNav
        :count="listingStore.count"
        :full-width="routingStore.routing.isListingPage.value"
        :skeleton="listingStore.skeleton"
        @change-items-per-page="() => listingStore.refresh()"
        @change-page="() => listingStore.refresh(false)"
      />
    </template>

    <slot />
  </AntCrud>
</template>
