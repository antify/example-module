export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@antify/ui-module',
    // '@antify/database-module',
    // '@antify/auth-module',
    // '@antify/dev-module'
  ],
  ssr: false,
  devtools: {enabled: true},
  exampleModule: {},
	authModule: {
		databaseHandler: './server/datasources/db/core/database-handler',
		jwtSecret: '#a!SuperSecret123',
		passwordSalt: '#a!SaveSalt123',
		permissions: [
			{
				id: 'CAN_READ_SECRET_DATA',
				name: 'Can read secret data in playground'
			}
		]
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
