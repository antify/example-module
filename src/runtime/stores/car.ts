import {type LocationQueryRaw, type RouteParams} from 'vue-router';
import {type Car, validator} from '../glue/stores/car';
import {
	ref,
	useFetch,
	useRoute,
	reactive,
	computed,
	useRouter,
	showError,
	useNuxtApp,
	useUiClient,
	useAuthResponseErrorHandler
} from '#imports';
import {defineStore, storeToRefs} from 'pinia';

export const useCarListingStore = defineStore('car-listing', () => {
	const router = useRouter();
	const uiClient = useUiClient();
	const query = computed(() => router.currentRoute.value.query);

	const fetch = useFetch(
		'/api/stores/car',
		{
			query,
			watch: false,
			immediate: false,
			onResponse({response}) {
				useAuthResponseErrorHandler(response);

				// TODO:: remove if https://github.com/antify/ui-module/issues/45 is implemented
				if (response.status === 500) {
					showError(response._data)
				}
			}
		}
	)

	return {
		data: fetch.data,
		execute: fetch.execute,
		pending: fetch.pending,
		skeleton: uiClient.utils.createSkeleton(fetch.pending),
		error: fetch.error,
		refresh: async (resetPageQuery = true, pageQuery = 'p') => {
			if (resetPageQuery) {
				const query = {...router.currentRoute.value.query}

				delete query[pageQuery]

				await router.push({
					...router.currentRoute.value,
					query
				})
			}

			await fetch.refresh();
		},
		allColors: computed(() => fetch.data.value?.colors || []),
		allTypes: computed(() => fetch.data.value?.types || []),
		count: computed(() => fetch.data.value?.count || 0),
	}
})

export const useCarRoutingStore = defineStore('car-routing', () => {
	const options = ref<CrudRoutingOptions | null>(null)

	return {
		options,
		routing: computed(() => {
			if (!options.value) {
				throw new Error('carCrudOptionsStore is not initialized. Set options property before using it.')
			}

			return useCrudRouting(
				options.value.detailRouteName,
				options.value.listingRouteName,
				options.value.getDetailRouteParams,
				options.value.getListingRouteParams,
				options.value.entityIdentifier,
				options.value.createEntityIdentifier
			)
		})
	}
})

export const useCarDetailStore = defineStore('car-detail', () => {
	const router = useRouter();
	const nuxtApp = useNuxtApp();
	const uiClient = useUiClient();
	const routingStore = useCarRoutingStore();
	const {routing} = storeToRefs(routingStore);
	const listingStore = useCarListingStore();
	const getDefaultData = (): Car => ({
		_id: null,
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
		error: readError,
		pending: readPending,
		execute: executeRead,
	} = useFetch(
		() => `/api/stores/car/${router.currentRoute.value.params.carId}`,
		{
			immediate: false,
			watch: false,
			async onResponse({response}) {
				useAuthResponseErrorHandler(response);
				await uiClient.handler.handleNotFoundResponse(response, routingStore.routing.getListingRoute())

				if (response.status === 200) {
					entity.value = response._data
				}

				// TODO:: remove if https://github.com/antify/ui-module/issues/45 is implemented
				if (response.status === 500) {
					showError(response._data)
				}
			}
		}
	)
	const {
		error: updateError,
		status: updateStatus,
		execute: executeUpdate,
	} = useFetch(
		() => `/api/stores/car/${router.currentRoute.value.params.carId}`,
		{
			method: 'put',
			body: entity,
			immediate: false,
			watch: false,
			async onResponse({response}) {
				useAuthResponseErrorHandler(response);
				await uiClient.handler.handleNotFoundResponse(response, routingStore.routing.getListingRoute())

				if (response.status === 200) {
					entity.value = response._data
				}

				// TODO:: remove if https://github.com/antify/ui-module/issues/45 is implemented
				if (response.status === 500) {
					showError(response._data)
				}
			}
		}
	)
	const {
		error: createError,
		status: createStatus,
		execute: executeCreate,
	} = useFetch(
		() => `/api/stores/car/${router.currentRoute.value.params.carId}`,
		{
			method: 'post',
			body: entity,
			immediate: false,
			watch: false,
			async onResponse({response}) {
				useAuthResponseErrorHandler(response);
				await uiClient.handler.handleNotFoundResponse(response, routingStore.routing.getListingRoute())

				if (response.status === 200) {
					entity.value = response._data

					routingStore.routing.goToDetailPage(entity.value._id as string)
				}

				// TODO:: remove if https://github.com/antify/ui-module/issues/45 is implemented
				if (response.status === 500) {
					showError(response._data)
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
		() => `/api/stores/car/${entityIdToDelete.value}`,
		{
			method: 'delete',
			immediate: false,
			watch: false,
			onResponse({response}) {
				useAuthResponseErrorHandler(response);

				if (response.status === 200) {
					listingStore.refresh(false);
					routingStore.routing.goToListingPage();
					nuxtApp.$uiModule.toaster.toastDeleted();
				}

				// TODO:: remove if https://github.com/antify/ui-module/issues/45 is implemented
				if (response.status === 500) {
					showError(response._data)
				}
			}
		}
	)
	const executeDelete = (id: string) => {
		entityIdToDelete.value = id

		return _executeDelete()
	}
	const formDisabled = computed(() => uiClient.utils.isFormDisabled([updateStatus, createStatus, deleteStatus]))
	const _validator = reactive(validator)

	return {
		entity,
		readError,
		executeRead,
		readPending,
		formDisabled,
		save: async () => {
			_validator.validate(entity.value, routing.value.isCreatePage.value ? 'client-post' : 'client-put')

			if (_validator.hasErrors()) {
				return nuxtApp.$uiModule.toaster.toastInfo('The form contains errors.\nPlease fix them before submitting.')
			}

			// If the user press enter fast time twice, prevent a second submit
			if (formDisabled.value) {
				return
			}

			if (routing.value.isCreatePage.value) {
				await executeCreate()
			} else {
				await executeUpdate()
			}

			// TODO:: on error
			nuxtApp.$uiModule.toaster.toastUpdated()
		},
		saveAndNew: async () => {
			_validator.validate(entity.value, routing.value.isCreatePage.value ? 'client-post' : 'client-put')

			if (_validator.hasErrors()) {
				return nuxtApp.$uiModule.toaster.toastInfo('The form contains errors.\nPlease fix them before submitting.')
			}

			// If the user press enter fast time twice, prevent a second submit
			if (formDisabled.value) {
				return
			}

			await executeCreate()

			entity.value = getDefaultData()

			// TODO:: on error
			nuxtApp.$uiModule.toaster.toastUpdated()
			await routing.value.goToDetailPage()
		},
		skeleton: computed(() => !routingStore.routing.isCreatePage.value ? readPending.value : false),
		resetData: () => {
			_validator.reset()

			entity.value = getDefaultData()
		},
		validator: _validator,
		executeDelete,
		deleteStatus,
		deleteError,
		createError,
		updateError
	}
})

// TODO:: move crud routing to helper (may ui-module?)
// TODO:: do not use it as store
export type CrudRoutingOptions = {
	detailRouteName: string
	listingRouteName: string
	getDetailRouteParams?: () => RouteParams,
	getListingRouteParams?: () => RouteParams,
	entityIdentifier?: string
	createEntityIdentifier?: string
}

const useCrudRouting = (
	detailRouteName: string,
	listingRouteName: string,
	getDetailRouteParams: () => RouteParams = () => ({}),
	getListingRouteParams: () => RouteParams = () => ({}),
	entityIdentifier: string = 'entityId',
	createEntityIdentifier: string = 'create'
) => {
	const route = useRoute();
	const router = useRouter();
	const isDetailPage = computed<boolean>(() => {
		// Use includes, because for example for detail pace cars-carId, cars-carId-engine is a detail page too.
		// TODO:: foo-{detailRouteName}-bar would be valid too. Only {detailRouteName}-* should be valid.
		return (route.name as string | undefined)?.includes(detailRouteName || '') || false;
	});

	return {
		isListingPage: computed<boolean>(() => route.name === listingRouteName),
		isDetailPage,
		isUpdatePage: computed<boolean>(() =>
			isDetailPage.value &&
			route.params[entityIdentifier] !== createEntityIdentifier),
		isCreatePage: computed<boolean>(() =>
			isDetailPage.value &&
			route.params[entityIdentifier] === createEntityIdentifier),
		getDetailRoute(entityId: string | string[], query: LocationQueryRaw = route.query) {
			return {
				name: detailRouteName,
				params: {
					...getDetailRouteParams(),
					[entityIdentifier]: entityId
				},
				query
			}
		},
		getDetailSubRoute(
			entityId: string | string[],
			subRouteNameExtension: string,
			query: LocationQueryRaw = route.query
		) {
			return {
				name: `${detailRouteName}-${subRouteNameExtension}`,
				params: {
					...getDetailRouteParams(),
					[entityIdentifier]: entityId
				},
				query
			}
		},
		getListingRoute(query: LocationQueryRaw = route.query) {
			return {
				name: listingRouteName,
				params: getListingRouteParams(),
				query
			}
		},
		getEntityId() {
			const entityId = route.params[entityIdentifier];

			if (entityId === undefined) {
				throw new Error(`Entity identifier "${entityIdentifier}" is not set in route.params. Make sure you set it in route ` +
					'and this function is called on a detail page.');
			}

			return entityId;
		},
		// TODO:: use the given query and merge it into route.query
		goToListingPage(query: LocationQueryRaw = route.query) {
			return router.push(this.getListingRoute(query))
		},
		goToDetailPage(
			entityId: string | string[] = 'create',
			query = route.query
		) {
			return router.push(this.getDetailRoute(entityId, query))
		},
		goToDetailSubPage(subRouteNameExtension: string, query: LocationQueryRaw = route.query) {
			return router.push(this.getDetailSubRoute(subRouteNameExtension, query))
		}
	}
}

