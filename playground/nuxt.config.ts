export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@antify/ui-module',
		'@antify/app-context-module',
		'@antify/authorization-module',
		'@antify/database-module',
  ],
  ssr: false,
  devtools: {enabled: true},
	imports: {
		autoImport: false
	},
  exampleModule: {},
	authorizationModule: {
		jwtSecret: '#a!SuperSecret123',
		appHandlerFactoryPath: './appHandlerFactory',
		mainAppId: 'core',
		permissions: [
			{
				id: 'CAN_READ_SECRET_DATA',
				name: 'Can read secret data in playground'
			}
		],
	},
	appContextModule: {
		apps: [
			{
				id: 'core'
			},
			{
				id: 'tenant',
				isMultiTenant: true
			}
		],
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
