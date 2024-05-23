import {
	defineNuxtModule,
	createResolver,
	addComponentsDir,
	addServerHandler,
	addImportsDir,
	installModule
} from '@nuxt/kit';
import {permissions} from './runtime/glue/permissions';

type ModuleOptions = {};

const moduleKey = 'exampleModule';

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'example-module', // TODO:: <- just use moduleKey as well?
		configKey: moduleKey,
	},
	async setup(options, nuxt) {
		// TODO:: check options + default values
		const {resolve} = createResolver(import.meta.url);
		const runtimeDir = resolve('runtime');

		nuxt.options.runtimeConfig[moduleKey] = options;

		// TODO:: what if an other module already installed it?
		await installModule('@pinia/nuxt')
		await installModule('@antify/database-module')

		// TODO:: check if authorization-module module is installed
		await installModule('@antify/authorization-module', {permissions})

		await addComponentsDir({
			path: resolve(runtimeDir, 'components'),
			prefix: 'ExampleModule',
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
