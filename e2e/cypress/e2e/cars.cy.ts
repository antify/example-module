import {useCrudListingTests, type ListingConfig} from '@antify/e2e-test-utils';

const config: ListingConfig  = {
	listingUrl: '/cockpit/cars',
	listingApiUrl: '/api/stores/car',
	loadFixtures: () => cy.loadFixtures(),
	truncateEntries: () => cy.truncateCars(),
	tokenCookieKey: 'antt',
	validJwtWithCrudPermissions: 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IiIsImlzU3VwZXJBZG1pbiI6dHJ1ZSwicHJvdmlkZXJzIjpbXSwiZXhwIjozMjUwMzY3NjQwMCwiaWF0IjoxNzEwOTI0MzI2fQ.PMDZuixfvXwUfzCzVC3YXzefFi5F_SY191T7MmOFuBk',
	validJwtWithoutCrudPermissions: 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IiIsImlzU3VwZXJBZG1pbiI6ZmFsc2UsInByb3ZpZGVycyI6W10sImV4cCI6MzI1MDM2NzY0MDAsImlhdCI6MTcxMDkyNTA4NX0.GJh20YBmT_CYsPEXONL_1LLlHjCI5Ue5mVJJXi4VXEw',
}

useCrudListingTests(config ,
	{
		loadAndShowTheListingPage: {
			scenarioInitialLoadTheListingPage: {
				whenDataIsLoaded: () => {
					cy.log('Then I should see the table with manufacturer, model, type and color as table header');
					expect(cy.get('[data-e2e=table] th').contains('Manufacturer'));
					expect(cy.get('[data-e2e=table] th').contains('Model'));
					expect(cy.get('[data-e2e=table] th').contains('Type'));
					expect(cy.get('[data-e2e=table] th').contains('Color'));
					expect(cy.get('[data-e2e=table] th').should('have.length', 5));
				}
			}
		},
		filteringTheTable: {
			customFilterScenarios: () => {
				it('Scenario: On a filled database, the user filter by color and get some results', () => {
					// testCustomTableFilterScenario({
					// 	filterAction: () => {
					// 		cy.log('When I change the color filter to "red"');
					// 		// TODO:: Test Color filter
					// 		cy.get('[data-e2e=crud-table-filter] [data-e2e=dropdown]').click();
					// 		cy.get('[data-e2e=crud-table-filter] [data-e2e=dropdown]').click();
					// 	}
					// }, config)
				})
			}
		}
	}).runAllTests();
