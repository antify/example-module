import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
	env: {
		// Defines if the app playground run's in a docker container or local on host
		PLAYGROUND_RUN_IN_DOCKER: !!process.env.CYPRESS_PLAYGROUND_RUN_IN_DOCKER || false
	}
});
