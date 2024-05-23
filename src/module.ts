import {
	defineNuxtModule,
	createResolver,
	addComponentsDir,
	addServerHandler,
	addImportsDir,
	installModule
} from '@nuxt/kit';
// TODO:: add own permissions to global permissions
import {permissions} from './runtime/glue/permissions';

type ModuleOptions = {};

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'example-module',
		configKey: 'exampleModule',
	},
	async setup(options, nuxt) {
		// TODO:: check options + default values
		const {resolve} = createResolver(import.meta.url);
		const runtimeDir = resolve('runtime');

		// TODO:: what if an other module already installed it?
		await installModule('@pinia/nuxt')

		// TODO:: check if authorization and database-module module is activated in nuxt config

		await addComponentsDir({
			path: resolve(runtimeDir, 'components'),
			prefix: 'ExampleModule',
			pathPrefix: false,
			global: true
		});

		addImportsDir(resolve(runtimeDir, 'composables'));

		addServerHandler({
			route: '/api/components/cars/car-table/duplicate/:carId',
			method: 'post',
			handler: resolve(runtimeDir, 'server', 'api', 'components', 'cars', 'car-table', 'duplicate', '[carId].post'),
		});

		addServerHandler({
			route: '/api/stores/car/:carId',
			method: 'delete',
			handler: resolve(runtimeDir, 'server', 'api', 'stores', 'car', '[carId].delete'),
		});

		addServerHandler({
			route: '/api/stores/car/:carId',
			method: 'get',
			handler: resolve(runtimeDir, 'server', 'api', 'stores', 'car', '[carId].get'),
		});

		addServerHandler({
			route: '/api/stores/car/:carId',
			method: 'post',
			handler: resolve(runtimeDir, 'server', 'api', 'stores', 'car', '[carId].post'),
		});

		addServerHandler({
			route: '/api/stores/car/:carId',
			method: 'put',
			handler: resolve(runtimeDir, 'server', 'api', 'stores', 'car', '[carId].put'),
		});

		addServerHandler({
			route: '/api/stores/car',
			method: 'get',
			handler: resolve(runtimeDir, 'server', 'api', 'stores', 'car', 'index.get'),
		});
	},
});
