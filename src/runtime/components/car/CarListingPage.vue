<script setup lang="ts">
import {useRoute} from 'vue-router'
// import {type SelectOption} from "@antify/ui-module";
import {useRouteQuery} from '@vueuse/router';
import CarTable from './CarTable.vue';

const route = useRoute();
const {$cars} = useNuxtApp();
const {
  skeleton,
  refresh,
  count,
  allColors,
  allTypes,
} = $cars.listing;
const {
  createError,
  readError,
  updateError,
  deleteError
} = $cars.item;
const {
  goToDetailPage
} = $cars.routing;
const uiClient = useUiClient();
const isDetailPage = computed(() => route.name !== 'cars');
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
const filterColorOptions = computed(() => allColors.value.map((color) => ({
  label: color,
  value: color
})))
const filterTypeOptions = computed(() => allTypes.value.map((color) => ({
  label: color,
  value: color
})))

watch(() => route.query, (to, from) => {
  if (uiClient.utils.queryChanged(from, to, ['color', 'type'])) {
    refresh();
  }
})
watch(readError, () => uiClient.handler.handleResponseError(readError))
watch(createError, () => uiClient.handler.handleResponseError(createError))
watch(updateError, () => uiClient.handler.handleResponseError(updateError))
watch(deleteError, () => uiClient.handler.handleResponseError(deleteError))

function resetFilters() {
  filterColor.value = null;
  filterType.value = null;
}
</script>

<template>
  <AntCrud :show-detail="isDetailPage">
    <template #search-section>
      <AntCrudTableFilter
        :full-width="!isDetailPage"
        :has-filter="filterColor !== null || filterType !== null"
        :skeleton="skeleton"
        @search="() => refresh()"
        @create="() => goToDetailPage()"
        @removeFilter="() => resetFilters()"
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
      <CarTable :show-light-version="isDetailPage"/>
    </template>

    <template #table-nav-section>
      <AntCrudTableNav
        :count="count"
        :full-width="!isDetailPage"
        :skeleton="skeleton"
        @changeItemsPerPage="() => refresh()"
        @changePage="() => refresh(false)"
      />
    </template>

    <slot/>
  </AntCrud>
</template>
