<script setup lang="ts">
// import {type SelectOption} from "@antify/ui-module";
import {useRouteQuery} from '@vueuse/router';
import CarTable from './CarTable.vue';
import {
  type CrudOptions,
  useCarListingStore,
  useCarRoutingStore,
  useCarContextStore,
  useCarDetailStore
} from '../../stores/car';
import {
	watch,
	computed,
	useRoute
} from '#imports';

const props = defineProps<CrudOptions>();
const routingStore = useCarRoutingStore();
const contextStore = useCarContextStore();
const detailStore = useCarDetailStore();
const listingStore = useCarListingStore();

routingStore.options = props;
contextStore.provider = props.provider;
contextStore.tenantId = props.tenantId;

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
})))
const filterTypeOptions = computed(() => listingStore.allTypes.map((color) => ({
  label: color,
  value: color
})))

watch(() => route.query, (to, from) => {
  if (uiClient.utils.queryChanged(from, to, ['color', 'type'])) {
    listingStore.refresh();
  }
})
// TODO:: move to store
watch(() => listingStore.error, (val) => uiClient.handler.handleResponseError(val));
watch(() => detailStore.readError, (val) => uiClient.handler.handleResponseError(val))
watch(() => detailStore.createError, (val) => uiClient.handler.handleResponseError(val))
watch(() => detailStore.updateError, (val) => uiClient.handler.handleResponseError(val))
watch(() => detailStore.deleteError, (val) => uiClient.handler.handleResponseError(val))

function resetFilters() {
  filterColor.value = null;
  filterType.value = null;
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
