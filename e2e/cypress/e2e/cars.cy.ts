import {useCrudListingTests} from '@antify/ui-test-utils';

useCrudListingTests({
  listingUrl: '/cockpit/cars',
  listingApiUrl: '/api/stores/car',
  loadFixtures: () => cy.loadFixtures(),
  truncateEntries: () => cy.truncateCars(),
}).runAllTests();

describe('Feature: Users can read all cars', () => {
  it('Scenario: On a filled database, the user should see list of cars', () => {
    cy.log('Given there are more than 100 entries in the database');
    cy.loadFixtures();

    cy.log('When I visit the listing page');
    cy.visit('/cockpit/cars');

    cy.log('Then I should see the table with manufacturer, model, type, color as table header');
    expect(cy.get('[data-e2e=table] th').contains('Manufacturer'));
    expect(cy.get('[data-e2e=table] th').contains('Model'));
    expect(cy.get('[data-e2e=table] th').contains('Type'));
    expect(cy.get('[data-e2e=table] th').contains('Color'));
  });
});


