import {fileURLToPath} from 'url';
import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addServerHandler, addPlugin,
} from '@nuxt/kit';
import {type ContextConfigurationItem} from '@antify/context';

type ModuleOptions = {
  providers: ContextConfigurationItem[];
};

const moduleKey = 'exampleModule';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'example-module',
    configKey: moduleKey,
  },
  async setup(options, nuxt) {
    const {resolve} = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    nuxt.options.runtimeConfig.antNote = options;

    await addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: 'ExampleModule'
    });

    addPlugin(resolve(runtimeDir, 'plugins/cars'));

    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'));
    });

    addServerHandler({
      route: '/api/components/cars/car-table/duplicate/:carId',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/components/cars/car-table/duplicate/[carId].post'),
    });

    addServerHandler({
      route: '/api/plugins/cars/:carId',
      method: 'delete',
      handler: resolve(runtimeDir, 'server/api/plugins/cars/[carId].delete'),
    });

    addServerHandler({
      route: '/api/plugins/cars/:carId',
      method: 'get',
      handler: resolve(runtimeDir, 'server/api/plugins/cars/[carId].get'),
    });

    addServerHandler({
      route: '/api/plugins/cars/:carId',
      method: 'post',
      handler: resolve(runtimeDir, 'server/api/plugins/cars/[carId].post'),
    });

    addServerHandler({
      route: '/api/plugins/cars/:carId',
      method: 'put',
      handler: resolve(runtimeDir, 'server/api/plugins/cars/[carId].put'),
    });

    addServerHandler({
      route: '/api/plugins/cars',
      method: 'get',
      handler: resolve(runtimeDir, 'server/api/plugins/cars/index.get'),
    });
  },
});
