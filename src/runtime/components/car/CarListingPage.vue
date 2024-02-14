<script setup lang="ts">
import {useRoute} from 'vue-router';
// import {type SelectOption} from "@antify/ui-module";
import {useRouteQuery} from '@vueuse/router';
import CarTable from './CarTable.vue';
import {
  type CrudOptions,
  useCarListingStore,
  useCarRoutingStore,
  useCarContextStore,
  useCarDetailStore
} from "../../stores/car";
import {watch, computed} from "#imports";

const props = defineProps<CrudOptions>();
const carRoutingStore = useCarRoutingStore();
const carContextStore = useCarContextStore();
const carDetailStore = useCarDetailStore();
const carListingStore = useCarListingStore();

carRoutingStore.options = props
carContextStore.provider = props.provider
carContextStore.tenantId = props.tenantId

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

const filterColorOptions = computed(() => carListingStore.allColors.map((color) => ({
  label: color,
  value: color
})))
const filterTypeOptions = computed(() => carListingStore.allTypes.map((color) => ({
  label: color,
  value: color
})))

watch(() => route.query, (to, from) => {
  if (uiClient.utils.queryChanged(from, to, ['color', 'type'])) {
    carListingStore.refresh();
  }
})
watch(() => carListingStore.error, (val) => uiClient.handler.handleResponseError(val));
watch(() => carDetailStore.readError, (val) => uiClient.handler.handleResponseError(val))
watch(() => carDetailStore.createError, (val) => uiClient.handler.handleResponseError(val))
watch(() => carDetailStore.updateError, (val) => uiClient.handler.handleResponseError(val))
watch(() => carDetailStore.deleteError, (val) => uiClient.handler.handleResponseError(val))

function resetFilters() {
  filterColor.value = null;
  filterType.value = null;
}
</script>

<template>
  <AntCrud :show-detail="carRoutingStore.routing.isDetailPage.value">
    <template #search-section>
      <AntCrudTableFilter
        :full-width="carRoutingStore.routing.isListingPage.value"
        :has-filter="filterColor !== null || filterType !== null"
        :skeleton="carListingStore.skeleton"
        @search="() => carListingStore.refresh()"
        @create="() => carRoutingStore.routing.goToDetailPage()"
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
      <CarTable :show-light-version="carRoutingStore.routing.isDetailPage.value" />
    </template>

    <template #table-nav-section>
      <AntCrudTableNav
        :count="carListingStore.count"
        :full-width="carRoutingStore.routing.isListingPage.value"
        :skeleton="carListingStore.skeleton"
        @change-items-per-page="() => carListingStore.refresh()"
        @change-page="() => carListingStore.refresh(false)"
      />
    </template>

    <slot />
  </AntCrud>
</template>
