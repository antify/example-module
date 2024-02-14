export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@antify/ui-module',
    // '@antify/dev-module'
  ],
  ssr: false,
  devtools: false,
  exampleModule: {
    providers: [
      {
        id: 'core',
        isSingleTenancy: true,
      },
      {
        id: 'tenant',
        isSingleTenancy: false,
      },
    ],
  },
  nitro: {
    storage: {
      db: {
        driver: 'memory',
      }
    }
  },
  /**
   * Allow using packages outside the repo with "link:../../example-package".
   * Without strict, vite would throw 403 error.
   */
  vite: {
    server: {
      fs: {
        strict: false,
      }
    }
  }
});
