/**
 * TODO:: describe it bedder
 *
 * - Only general crud things are tested here.
 * - It tests, if the module dev implemented the basic crud functionality correctly.
 *
 * TODO:: Feature und Scenario sind weniger als userstory beschrieben
 * TODO:: Überall einen Background einbauen (Ich bin eingeloggt o. ä.)
 */
describe('CRUD Listing', () => {
  describe('Feature: Load and show the listing page', () => {
    it('Scenario: Initial load the listing page', () => {
      cy.log('When I visit the listing page');
      cy.visit('/cockpit/cars');

      cy.log('Then I should see all elements of the page in skeleton state');
      cy.get('[data-e2e=crud] [data-e2e=skeleton]').should('exist');

      cy.log('When the data are loaded');
      cy.log('Then I should see no elements in skeleton state anymore');
      cy.get('[data-e2e=crud] [data-e2e=skeleton]').should('not.exist');

      cy.log('And I should see the table filter bar with search input field, filter button and create button');
      cy.get('[data-e2e=crud-table-filter] [data-e2e=search]').should('exist');
      cy.get('[data-e2e=crud-table-filter] [data-e2e=create-button]').should('exist');

      cy.log('And I should see the pagination bar with number of entries, items per page and the page switcher');
      cy.get('[data-e2e=crud-table-nav] [data-e2e=items-per-page]').should('exist');
      cy.get('[data-e2e=crud-table-nav] [data-e2e=pagination]').should('exist');
    });

    it('Scenario: On a filled database, the user should see a list of entries', () => {
      cy.log('Given there are 100 entries in the database');
      cy.loadFixtures(); // TODO:: when outsource, how to let the main component truncate correctly?

      cy.log('When I visit the listing page');
      cy.visit('/cockpit/cars'); // TODO:: when outsource, how to let get the correct url?

      cy.log('Then I should see the table with duplicate, edit and delete buttons for each row');
      cy.get('[data-e2e=table] [data-e2e=duplicate-button]').should('exist');
      cy.get('[data-e2e=table] [data-e2e=edit-button]').should('exist');
      cy.get('[data-e2e=table] [data-e2e=delete-button]').should('exist');

      cy.log('And I should see that there are 0 - 20 of 100 entries');
      cy.get('[data-e2e=items-per-page]').contains('Items per page');
      cy.get('[data-e2e=items-per-page] [data-e2e=select]').contains('20');
      cy.get('[data-e2e=items-per-page]').contains('0 - 20');
      cy.get('[data-e2e=items-per-page]').contains('of');
      cy.get('[data-e2e=items-per-page]').contains('100');

      cy.log('And I should see the pagination with 5 pages');
      cy.get('[data-e2e=crud-table-nav] [data-e2e=pagination]').contains('1');
      cy.get('[data-e2e=crud-table-nav] [data-e2e=pagination]').contains('2');
      cy.get('[data-e2e=crud-table-nav] [data-e2e=pagination]').contains('3');
      cy.get('[data-e2e=crud-table-nav] [data-e2e=pagination]').contains('...');
      cy.get('[data-e2e=crud-table-nav] [data-e2e=pagination]').contains('5');
    });

    it('Scenario: On an empty database, a describe text should get shown', () => {
      cy.log('Given there are no entries in the database');
      cy.truncateCars();

      cy.log('When I visit the listing page');
      cy.visit('/cockpit/cars');

      cy.log('Then I should see the table with no entries and a describe text');
      cy.get('[data-e2e=table]').contains('We couldn\'t find any entry');

      cy.log('And I should see the pagination with only one page');
      cy.get('[data-e2e=crud-table-nav] [data-e2e=pagination]').contains('1');
    });

    // TODO:: 500 error case
  });

  // TODO:: Test when change items per page to 50

  describe('Feature: Paginate listing table', () => {
    it('Scenario: Switch from page one to two', () => {
      cy.log('Given there are 100 entries in the database');
      cy.loadFixtures();

      cy.log('And I am on the listing page');
      cy.visit('/cockpit/cars');

      cy.log('When I click on the second page');
      cy.get('[data-e2e=pagination] [data-e2e=button]:contains("2")').click();

      cy.log('Then I see that the table is in loading state');
      cy.get('[data-e2e=crud] [data-e2e=spinner]').should('exist');

      cy.log('When the data are loaded');
      cy.log('Then I see no spinner anymore');
      cy.get('[data-e2e=crud] [data-e2e=spinner]').should('not.exist');

      cy.log('And in pagination, the second page is active');
      cy.get('[data-e2e=pagination] [data-e2e=button]:contains("2")').should('have.data', 'e2eColorType', 'primary');

      cy.log('And the current page is in url query');
      cy.url().should('contain', 'p=2');
    });

    it('Scenario: Switch from page one to two with 0 entries', () => {

    });

    // TODO:: test visit page with query
  });

  describe('Feature: Delete entries from table', () => {
    it('Scenario: Delete an entry from listing page', () => {
      cy.log('Given there are 100 entries in the database');
      cy.loadFixtures();

      cy.log('And I am on the listing page');
      cy.visit('/cockpit/cars');

      cy.log('When I click on delete button on the first entry');
      cy.get('table tr:first-child [data-e2e=delete-button]').click()

      cy.log('Then I see a delete dialog which asks me if I am sure to delete the entry');
      cy.get('[data-e2e=delete-dialog]').should('be.visible');

      cy.log('When I click on the delete button in the delete dialog');
      cy.get('[data-e2e=delete-dialog] [data-e2e=button]:contains("Delete")').click(); // TODO:: Change from data-e2e=button to data-e2e=delete-button

      cy.log('Then the table is in loading state');
      cy.get('[data-e2e=table] [data-e2e=spinner]').should('exist');

      cy.log('And the dialog is closed');
      cy.get('[data-e2e=delete-dialog]').should('not.exist');

      cy.log('And the items per page shows that there are 99 entries');
      cy.get('[data-e2e=items-per-page]').should('contain', '99');

      cy.log('And a toast is visible with the message "deleted"');
      cy.get('[data-e2e=toast]:contains("Deleted")').should('be.visible');
    })
  });

  describe('Feature: Filtering the table', () => {
    it('Scenario: On a filled database, the user filter and get some results', () => {
      cy.log('Given there are 100 entries in the database');
      cy.loadFixtures();

      cy.log('And I am on the listing page');
      cy.visit('/cockpit/cars');

      cy.log('When I type "a b c" into the search bar');
      cy.get('[data-e2e=search] input').type('a');

      cy.log('Then the search query is in the url query');
      cy.url().should('contain', 'search=a');

      cy.log('Then I see the table is in loading state');
      cy.get('[data-e2e=table] [data-e2e=spinner]').should('exist');

      cy.log('When the data are loaded');
      cy.log('Then I see no spinner anymore');
      cy.get('[data-e2e=table] [data-e2e=spinner]').should('not.exist');

      cy.log('And I see, that the amount of entries is less than 100');
      cy.get('[data-e2e=total-items]').should('have.length.lessThan', 100);

      cy.log('And I see the table with entries');
      cy.get('[data-e2e=table] tr').should('have.length.lessThan', 100);
    });

    it('Scenario: On a filled database, the user filter and get no results', () => {
      cy.log('Given there are 100 entries in the database');
      cy.loadFixtures();

      cy.log('And I am on the listing page');
      cy.visit('/cockpit/cars');

      cy.log('When I type "a b c" into the search bar');
      cy.get('[data-e2e=search] input').type('a b c d e f g');

      cy.log('Then the search query is in the url query');
      cy.url().should('contain', 'search=a+b+c+d+e+f+g');

      cy.log('Then I see the table is in loading state');
      cy.get('[data-e2e=table] [data-e2e=spinner]').should('exist');

      cy.log('When the data are loaded');
      cy.log('Then I see no spinner anymore');
      cy.get('[data-e2e=table] [data-e2e=spinner]').should('not.exist');

      cy.log('And I see the the amount of entries is 0');
      cy.get('[data-e2e=items-per-page] [data-e2e=total-items]').should('contain', '0');

      cy.log('And I see the pagination with only one page');
      cy.get('[data-e2e=pagination]').should('contain', '1');

      cy.log('And I see the table with no entries');
      cy.get('[data-e2e=table]').should('contain', 'We couldn\'t find any entry');
    });
  });
});
