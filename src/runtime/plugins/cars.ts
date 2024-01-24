import {useFetch} from "nuxt/app";
import {computed, reactive, ref} from "vue";
import {type Car, validator} from "../glue/plugins/car";
import {useRoute} from "vue-router";

export default defineNuxtPlugin((nuxtApp) => {
  const count = ref(0);
  const route = useRoute();
  const queryRef = computed(() => route.query);
  const router = useRouter();
  const uiClient = useUiClient();

  const allColors = ref([]);
  const allTypes = ref([]);

  const getDefaultData = (): Car => ({
    id: null,
    model: null,
    manufacturer: null,
    type: null,
    color: null,
    engine: {
      type: null,
      volumeInLiter: null,
      powerPs: null,
    }
  })
  const entity = ref(getDefaultData())

  const {
    data,
    error,
    execute,
    refresh,
    pending,
    status
  } = useFetch(
    `/api/plugins/cars`,
    {
      immediate: false,
      watch: false,
      query: queryRef,
      onResponse({response}) {
        if (response.status === 200) {
          count.value = response._data.count
          allColors.value = response._data.colors
          allTypes.value = response._data.types
        }
      }
    }
  )
  const refreshListing = async (resetPageQuery = true, pageQuery = 'p') => {
    if (resetPageQuery) {
      const query = {...route.query}

      delete query[pageQuery]

      await router.push({
        ...route,
        query
      })
    }

    await refresh();
  }
  const {
    error: readError,
    pending: readPending,
    execute: executeRead,
  } = useFetch(
    () => `/api/plugins/cars/${route.params.carId}`,
    {
      immediate: false,
      watch: false,
      async onResponse({response}) {
        await uiClient.handler.handleNotFoundResponse(response, '/cars')

        if (response.status === 200) {
          entity.value = response._data
        }
      }
    }
  )
  const {
    error: updateError,
    status: updateStatus,
    execute: executeUpdate,
  } = useFetch(
    () => `/api/plugins/cars/${route.params.carId}`,
    {
      method: "put",
      body: entity,
      immediate: false,
      watch: false,
      async onResponse({response}) {
        await uiClient.handler.handleNotFoundResponse(response, '/cars')

        if (response.status === 200) {
          entity.value = response._data
        }
      }
    }
  )
  const {
    error: createError,
    status: createStatus,
    execute: executeCreate,
  } = useFetch(
    () => `/api/plugins/cars/${route.params.carId}`,
    {
      method: "post",
      body: entity,
      immediate: false,
      watch: false,
      async onResponse({response}) {
        await uiClient.handler.handleNotFoundResponse(response, '/cars')

        if (response.status === 200) {
          entity.value = response._data

          router.replace({
            name: route.name,
            params: {
              carId: entity.value.id
            },
            query: route.query
          });
        }
      }
    }
  )
  const entityIdToDelete = ref<string | null>(null)
  const {
    error: deleteError,
    execute: _executeDelete,
    status: deleteStatus,
  } = useFetch(
    () => `/api/plugins/cars/${entityIdToDelete.value}`,
    {
      method: 'delete',
      immediate: false,
      watch: false,
      onResponse({response}) {
        if (response.status === 200) {
          routing.goToListingPage();
          refreshListing(false);
          nuxtApp.$uiModule.toaster.toastDeleted();
        }
      }
    }
  )
  const executeDelete = (id: string) => {
    entityIdToDelete.value = id

    return _executeDelete()
  }
  const isCreateContext = computed<boolean>(() => route.params.carId === 'create')
  const formDisabled = computed(() => uiClient.utils.isFormDisabled([updateStatus, createStatus, deleteStatus]))
  const _validator = reactive(validator)
  const save = async () => {
    _validator.validate(entity.value, isCreateContext.value ? 'client-post' : 'client-put')

    if (_validator.hasErrors()) {
      return nuxtApp.$uiModule.toaster.toastInfo('The form contains errors.\nPlease fix them before submitting.')
    }

    // If the user press enter fast time twice, prevent a second submit
    if (formDisabled.value) {
      return
    }

    if (isCreateContext.value) {
      await executeCreate()
    } else {
      await executeUpdate()
    }

    // TODO:: on error
    nuxtApp.$uiModule.toaster.toastUpdated()
  }
  const routing = {
    goToListingPage: (query = queryRef.value) => router.push(routing.getListingRoute(query)),
    goToDetailPage: (carId = 'create', query = queryRef.value) => router.push(routing.getDetailRoute(carId, query)),
    getListingRoute: (query = queryRef.value) => ({name: 'cars', query}),
    getDetailRoute: (carId = 'create', query = queryRef.value) => ({
      name: 'cars-carId',
      params: {carId},
      query
    })
  }

  return {
    provide: {
      cars: {
        routing,
        listing: {
          data,
          execute,
          error,
          pending,
          skeleton: uiClient.utils.createSkeleton(pending),
          refresh: refreshListing,
          status,
          count,
          allColors,
          allTypes,
        },
        item: {
          data: entity,
          readError,
          executeRead,
          readPending,
          formDisabled,
          save,
          saveAndNew: async () => {
            await save();

            await routing.goToDetailPage('create')
          },
          skeleton: computed(() => !isCreateContext.value ? readPending.value : false),
          resetData: () => {
            _validator.reset()

            entity.value = getDefaultData()
          },
          validator: _validator,
          isCreateContext,
          executeDelete,
          deleteStatus,
          deleteError,
          createError,
          updateError
        }
      },
    }
  }
});


